
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
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Invalid Request</h1>
          <p>No unsubscribe token provided.</p>
        </body>
      </html>
    `, {
      status: 400,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find and deactivate subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('email, is_active')
      .eq('unsubscribe_token', token)
      .single();

    if (error || !subscription) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Invalid Token</h1>
            <p>The unsubscribe token is invalid or has expired.</p>
          </body>
        </html>
      `, {
        status: 404,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    if (!subscription.is_active) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #059669;">Already Unsubscribed</h1>
            <p>You have already unsubscribed from ransomware notifications.</p>
            <p>Email: ${subscription.email}</p>
          </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    // Deactivate subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('unsubscribe_token', token);

    if (updateError) {
      throw updateError;
    }

    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #059669;">Successfully Unsubscribed</h1>
          <p>You have been successfully unsubscribed from ransomware notifications.</p>
          <p>Email: ${subscription.email}</p>
          <p>You will no longer receive alerts about new ransomware victims.</p>
          <p style="margin-top: 30px;">
            <a href="https://takethemdown.com.vn" style="color: #3b82f6;">Return to TakeThemDown</a>
          </p>
        </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in unsubscribe function:", error);
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Error</h1>
          <p>An error occurred while processing your unsubscribe request.</p>
          <p>Please try again later or contact support.</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }
});
