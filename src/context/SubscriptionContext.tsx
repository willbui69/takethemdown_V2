
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Subscription } from '@/types/ransomware';
import { fetchAllVictims } from '@/services/ransomwareAPI';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (email: string, countries: string[] | null) => Promise<void>;
  verifySubscription: (token: string) => Promise<boolean>;
  unsubscribe: (token: string) => Promise<boolean>;
  loading: boolean;
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

  // Set up data refresh every 4 hours
  useEffect(() => {
    // Immediately fetch data when component mounts
    fetchRansomwareData();
    
    // Set up interval for every 4 hours (4 * 60 * 60 * 1000 = 14400000 ms)
    const intervalId = setInterval(fetchRansomwareData, 14400000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchRansomwareData = async () => {
    try {
      console.log("Fetching ransomware data for scheduled 4-hour update...");
      const victims = await fetchAllVictims();
      console.log(`Fetched ${victims.length} victims in scheduled update`);
      
      // Here you would process the data and send notifications to subscribers
      // based on their country preferences
      notifySubscribers(victims);
    } catch (error) {
      console.error("Error in scheduled data update:", error);
    }
  };

  // In a real implementation, this would send actual emails
  const notifySubscribers = (victims: any[]) => {
    if (subscriptions.length === 0) return;
    
    console.log(`Processing notifications for ${subscriptions.length} subscribers`);
    
    subscriptions.forEach(sub => {
      if (!sub.verified) return;
      
      // Filter victims based on subscriber's country preferences
      let relevantVictims = victims;
      if (sub.countries && sub.countries.length > 0) {
        relevantVictims = victims.filter(victim => 
          sub.countries!.includes(victim.country || "Unknown")
        );
      }
      
      if (relevantVictims.length > 0) {
        console.log(`Would send notification to ${sub.email} for ${relevantVictims.length} victims`);
        // In a real app, this would make an API call to send an email
      }
    });
  };

  // In a real implementation, these would interact with a backend
  const addSubscription = async (email: string, countries: string[] | null) => {
    try {
      setLoading(true);
      // Mock API call - in real app this would be a fetch to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        email,
        verified: false,
        createdAt: new Date().toISOString(),
        verificationToken: `verify-${Math.random().toString(36).substring(2, 15)}`,
        unsubscribeToken: `unsub-${Math.random().toString(36).substring(2, 15)}`,
        countries: countries || undefined,
      };
      
      setSubscriptions(prev => [...prev, newSubscription]);
      toast.success("Verification email sent! Please check your inbox to confirm subscription.");
      
      // In a real app, we'd send a verification email here
      console.log(`Verification email sent to ${email} with token ${newSubscription.verificationToken}`);
      
    } catch (error) {
      console.error("Failed to add subscription:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifySubscription = async (token: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let verified = false;
      
      setSubscriptions(prev => 
        prev.map(sub => {
          if (sub.verificationToken === token) {
            verified = true;
            return { ...sub, verified: true, verificationToken: undefined };
          }
          return sub;
        })
      );
      
      if (verified) {
        toast.success("Subscription verified successfully!");
      } else {
        toast.error("Invalid verification token.");
      }
      
      return verified;
    } catch (error) {
      console.error("Failed to verify subscription:", error);
      toast.error("Failed to verify subscription. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (token: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let unsubscribed = false;
      
      setSubscriptions(prev => {
        const filtered = prev.filter(sub => {
          if (sub.unsubscribeToken === token) {
            unsubscribed = true;
            return false;
          }
          return true;
        });
        return filtered;
      });
      
      if (unsubscribed) {
        toast.success("You have been unsubscribed successfully.");
      } else {
        toast.error("Invalid unsubscribe token.");
      }
      
      return unsubscribed;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      toast.error("Failed to unsubscribe. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    subscriptions,
    addSubscription,
    verifySubscription,
    unsubscribe,
    loading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
