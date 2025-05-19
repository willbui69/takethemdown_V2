
import { useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { VictimsTable } from "@/components/ransomware/VictimsTable";
import { GroupStatistics } from "@/components/ransomware/GroupStatistics";
import { SubscriptionForm } from "@/components/ransomware/SubscriptionForm";
import { AdminPanel } from "@/components/ransomware/AdminPanel";
import { checkApiAvailability, fetchAllVictims, fetchRecentVictims } from "@/services/ransomwareAPI";
import { RansomwareVictim } from "@/types/ransomware";
import { CirclePlus, CircleMinus, Database, Bug, ShieldAlert, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RansomwareMonitor = () => {
  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [recentVictims, setRecentVictims] = useState<RansomwareVictim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const processVictimData = (data: any[]): RansomwareVictim[] => {
    if (!Array.isArray(data)) {
      console.error("Invalid victim data format:", data);
      return [];
    }
    
    return data.map(item => ({
      victim_name: item.victim_name || item.name || "Unknown",
      group_name: item.group_name || item.group || "Unknown Group",
      published: item.published || item.date || null,
      country: item.country || null,
      industry: item.industry || item.sector || null,
      url: item.url || item.victim_url || null,
      ...item // Keep all original properties
    }));
  };

  // Filter victims to only include those within the last 24 hours
  const filterRecent24Hours = (victims: RansomwareVictim[]): RansomwareVictim[] => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return victims.filter(victim => {
      if (!victim.published) return false;
      
      try {
        const publishDate = new Date(victim.published);
        return publishDate >= twentyFourHoursAgo && publishDate <= now;
      } catch (err) {
        console.error("Invalid date format for victim:", victim.victim_name, victim.published);
        return false;
      }
    });
  };

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
      const [allVictimsResult, todayVictimsResult] = await Promise.allSettled([
        fetchAllVictims(),
        fetchRecentVictims()
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-security">Giám Sát Ransomware</h1>
              <p className="text-gray-600">
                Theo dõi dữ liệu nạn nhân ransomware và nhận thông báo về nạn nhân mới
                {lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    Cập nhật lần cuối: {lastUpdated.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={loadData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Làm Mới Dữ Liệu
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
              >
                {showAdminPanel ? (
                  <>
                    <CircleMinus className="h-4 w-4" /> Ẩn Bảng Quản Trị
                  </>
                ) : (
                  <>
                    <CirclePlus className="h-4 w-4" /> Hiển Thị Bảng Quản Trị
                  </>
                )}
              </Button>
            </div>
          </div>

          {isGeoBlocked && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Giới Hạn Địa Lý</AlertTitle>
              <AlertDescription>
                Vị trí của bạn bị chặn truy cập vào API ransomware.live. Điều này có thể do các giới hạn cụ thể theo quốc gia được áp dụng bởi nhà cung cấp API.
              </AlertDescription>
            </Alert>
          )}

          {showAdminPanel && (
            <div className="mb-8">
              <AdminPanel />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <GroupStatistics />
            </div>
            <div>
              <SubscriptionForm />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Tất Cả Nạn Nhân</TabsTrigger>
                <TabsTrigger value="recent">Gần Đây (24h)</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-4">
                {error ? (
                  <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
                    <Bug className="h-10 w-10" />
                    {error}
                  </div>
                ) : (
                  <VictimsTable 
                    victims={victims} 
                    loading={loading} 
                  />
                )}
              </TabsContent>
              <TabsContent value="recent" className="pt-4">
                {error ? (
                  <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
                    <Bug className="h-10 w-10" />
                    {error}
                  </div>
                ) : (
                  <VictimsTable 
                    victims={recentVictims} 
                    loading={loading} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Về Dữ Liệu Này</h3>
            <p className="text-gray-700 mb-4">
              Dữ liệu này được lấy từ ransomware.live, trang theo dõi các nhóm ransomware và nạn nhân của họ.
              Thông tin được cập nhật tự động mỗi 4 giờ để cung cấp tổng quan mới nhất về hoạt động ransomware.
            </p>
            <p className="text-gray-700">
              Đăng ký để nhận thông báo qua email khi có nạn nhân mới được thêm vào cơ sở dữ liệu. 
              Bạn có thể chọn nhận thông báo về nạn nhân từ tất cả các quốc gia hoặc chỉ chọn các quốc gia quan tâm.
            </p>
          </div>
        </div>
      </SubscriptionProvider>
    </RootLayout>
  );
};

export default RansomwareMonitor;
