
import { useEffect, useState } from 'react';
import { fetchAllVictims } from '@/services/ransomwareAPI';
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_CONFIG } from '@/config/supabase';

const isDevelopment = import.meta.env.MODE === 'development';

export const useNotificationSystem = () => {
  const [lastProcessedTime, setLastProcessedTime] = useState<string>(
    localStorage.getItem('lastProcessedTime') || new Date().toISOString()
  );

  // Check for new victims and send notifications
  const checkAndNotifyNewVictims = async () => {
    try {
      if (isDevelopment) {
        console.log("🔔 Starting notification check process...");
        console.log("📅 Last processed time:", lastProcessedTime);
      }
      
      // Get all active subscriptions
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('is_active', true);

      if (subsError) {
        if (isDevelopment) console.error("❌ Error fetching subscriptions:", subsError);
        return;
      }

      if (!activeSubscriptions || activeSubscriptions.length === 0) {
        if (isDevelopment) console.log("📭 No active subscriptions found");
        return;
      }

      if (isDevelopment) console.log(`📧 Found ${activeSubscriptions.length} active subscriptions`);

      // Fetch latest victims
      if (isDevelopment) console.log("🔍 Fetching latest victim data...");
      const allVictims = await fetchAllVictims();
      if (isDevelopment) console.log(`📊 Total victims fetched: ${allVictims.length}`);
      
      // Filter victims discovered after last processed time
      const lastProcessed = new Date(lastProcessedTime);
      if (isDevelopment) console.log("⏰ Filtering victims discovered after:", lastProcessed.toISOString());
      
      const newVictims = allVictims.filter(victim => {
        const victimDate = new Date(victim.discovered || victim.published || victim.attackdate || '');
        return victimDate > lastProcessed;
      });

      if (isDevelopment) console.log(`🆕 New victims found: ${newVictims.length}`);
      
      if (newVictims.length === 0) {
        if (isDevelopment) console.log("✅ No new victims to notify about");
        return;
      }

      if (isDevelopment) console.log("📬 Processing notifications for each subscriber...");

      // Send notifications to each subscriber
      for (const subscription of activeSubscriptions) {
        if (isDevelopment) console.log(`📤 Processing subscription for: ${subscription.email}`);
        
        let relevantVictims = newVictims;
        
        // Filter by countries if specified
        if (subscription.countries && subscription.countries.length > 0) {
          const beforeFilter = relevantVictims.length;
          relevantVictims = newVictims.filter(victim => 
            subscription.countries!.includes(victim.country || "Unknown")
          );
          if (isDevelopment) {
            console.log(`🌍 Country filter applied for ${subscription.email}: ${beforeFilter} → ${relevantVictims.length} victims`);
          }
        }

        if (relevantVictims.length > 0) {
          if (isDevelopment) console.log(`📨 Sending notification to ${subscription.email} for ${relevantVictims.length} victims`);
          
          try {
            const response = await fetch(`${SUPABASE_CONFIG.URL}/functions/v1/send-notification-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
              },
              body: JSON.stringify({
                subscription_id: subscription.id,
                email: subscription.email,
                victims: relevantVictims,
                countries: subscription.countries
              }),
            });

            const responseData = await response.text();
            if (isDevelopment) {
              console.log(`📧 Email response for ${subscription.email}:`, {
                status: response.status,
                ok: response.ok,
                data: responseData
              });
            }

            if (response.ok) {
              if (isDevelopment) console.log(`✅ Notification sent successfully to ${subscription.email}`);
            } else {
              if (isDevelopment) console.error(`❌ Failed to send notification to ${subscription.email}:`, responseData);
            }
          } catch (error) {
            if (isDevelopment) console.error(`💥 Error sending notification to ${subscription.email}:`, error);
          }
        } else {
          if (isDevelopment) console.log(`⏭️ No relevant victims for ${subscription.email} (country filter applied)`);
        }
      }

      // Update last processed time
      const newLastProcessedTime = new Date().toISOString();
      if (isDevelopment) console.log("⏰ Updating last processed time to:", newLastProcessedTime);
      setLastProcessedTime(newLastProcessedTime);
      localStorage.setItem('lastProcessedTime', newLastProcessedTime);

      if (isDevelopment) console.log("🎉 Notification check process completed successfully");

    } catch (error) {
      if (isDevelopment) console.error("💥 Error in checkAndNotifyNewVictims:", error);
    }
  };

  // Set up data refresh every 4 hours
  useEffect(() => {
    if (isDevelopment) console.log("🚀 Setting up notification system...");
    
    // Check immediately on mount
    checkAndNotifyNewVictims();
    
    // Set up interval for every 4 hours
    const intervalId = setInterval(() => {
      if (isDevelopment) console.log("⏰ Scheduled notification check triggered (4-hour interval)");
      checkAndNotifyNewVictims();
    }, 4 * 60 * 60 * 1000);
    
    return () => {
      if (isDevelopment) console.log("🛑 Cleaning up notification interval");
      clearInterval(intervalId);
    };
  }, [lastProcessedTime]);

  return { checkAndNotifyNewVictims };
};
