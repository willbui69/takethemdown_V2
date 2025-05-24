
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.redirect("https://takethemdown.com.vn/unsubscribe?status=invalid", 302);
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processing unsubscribe request for token: ${token.substring(0, 8)}...`);

    // Find subscription by unsubscribe token
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('email, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (error || !subscription) {
      console.error('Error finding subscription:', error);
      return Response.redirect("https://takethemdown.com.vn/unsubscribe?status=not-found", 302);
    }

    // Check if already unsubscribed
    if (!subscription.is_active) {
      console.log(`Subscription for ${subscription.email} is already inactive`);
      return Response.redirect(`https://takethemdown.com.vn/unsubscribe?status=already-unsubscribed&email=${encodeURIComponent(subscription.email)}`, 302);
    }

    // Deactivate subscription
    console.log(`Deactivating subscription for ${subscription.email}`);
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        is_active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('unsubscribe_token', token);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }

    console.log(`Successfully unsubscribed ${subscription.email}`);
    return Response.redirect(`https://takethemdown.com.vn/unsubscribe?status=success&email=${encodeURIComponent(subscription.email)}`, 302);

  } catch (error) {
    console.error("Lỗi trong hàm unsubscribe:", error);
    return Response.redirect("https://takethemdown.com.vn/unsubscribe?status=error", 302);
  }
});
