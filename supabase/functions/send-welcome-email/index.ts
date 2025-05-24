
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface WelcomeEmailRequest {
  email: string;
  countries?: string[];
  unsubscribe_token: string;
}

const generateWelcomeEmailContent = (countries?: string[], unsubscribe_token?: string) => {
  const countryText = countries && countries.length > 0 
    ? ` cho các quốc gia: ${countries.join(', ')}`
    : ' cho tất cả các quốc gia';

  const unsubscribeUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/unsubscribe?token=${unsubscribe_token}`;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
          .unsubscribe { text-align: center; margin-top: 20px; }
          .unsubscribe a { color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Xác Nhận Đăng Ký</h1>
          </div>
          
          <div class="content">
            <h2>Chào mừng bạn đến với Dịch vụ Cảnh báo Ransomware TakeThemDown!</h2>
            
            <p>Cảm ơn bạn đã đăng ký dịch vụ giám sát ransomware của chúng tôi. Bạn sẽ nhận được thông báo${countryText} khi phát hiện các nạn nhân ransomware mới.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">Những gì bạn có thể mong đợi:</h3>
              <ul>
                <li><strong>Cảnh báo thời gian thực:</strong> Thông báo ngay lập tức khi phát hiện nạn nhân mới</li>
                <li><strong>Dữ liệu toàn diện:</strong> Chi tiết nạn nhân, nhóm ransomware và thông tin tấn công</li>
                <li><strong>Cập nhật thường xuyên:</strong> Hệ thống kiểm tra nạn nhân mới mỗi 4 giờ</li>
                <li><strong>Thông tin hữu ích:</strong> Khuyến nghị bảo mật kèm theo mỗi cảnh báo</li>
              </ul>
            </div>
            
            <h3>Giữ An Toàn:</h3>
            <p>Trong khi bạn nhận được cảnh báo về các nạn nhân mới, hãy nhớ các biện pháp bảo mật chính sau:</p>
            <ul>
              <li>Giữ hệ thống và phần mềm luôn được cập nhật</li>
              <li>Duy trì việc sao lưu thường xuyên và đã được kiểm tra</li>
              <li>Sử dụng các công cụ phát hiện và phản ứng endpoint</li>
              <li>Đào tạo nhóm của bạn về nhận biết phishing</li>
              <li>Triển khai phân đoạn mạng</li>
            </ul>
            
            <p><strong>Có câu hỏi hoặc góp ý?</strong> Vui lòng liên hệ với chúng tôi tại lienhe@takethemdown.com.vn</p>
            
            <div class="unsubscribe">
              <p><a href="${unsubscribeUrl}">Hủy đăng ký nhận thông báo</a></p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0; text-align: center;">
              <strong>TakeThemDown</strong> - Bảo vệ tổ chức khỏi các mối đe dọa ransomware
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
    const { email, countries, unsubscribe_token }: WelcomeEmailRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email là bắt buộc" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailContent = generateWelcomeEmailContent(countries, unsubscribe_token);

    // Now use your verified domain
    const emailResult = await resend.emails.send({
      from: "TakeThemDown Alert <noreply@takethemdown.com.vn>",
      to: [email],
      subject: "Chào mừng đến với Dịch vụ Cảnh báo Ransomware",
      html: emailContent,
    });

    if (emailResult.error) {
      console.error("Gửi email chào mừng thất bại:", emailResult.error);
      return new Response(JSON.stringify({ error: "Không thể gửi email chào mừng", details: emailResult.error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Email chào mừng đã được gửi thành công đến ${email}, ID email: ${emailResult.data?.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResult.data?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Lỗi trong hàm send-welcome-email:", error);
    return new Response(JSON.stringify({ error: "Lỗi máy chủ nội bộ", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
