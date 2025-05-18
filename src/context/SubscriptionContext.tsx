
import { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Subscription } from '@/types/ransomware';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (email: string) => Promise<void>;
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

  // In a real implementation, these would interact with a backend
  const addSubscription = async (email: string) => {
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
