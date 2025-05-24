
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface NotificationRequest {
  subscription_id: string;
  email: string;
  victims: any[];
  countries?: string[];
}

const generateEmailContent = (victims: any[], countries?: string[]) => {
  const countryFilter = countries && countries.length > 0 
    ? ` cho các quốc gia: ${countries.join(', ')}`
    : '';

  const victimsList = victims.map(victim => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 8px; font-weight: bold;">${victim.victim_name || victim.victim || 'Không rõ'}</td>
      <td style="padding: 8px;">${victim.group_name || victim.group || 'Không rõ'}</td>
      <td style="padding: 8px;">${victim.country || 'Không rõ'}</td>
      <td style="padding: 8px;">${victim.industry || 'Không rõ'}</td>
      <td style="padding: 8px;">${victim.published || victim.discovered || 'Không rõ'}</td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          th { background-color: #374151; color: white; padding: 12px; text-align: left; }
          td { padding: 8px; }
          .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
          .unsubscribe { text-align: center; margin-top: 20px; }
          .unsubscribe a { color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🚨 Phát Hiện Nạn Nhân Ransomware Mới</h1>
          </div>
          
          <div class="content">
            <div class="warning">
              <strong>⚠️ Cảnh Báo Bảo Mật:</strong> Đã phát hiện ${victims.length} nạn nhân ransomware mới${countryFilter}.
            </div>
            
            <p>Các tổ chức sau đây đã được xác định là nạn nhân của các cuộc tấn công ransomware:</p>
            
            <table>
              <thead>
                <tr>
                  <th>Nạn Nhân</th>
                  <th>Nhóm Ransomware</th>
                  <th>Quốc Gia</th>
                  <th>Ngành</th>
                  <th>Ngày Công Bố</th>
                </tr>
              </thead>
              <tbody>
                ${victimsList}
              </tbody>
            </table>
            
            <p><strong>Các Hành Động Được Khuyến Nghị:</strong></p>
            <ul>
              <li>Xem xét tình trạng bảo mật của tổ chức bạn</li>
              <li>Đảm bảo các bản sao lưu được cập nhật và đã kiểm tra</li>
              <li>Xác minh bảo vệ endpoint đang hoạt động</li>
              <li>Kiểm tra bất kỳ dấu hiệu xâm phạm nào</li>
              <li>Cập nhật các biện pháp bảo mật phòng ngừa</li>
            </ul>
            
            <p><em>Thông báo này được tạo tự động bởi hệ thống giám sát ransomware TakeThemDown.</em></p>
          </div>
          
          <div class="footer">
            <p style="margin: 0; text-align: center;">
              <strong>TakeThemDown</strong> - Giám Sát Ransomware & Ứng Phó Sự Cố
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
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
    const { subscription_id, email, victims, countries }: NotificationRequest = await req.json();

    if (!email || !victims || victims.length === 0) {
      return new Response(JSON.stringify({ error: "Thiếu các trường bắt buộc" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailContent = generateEmailContent(victims, countries);

    const emailResult = await resend.emails.send({
      from: "TakeThemDown <lienhe@takethemdown.com.vn>",
      to: [email],
      subject: "Phát Hiện Nạn Nhân Ransomware Mới",
      html: emailContent,
    });

    if (emailResult.error) {
      console.error("Gửi email thất bại:", emailResult.error);
      return new Response(JSON.stringify({ error: "Không thể gửi email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store notification history
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('notification_history')
      .insert({
        subscription_id,
        victim_data: victims
      });

    console.log(`Thông báo đã được gửi thành công đến ${email}, ID email: ${emailResult.data?.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResult.data?.id,
      victims_count: victims.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Lỗi trong hàm send-notification-email:", error);
    return new Response(JSON.stringify({ error: "Lỗi máy chủ nội bộ" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
