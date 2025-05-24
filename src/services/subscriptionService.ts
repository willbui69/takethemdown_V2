
import { supabase } from '@/integrations/supabase/client';

// Check for rate limiting (max 3 attempts per email per 24 hours)
export const checkRateLimit = async (email: string): Promise<boolean> => {
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
export const logSubscriptionAttempt = async (email: string) => {
  await supabase
    .from('subscription_attempts')
    .insert({ email });
};
