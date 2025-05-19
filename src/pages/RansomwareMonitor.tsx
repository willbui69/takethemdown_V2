
import { useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { RansomwareVictim } from "@/types/ransomware";
import { checkApiAvailability, fetchAllVictims, fetchRecentVictims, fetchVietnameseVictims } from "@/services/ransomwareAPI";
import { toast } from "sonner";
import { filterRecent24Hours } from "@/components/ransomware/utils/dataUtils";
import { RansomwareHeader } from "@/components/ransomware/RansomwareHeader";
import { InfoPanel } from "@/components/ransomware/InfoPanel";
import { VictimTabs } from "@/components/ransomware/VictimTabs";
import { DataAboutSection } from "@/components/ransomware/DataAboutSection";
import { GroupStatistics } from "@/components/ransomware/GroupStatistics";
import { SubscriptionForm } from "@/components/ransomware/SubscriptionForm";

const RansomwareMonitor = () => {
  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [recentVictims, setRecentVictims] = useState<RansomwareVictim[]>([]);
  const [vietnameseVictims, setVietnameseVictims] = useState<RansomwareVictim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGeoBlocked(false);
      
      console.info("Fetching ransomware data for scheduled 4-hour update...");
      
      // First check API availability through our Edge Function
      const isAvailable = await checkApiAvailability();
      
      if (!isAvailable) {
        setError("API hiện không khả dụng. Đang sử dụng dữ liệu mẫu.");
        toast.warning("API không khả dụng", {
          description: "Đang sử dụng dữ liệu mẫu thay thế."
        });
        setLoading(false);
      }
      
      // Using Promise.allSettled to continue even if one promise fails
      const [allVictimsResult, todayVictimsResult, vietnamVictimsResult] = await Promise.allSettled([
        fetchAllVictims(),
        fetchRecentVictims(),
        fetchVietnameseVictims()
      ]);
      
      if (allVictimsResult.status === 'fulfilled') {
        setVictims(allVictimsResult.value);
        console.info(`Fetched ${allVictimsResult.value.length} victims in scheduled update`);
      } else {
        console.error("Error fetching all victims:", allVictimsResult.reason);
        setError("Không thể tải dữ liệu nạn nhân.");
      }
      
      if (todayVictimsResult.status === 'fulfilled') {
        // Apply the 24-hour filter to recent victims
        const recent24HourVictims = filterRecent24Hours(todayVictimsResult.value);
        console.info(`Filtered ${recent24HourVictims.length} victims within the last 24 hours`);
        setRecentVictims(recent24HourVictims);
      } else {
        console.error("Error fetching recent victims:", todayVictimsResult.reason);
        if (!error) {
          setError("Không thể tải dữ liệu nạn nhân gần đây.");
        }
      }
      
      if (vietnamVictimsResult.status === 'fulfilled') {
        setVietnameseVictims(vietnamVictimsResult.value);
        console.info(`Fetched ${vietnamVictimsResult.value.length} Vietnamese victims`);
      } else {
        console.error("Error fetching Vietnamese victims:", vietnamVictimsResult.reason);
        if (!error) {
          setError("Không thể tải dữ liệu nạn nhân Việt Nam.");
        }
      }
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Không thể tải dữ liệu ransomware. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data when component mounts
    loadData();
    
    // Set up 4-hour refresh interval
    const intervalId = setInterval(() => {
      console.log("Đang thực hiện cập nhật dữ liệu theo lịch 4 giờ");
      loadData();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <RootLayout>
      <SubscriptionProvider>
        <div className="container mx-auto px-4 py-8">
          <RansomwareHeader 
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={loadData}
          />

          <InfoPanel isGeoBlocked={isGeoBlocked} error={null} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <GroupStatistics />
            </div>
            <div>
              <SubscriptionForm />
            </div>
          </div>

          <VictimTabs
            victims={victims}
            recentVictims={recentVictims}
            vietnameseVictims={vietnameseVictims}
            loading={loading}
            error={error}
          />

          <DataAboutSection />
        </div>
      </SubscriptionProvider>
    </RootLayout>
  );
};

export default RansomwareMonitor;
