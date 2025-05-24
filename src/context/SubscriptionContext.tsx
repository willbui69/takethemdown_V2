
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

// Supabase configuration constants
const SUPABASE_URL = "https://euswzjdcxrnuupcyiddb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

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
      console.log("🔔 Starting notification check process...");
      console.log("📅 Last processed time:", lastProcessedTime);
      
      // Get all active subscriptions
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('is_active', true);

      if (subsError) {
        console.error("❌ Error fetching subscriptions:", subsError);
        return;
      }

      if (!activeSubscriptions || activeSubscriptions.length === 0) {
        console.log("📭 No active subscriptions found");
        return;
      }

      console.log(`📧 Found ${activeSubscriptions.length} active subscriptions`);

      // Fetch latest victims
      console.log("🔍 Fetching latest victim data...");
      const allVictims = await fetchAllVictims();
      console.log(`📊 Total victims fetched: ${allVictims.length}`);
      
      // Filter victims discovered after last processed time
      const lastProcessed = new Date(lastProcessedTime);
      console.log("⏰ Filtering victims discovered after:", lastProcessed.toISOString());
      
      const newVictims = allVictims.filter(victim => {
        const victimDate = new Date(victim.discovered || victim.published || victim.attackdate || '');
        return victimDate > lastProcessed;
      });

      console.log(`🆕 New victims found: ${newVictims.length}`);
      
      if (newVictims.length === 0) {
        console.log("✅ No new victims to notify about");
        return;
      }

      console.log("📬 Processing notifications for each subscriber...");

      // Send notifications to each subscriber
      for (const subscription of activeSubscriptions) {
        console.log(`📤 Processing subscription for: ${subscription.email}`);
        
        let relevantVictims = newVictims;
        
        // Filter by countries if specified
        if (subscription.countries && subscription.countries.length > 0) {
          const beforeFilter = relevantVictims.length;
          relevantVictims = newVictims.filter(victim => 
            subscription.countries!.includes(victim.country || "Unknown")
          );
          console.log(`🌍 Country filter applied for ${subscription.email}: ${beforeFilter} → ${relevantVictims.length} victims`);
        }

        if (relevantVictims.length > 0) {
          console.log(`📨 Sending notification to ${subscription.email} for ${relevantVictims.length} victims`);
          
          try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                subscription_id: subscription.id,
                email: subscription.email,
                victims: relevantVictims,
                countries: subscription.countries
              }),
            });

            const responseData = await response.text();
            console.log(`📧 Email response for ${subscription.email}:`, {
              status: response.status,
              ok: response.ok,
              data: responseData
            });

            if (response.ok) {
              console.log(`✅ Notification sent successfully to ${subscription.email}`);
            } else {
              console.error(`❌ Failed to send notification to ${subscription.email}:`, responseData);
            }
          } catch (error) {
            console.error(`💥 Error sending notification to ${subscription.email}:`, error);
          }
        } else {
          console.log(`⏭️ No relevant victims for ${subscription.email} (country filter applied)`);
        }
      }

      // Update last processed time
      const newLastProcessedTime = new Date().toISOString();
      console.log("⏰ Updating last processed time to:", newLastProcessedTime);
      setLastProcessedTime(newLastProcessedTime);
      localStorage.setItem('lastProcessedTime', newLastProcessedTime);

      console.log("🎉 Notification check process completed successfully");

    } catch (error) {
      console.error("💥 Error in checkAndNotifyNewVictims:", error);
    }
  };

  // Set up data refresh every 4 hours
  useEffect(() => {
    console.log("🚀 Setting up notification system...");
    
    // Check immediately on mount
    checkAndNotifyNewVictims();
    
    // Set up interval for every 4 hours
    const intervalId = setInterval(() => {
      console.log("⏰ Scheduled notification check triggered (4-hour interval)");
      checkAndNotifyNewVictims();
    }, 4 * 60 * 60 * 1000);
    
    return () => {
      console.log("🛑 Cleaning up notification interval");
      clearInterval(intervalId);
    };
  }, [lastProcessedTime]);

  const addSubscription = async (email: string, countries: string[] | null) => {
    try {
      setLoading(true);
      console.log("📝 Starting subscription process for:", email);

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
          console.log("♻️ Reactivating existing subscription for:", email);
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
      console.log("🆕 Creating new subscription for:", email);
      const { data: newSubscription, error } = await supabase
        .from('subscriptions')
        .insert({
          email,
          countries: countries || null,
        })
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Subscription created successfully:", newSubscription.id);

      // Send welcome email
      console.log("📧 Sending welcome email to:", email);
      const welcomeResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          countries: countries || undefined,
          unsubscribe_token: newSubscription.unsubscribe_token
        }),
      });

      if (!welcomeResponse.ok) {
        console.error('❌ Failed to send welcome email');
      } else {
        console.log("✅ Welcome email sent successfully");
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

      // Trigger immediate notification check for new subscriber
      console.log("🔔 Triggering immediate notification check for new subscriber");
      setTimeout(() => {
        checkAndNotifyNewVictims();
      }, 2000); // Small delay to ensure subscription is fully processed

    } catch (error) {
      console.error("💥 Failed to add subscription:", error);
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
      const response = await fetch(`${SUPABASE_URL}/functions/v1/unsubscribe?token=${token}`);
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
