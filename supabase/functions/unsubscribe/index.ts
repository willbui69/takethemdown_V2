
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
          <h1 style="color: #dc2626;">Yêu Cầu Không Hợp Lệ</h1>
          <p>Không có mã hủy đăng ký được cung cấp.</p>
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
            <h1 style="color: #dc2626;">Mã Không Hợp Lệ</h1>
            <p>Mã hủy đăng ký không hợp lệ hoặc đã hết hạn.</p>
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
            <h1 style="color: #059669;">Đã Hủy Đăng Ký</h1>
            <p>Bạn đã hủy đăng ký nhận thông báo ransomware.</p>
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
          <h1 style="color: #059669;">Hủy Đăng Ký Thành Công</h1>
          <p>Bạn đã hủy đăng ký thành công khỏi dịch vụ thông báo ransomware.</p>
          <p>Email: ${subscription.email}</p>
          <p>Bạn sẽ không còn nhận được cảnh báo về các nạn nhân ransomware mới.</p>
          <p style="margin-top: 30px;">
            <a href="https://takethemdown.com.vn" style="color: #3b82f6;">Quay lại TakeThemDown</a>
          </p>
        </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });

  } catch (error) {
    console.error("Lỗi trong hàm unsubscribe:", error);
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Lỗi</h1>
          <p>Đã xảy ra lỗi khi xử lý yêu cầu hủy đăng ký của bạn.</p>
          <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }
});
