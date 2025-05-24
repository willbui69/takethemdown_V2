
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
    ? ` for the following countries: ${countries.join(', ')}`
    : ' for all countries';

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
            <h1 style="margin: 0;">✅ Subscription Confirmed</h1>
          </div>
          
          <div class="content">
            <h2>Welcome to TakeThemDown Ransomware Alerts!</h2>
            
            <p>Thank you for subscribing to our ransomware monitoring service. You will now receive notifications${countryText} when new ransomware victims are detected.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">What to expect:</h3>
              <ul>
                <li><strong>Real-time alerts:</strong> Immediate notifications when new victims are identified</li>
                <li><strong>Comprehensive data:</strong> Victim details, ransomware groups, and attack information</li>
                <li><strong>Regular updates:</strong> Our system checks for new victims every 4 hours</li>
                <li><strong>Actionable insights:</strong> Security recommendations with each alert</li>
              </ul>
            </div>
            
            <h3>Stay Protected:</h3>
            <p>While you'll receive alerts about new victims, remember these key security practices:</p>
            <ul>
              <li>Keep your systems and software updated</li>
              <li>Maintain regular, tested backups</li>
              <li>Use endpoint detection and response tools</li>
              <li>Train your team on phishing awareness</li>
              <li>Implement network segmentation</li>
            </ul>
            
            <p><strong>Questions or feedback?</strong> Feel free to contact us at lienhe@takethemdown.com.vn</p>
            
            <div class="unsubscribe">
              <p><a href="${unsubscribeUrl}">Unsubscribe from these notifications</a></p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0; text-align: center;">
              <strong>TakeThemDown</strong> - Protecting organizations from ransomware threats
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
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, countries, unsubscribe_token }: WelcomeEmailRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailContent = generateWelcomeEmailContent(countries, unsubscribe_token);

    const emailResult = await resend.emails.send({
      from: "TakeThemDown <lienhe@takethemdown.com.vn>",
      to: [email],
      subject: "Welcome to TakeThemDown Ransomware Alerts",
      html: emailContent,
    });

    if (emailResult.error) {
      console.error("Welcome email sending failed:", emailResult.error);
      return new Response(JSON.stringify({ error: "Failed to send welcome email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Welcome email sent successfully to ${email}, email ID: ${emailResult.data?.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResult.data?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
