
import { useEffect, useState } from 'react';
import { fetchAllVictims } from '@/services/ransomwareAPI';
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_CONFIG } from '@/config/supabase';

export const useNotificationSystem = () => {
  const [lastProcessedTime, setLastProcessedTime] = useState<string>(
    localStorage.getItem('lastProcessedTime') || new Date().toISOString()
  );

  // Check for new victims and send notifications
  const checkAndNotifyNewVictims = async () => {
    try {
      console.log("🔔 Starting notification check process...");
      console.log("📅 Last processed time:", lastProcessedTime);
      
      // Get all active subscriptions
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('is_active', true);

      if (subsError) {
        console.error("❌ Error fetching subscriptions:", subsError);
        return;
      }

      if (!activeSubscriptions || activeSubscriptions.length === 0) {
        console.log("📭 No active subscriptions found");
        return;
      }

      console.log(`📧 Found ${activeSubscriptions.length} active subscriptions`);

      // Fetch latest victims
      console.log("🔍 Fetching latest victim data...");
      const allVictims = await fetchAllVictims();
      console.log(`📊 Total victims fetched: ${allVictims.length}`);
      
      // Filter victims discovered after last processed time
      const lastProcessed = new Date(lastProcessedTime);
      console.log("⏰ Filtering victims discovered after:", lastProcessed.toISOString());
      
      const newVictims = allVictims.filter(victim => {
        const victimDate = new Date(victim.discovered || victim.published || victim.attackdate || '');
        return victimDate > lastProcessed;
      });

      console.log(`🆕 New victims found: ${newVictims.length}`);
      
      if (newVictims.length === 0) {
        console.log("✅ No new victims to notify about");
        return;
      }

      console.log("📬 Processing notifications for each subscriber...");

      // Send notifications to each subscriber
      for (const subscription of activeSubscriptions) {
        console.log(`📤 Processing subscription for: ${subscription.email}`);
        
        let relevantVictims = newVictims;
        
        // Filter by countries if specified
        if (subscription.countries && subscription.countries.length > 0) {
          const beforeFilter = relevantVictims.length;
          relevantVictims = newVictims.filter(victim => 
            subscription.countries!.includes(victim.country || "Unknown")
          );
          console.log(`🌍 Country filter applied for ${subscription.email}: ${beforeFilter} → ${relevantVictims.length} victims`);
        }

        if (relevantVictims.length > 0) {
          console.log(`📨 Sending notification to ${subscription.email} for ${relevantVictims.length} victims`);
          
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
            console.log(`📧 Email response for ${subscription.email}:`, {
              status: response.status,
              ok: response.ok,
              data: responseData
            });

            if (response.ok) {
              console.log(`✅ Notification sent successfully to ${subscription.email}`);
            } else {
              console.error(`❌ Failed to send notification to ${subscription.email}:`, responseData);
            }
          } catch (error) {
            console.error(`💥 Error sending notification to ${subscription.email}:`, error);
          }
        } else {
          console.log(`⏭️ No relevant victims for ${subscription.email} (country filter applied)`);
        }
      }

      // Update last processed time
      const newLastProcessedTime = new Date().toISOString();
      console.log("⏰ Updating last processed time to:", newLastProcessedTime);
      setLastProcessedTime(newLastProcessedTime);
      localStorage.setItem('lastProcessedTime', newLastProcessedTime);

      console.log("🎉 Notification check process completed successfully");

    } catch (error) {
      console.error("💥 Error in checkAndNotifyNewVictims:", error);
    }
  };

  // Set up data refresh every 4 hours
  useEffect(() => {
    console.log("🚀 Setting up notification system...");
    
    // Check immediately on mount
    checkAndNotifyNewVictims();
    
    // Set up interval for every 4 hours
    const intervalId = setInterval(() => {
      console.log("⏰ Scheduled notification check triggered (4-hour interval)");
      checkAndNotifyNewVictims();
    }, 4 * 60 * 60 * 1000);
    
    return () => {
      console.log("🛑 Cleaning up notification interval");
      clearInterval(intervalId);
    };
  }, [lastProcessedTime]);

  return { checkAndNotifyNewVictims };
};
