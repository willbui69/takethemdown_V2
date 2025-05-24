
import { useEffect, useState } from "react";
import { checkApiAvailability, fetchAllVictims, fetchRecentVictims } from "@/services/ransomwareAPI";
import { RansomwareVictim } from "@/types/ransomware";
import { toast } from "sonner";

const isDevelopment = import.meta.env.MODE === 'development';

export const useRansomwareData = () => {
  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [recentVictims, setRecentVictims] = useState<RansomwareVictim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGeoBlocked(false);
      
      if (isDevelopment) console.info("Fetching ransomware data...");
      
      // First check API availability through our Edge Function
      const isAvailable = await checkApiAvailability();
      
      if (!isAvailable) {
        setError("API hiện không khả dụng. Vui lòng thử lại sau.");
        toast.warning("API không khả dụng", {
          description: "Không thể tải dữ liệu hiện tại, vui lòng thử lại sau."
        });
        setLoading(false);
        return;
      }
      
      // Using Promise.allSettled to continue even if one promise fails
      const [allVictimsResult, todayVictimsResult] = await Promise.allSettled([
        fetchAllVictims(),
        fetchRecentVictims()
      ]);
      
      if (allVictimsResult.status === 'fulfilled') {
        const processedData = allVictimsResult.value;
        if (isDevelopment) console.log("Received victim data:", processedData.slice(0, 2));
        setVictims(processedData);
        if (isDevelopment) console.info(`Fetched ${processedData.length} victims`);
      } else {
        if (isDevelopment) console.error("Error fetching all victims:", allVictimsResult.reason);
        setError("Không thể tải dữ liệu nạn nhân.");
      }
      
      if (todayVictimsResult.status === 'fulfilled') {
        const processedData = todayVictimsResult.value;
        if (isDevelopment) console.log("Received recent victim data:", processedData.slice(0, 2));
        setRecentVictims(processedData);
        if (isDevelopment) console.info(`Fetched ${processedData.length} recent victims (24h)`);
      } else {
        if (isDevelopment) console.error("Error fetching recent victims:", todayVictimsResult.reason);
        if (!error) {
          setError("Không thể tải dữ liệu nạn nhân gần đây.");
        }
      }
      
      setLastUpdated(new Date());
      
    } catch (err) {
      if (isDevelopment) console.error("Error fetching data:", err);
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
      if (isDevelopment) console.log("Đang thực hiện cập nhật dữ liệu theo lịch 4 giờ");
      loadData();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    victims,
    recentVictims,
    loading,
    error,
    isGeoBlocked,
    lastUpdated,
    loadData
  };
};
