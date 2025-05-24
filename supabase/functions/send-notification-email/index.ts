
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
    ? ` for countries: ${countries.join(', ')}`
    : '';

  const victimsList = victims.map(victim => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 8px; font-weight: bold;">${victim.victim_name || victim.victim || 'Unknown'}</td>
      <td style="padding: 8px;">${victim.group_name || victim.group || 'Unknown'}</td>
      <td style="padding: 8px;">${victim.country || 'Unknown'}</td>
      <td style="padding: 8px;">${victim.industry || 'Unknown'}</td>
      <td style="padding: 8px;">${victim.published || victim.discovered || 'Unknown'}</td>
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
            <h1 style="margin: 0;">🚨 New Ransomware Victim(s) Detected</h1>
          </div>
          
          <div class="content">
            <div class="warning">
              <strong>⚠️ Security Alert:</strong> ${victims.length} new ransomware victim(s) have been detected${countryFilter}.
            </div>
            
            <p>The following organizations have been identified as victims of ransomware attacks:</p>
            
            <table>
              <thead>
                <tr>
                  <th>Victim</th>
                  <th>Ransomware Group</th>
                  <th>Country</th>
                  <th>Industry</th>
                  <th>Date Published</th>
                </tr>
              </thead>
              <tbody>
                ${victimsList}
              </tbody>
            </table>
            
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              <li>Review your organization's security posture</li>
              <li>Ensure backups are up to date and tested</li>
              <li>Verify endpoint protection is active</li>
              <li>Check for any indicators of compromise</li>
            </ul>
            
            <p><em>This notification was generated automatically by the TakeThemDown ransomware monitoring system.</em></p>
          </div>
          
          <div class="footer">
            <p style="margin: 0; text-align: center;">
              <strong>TakeThemDown</strong> - Ransomware Monitoring & Incident Response
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
    const { subscription_id, email, victims, countries }: NotificationRequest = await req.json();

    if (!email || !victims || victims.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailContent = generateEmailContent(victims, countries);

    const emailResult = await resend.emails.send({
      from: "TakeThemDown <lienhe@takethemdown.com.vn>",
      to: [email],
      subject: "New Ransomware Victim(s) Detected",
      html: emailContent,
    });

    if (emailResult.error) {
      console.error("Email sending failed:", emailResult.error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
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

    console.log(`Notification sent successfully to ${email}, email ID: ${emailResult.data?.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResult.data?.id,
      victims_count: victims.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-notification-email function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
