
import { toast } from '@/components/ui/sonner';
import { Subscription } from '@/types/ransomware';
import { supabase } from '@/integrations/supabase/client';
import { checkRateLimit, logSubscriptionAttempt } from '@/services/subscriptionService';

export const useSubscriptionOperations = (
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

      // Send welcome email using Supabase functions
      console.log("📧 Sending welcome email to:", email);
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          countries: countries || undefined,
          unsubscribe_token: newSubscription.unsubscribe_token
        }
      });

      if (emailError) {
        console.error('❌ Failed to send welcome email:', emailError);
        toast.error("Đăng ký thành công nhưng không thể gửi email xác nhận", {
          description: "Bạn đã được đăng ký thành công nhưng có lỗi khi gửi email."
        });
      } else {
        console.log("✅ Welcome email sent successfully:", emailResponse);
        toast.success("Đăng ký thành công!", {
          description: "Bạn sẽ nhận được email xác nhận và thông báo khi có nạn nhân mới."
        });
      }

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
      const { data, error } = await supabase.functions.invoke('unsubscribe', {
        body: { token }
      });
      return !error;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      return false;
    }
  };

  const getVerificationLink = (email: string): string | undefined => {
    return undefined; // No verification needed
  };

  return {
    addSubscription,
    verifySubscription,
    unsubscribe,
    getVerificationLink
  };
};
