
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
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yêu Cầu Không Hợp Lệ</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Yêu Cầu Không Hợp Lệ</h1>
            <p style="color: #6b7280; font-size: 16px;">Không có mã hủy đăng ký được cung cấp trong liên kết này.</p>
            <p style="margin-top: 30px;">
              <a href="https://takethemdown.com.vn" style="color: #3b82f6; text-decoration: none; font-weight: 500;">← Quay lại TakeThemDown</a>
            </p>
          </div>
        </body>
      </html>
    `, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });
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

    if (error) {
      console.error('Error finding subscription:', error);
      return new Response(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã Không Hợp Lệ</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #dc2626; margin-bottom: 20px;">❌ Mã Không Hợp Lệ</h1>
              <p style="color: #6b7280; font-size: 16px;">Mã hủy đăng ký không hợp lệ hoặc đã hết hạn.</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Nếu bạn vẫn muốn hủy đăng ký, vui lòng liên hệ với chúng tôi.</p>
              <p style="margin-top: 30px;">
                <a href="https://takethemdown.com.vn" style="color: #3b82f6; text-decoration: none; font-weight: 500;">← Quay lại TakeThemDown</a>
              </p>
            </div>
          </body>
        </html>
      `, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });
    }

    if (!subscription) {
      return new Response(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Không Tìm Thấy</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #dc2626; margin-bottom: 20px;">❌ Không Tìm Thấy</h1>
              <p style="color: #6b7280; font-size: 16px;">Không tìm thấy đăng ký với mã này.</p>
              <p style="margin-top: 30px;">
                <a href="https://takethemdown.com.vn" style="color: #3b82f6; text-decoration: none; font-weight: 500;">← Quay lại TakeThemDown</a>
              </p>
            </div>
          </body>
        </html>
      `, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });
    }

    // Check if already unsubscribed
    if (!subscription.is_active) {
      console.log(`Subscription for ${subscription.email} is already inactive`);
      return new Response(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đã Hủy Đăng Ký</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #059669; margin-bottom: 20px;">✅ Đã Hủy Đăng Ký</h1>
              <p style="color: #6b7280; font-size: 16px; margin-bottom: 15px;">Bạn đã hủy đăng ký nhận thông báo ransomware trước đó.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #374151; font-size: 14px; margin: 0;"><strong>Email:</strong> ${subscription.email}</p>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Bạn sẽ không nhận được thông báo về ransomware nữa.</p>
              <p style="margin-top: 30px;">
                <a href="https://takethemdown.com.vn/ransomware" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Xem Trang Giám Sát</a>
              </p>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
      });
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

    return new Response(`
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hủy Đăng Ký Thành Công</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #059669; margin-bottom: 20px;">✅ Hủy Đăng Ký Thành Công</h1>
            <p style="color: #6b7280; font-size: 16px; margin-bottom: 15px;">Bạn đã hủy đăng ký thành công khỏi dịch vụ thông báo ransomware.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #374151; font-size: 14px; margin: 0;"><strong>Email:</strong> ${subscription.email}</p>
            </div>
            
            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; text-align: left;">
              <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">✓ Bạn sẽ không còn nhận được cảnh báo về các nạn nhân ransomware mới</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">
              Nếu bạn muốn đăng ký lại trong tương lai, bạn có thể làm điều đó bất cứ lúc nào trên trang giám sát ransomware của chúng tôi.
            </p>
            
            <div style="margin-top: 30px;">
              <a href="https://takethemdown.com.vn/ransomware" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">
                Xem Trang Giám Sát
              </a>
              <a href="https://takethemdown.com.vn" 
                 style="color: #6b7280; text-decoration: none; font-size: 14px;">
                ← Quay lại TakeThemDown
              </a>
            </div>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });

  } catch (error) {
    console.error("Lỗi trong hàm unsubscribe:", error);
    return new Response(`
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lỗi Hệ Thống</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Lỗi Hệ Thống</h1>
            <p style="color: #6b7280; font-size: 16px;">Đã xảy ra lỗi khi xử lý yêu cầu hủy đăng ký của bạn.</p>
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">Vui lòng thử lại sau hoặc liên hệ hỗ trợ qua email: lienhe@takethemdown.com.vn</p>
            <p style="margin-top: 30px;">
              <a href="https://takethemdown.com.vn" style="color: #3b82f6; text-decoration: none; font-weight: 500;">← Quay lại TakeThemDown</a>
            </p>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });
  }
});
