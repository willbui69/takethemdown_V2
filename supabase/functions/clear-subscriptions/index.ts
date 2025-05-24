
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Phương thức không được phép" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🧹 Clearing all subscriptions and subscription attempts...");

    // Clear all subscriptions
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (subscriptionsError) {
      console.error('Error clearing subscriptions:', subscriptionsError);
      throw subscriptionsError;
    }

    // Clear all subscription attempts  
    const { error: attemptsError } = await supabase
      .from('subscription_attempts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (attemptsError) {
      console.error('Error clearing subscription attempts:', attemptsError);
      throw attemptsError;
    }

    console.log("✅ Successfully cleared all subscriptions and attempts");

    return new Response(JSON.stringify({ 
      success: true,
      message: "Đã xóa tất cả đăng ký thành công"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error clearing data:", error);
    return new Response(JSON.stringify({ 
      error: "Không thể xóa dữ liệu", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
