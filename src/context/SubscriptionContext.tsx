
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Subscription } from '@/types/ransomware';
import { useSubscriptionOperations } from '@/hooks/useSubscriptionOperations';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';

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

  // Use the notification system hook
  useNotificationSystem();

  // Use the subscription operations hook
  const {
    addSubscription: handleAddSubscription,
    verifySubscription,
    unsubscribe,
    getVerificationLink
  } = useSubscriptionOperations(setSubscriptions, setLoading);

  const value = {
    subscriptions,
    addSubscription: handleAddSubscription,
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
