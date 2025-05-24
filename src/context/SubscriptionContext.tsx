
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Subscription } from '@/types/ransomware';
import { fetchAllVictims } from '@/services/ransomwareAPI';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (email: string, countries: string[] | null) => Promise<void>;
  verifySubscription: (token: string) => Promise<boolean>;
  unsubscribe: (token: string) => Promise<boolean>;
  loading: boolean;
  getVerificationLink: (email: string) => string | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedTime, setLastProcessedTime] = useState<string>(localStorage.getItem('lastProcessedTime') || new Date().toISOString());

  // Check for rate limiting (max 3 attempts per email per 24 hours)
  const checkRateLimit = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('subscription_attempts')
      .select('id')
      .eq('email', email)
      .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error checking rate limit:', error);
      return true; // Allow on error
    }

    return data.length < 3;
  };

  // Log subscription attempt
  const logSubscriptionAttempt = async (email: string) => {
    await supabase
      .from('subscription_attempts')
      .insert({ email });
  };

  // Check for new victims and send notifications
  const checkAndNotifyNewVictims = async () => {
    try {
      console.log("Checking for new ransomware victims...");
      
      // Get all active subscriptions
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('is_active', true);

      if (subsError || !activeSubscriptions || activeSubscriptions.length === 0) {
        console.log("No active subscriptions found");
        return;
      }

      // Fetch latest victims
      const allVictims = await fetchAllVictims();
      
      // Filter victims discovered after last processed time
      const newVictims = allVictims.filter(victim => {
        const victimDate = new Date(victim.discovered || victim.published || victim.attackdate || '');
        const lastProcessed = new Date(lastProcessedTime);
        return victimDate > lastProcessed;
      });

      if (newVictims.length === 0) {
        console.log("No new victims found");
        return;
      }

      console.log(`Found ${newVictims.length} new victims, sending notifications...`);

      // Send notifications to each subscriber
      for (const subscription of activeSubscriptions) {
        let relevantVictims = newVictims;
        
        // Filter by countries if specified
        if (subscription.countries && subscription.countries.length > 0) {
          relevantVictims = newVictims.filter(victim => 
            subscription.countries!.includes(victim.country || "Unknown")
          );
        }

        if (relevantVictims.length > 0) {
          try {
            const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-notification-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabase.supabaseKey}`,
              },
              body: JSON.stringify({
                subscription_id: subscription.id,
                email: subscription.email,
                victims: relevantVictims,
                countries: subscription.countries
              }),
            });

            if (response.ok) {
              console.log(`Notification sent to ${subscription.email} for ${relevantVictims.length} victims`);
            } else {
              console.error(`Failed to send notification to ${subscription.email}`);
            }
          } catch (error) {
            console.error(`Error sending notification to ${subscription.email}:`, error);
          }
        }
      }

      // Update last processed time
      const newLastProcessedTime = new Date().toISOString();
      setLastProcessedTime(newLastProcessedTime);
      localStorage.setItem('lastProcessedTime', newLastProcessedTime);

    } catch (error) {
      console.error("Error in checkAndNotifyNewVictims:", error);
    }
  };

  // Set up data refresh every 4 hours
  useEffect(() => {
    // Check immediately on mount
    checkAndNotifyNewVictims();
    
    // Set up interval for every 4 hours
    const intervalId = setInterval(checkAndNotifyNewVictims, 4 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [lastProcessedTime]);

  const addSubscription = async (email: string, countries: string[] | null) => {
    try {
      setLoading(true);

      // Check rate limiting
      const withinLimit = await checkRateLimit(email);
      if (!withinLimit) {
        toast.error("Đã đạt giới hạn đăng ký", {
          description: "Bạn chỉ có thể thử đăng ký tối đa 3 lần trong 24 giờ."
        });
        return;
      }

      // Log the attempt
      await logSubscriptionAttempt(email);

      // Check if email already exists
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id, is_active')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.is_active) {
          toast.error("Email đã được đăng ký", {
            description: "Email này đã được đăng ký để nhận thông báo."
          });
          return;
        } else {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ 
              is_active: true, 
              countries: countries,
              updated_at: new Date().toISOString() 
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;

          toast.success("Đăng ký đã được kích hoạt lại!");
          return;
        }
      }

      // Create new subscription
      const { data: newSubscription, error } = await supabase
        .from('subscriptions')
        .insert({
          email,
          countries: countries || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Send welcome email
      const welcomeResponse = await fetch(`${supabase.supabaseUrl}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email,
          countries: countries || undefined,
          unsubscribe_token: newSubscription.unsubscribe_token
        }),
      });

      if (!welcomeResponse.ok) {
        console.error('Failed to send welcome email');
      }

      toast.success("Đăng ký thành công!", {
        description: "Bạn sẽ nhận được email xác nhận và thông báo khi có nạn nhân mới."
      });

      // Update local state
      setSubscriptions(prev => [...prev, {
        id: newSubscription.id,
        email: newSubscription.email,
        verified: true, // No verification needed per requirements
        createdAt: newSubscription.created_at,
        countries: newSubscription.countries || undefined,
        unsubscribeToken: newSubscription.unsubscribe_token,
      }]);

    } catch (error) {
      console.error("Failed to add subscription:", error);
      toast.error("Không thể đăng ký", {
        description: "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."
      });
    } finally {
      setLoading(false);
    }
  };

  // These functions are kept for compatibility but not used in new flow
  const verifySubscription = async (token: string): Promise<boolean> => {
    return true; // No verification needed
  };

  const unsubscribe = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/unsubscribe?token=${token}`);
      return response.ok;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      return false;
    }
  };

  const getVerificationLink = (email: string): string | undefined => {
    return undefined; // No verification needed
  };

  const value = {
    subscriptions,
    addSubscription,
    verifySubscription,
    unsubscribe,
    loading,
    getVerificationLink,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
