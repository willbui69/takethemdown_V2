
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VictimsTable } from "@/components/ransomware/VictimsTable";
import { RansomwareVictim } from "@/types/ransomware";
import { Bug, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchVictimsByCountry } from "@/services/ransomwareAPI";
import { toast } from "sonner";

interface VictimsDataTabsProps {
  victims: RansomwareVictim[];
  recentVictims: RansomwareVictim[];
  loading: boolean;
  error: string | null;
}

export const VictimsDataTabs = ({
  victims,
  recentVictims,
  loading,
  error
}: VictimsDataTabsProps) => {
  const [vietnamVictims, setVietnamVictims] = useState<RansomwareVictim[]>([]);
  const [loadingVietnam, setLoadingVietnam] = useState(false);
  const [vietnamError, setVietnamError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadVietnamVictims = async () => {
      try {
        setLoadingVietnam(true);
        setVietnamError(null);
        const data = await fetchVictimsByCountry("VN");
        console.log("Fetched Vietnam victims data:", data);
        
        // Validate the data before using it
        if (!Array.isArray(data)) {
          console.error("Invalid Vietnam victims data format:", data);
          setVietnamError("Dữ liệu nạn nhân không đúng định dạng");
          return;
        }
        
        // Filter out entries with empty or "Unknown" victim_name 
        const filteredData = data.filter(victim => 
          victim.victim_name && 
          victim.victim_name !== "Unknown" && 
          victim.victim_name.trim() !== ""
        );
        
        console.log(`Vietnam victims: Total ${data.length}, After filtering ${filteredData.length}`);
        
        if (filteredData.length === 0 && data.length > 0) {
          // If we filtered everything out but had data, use original data
          setVietnamVictims(data);
        } else {
          setVietnamVictims(filteredData);
        }
      } catch (err) {
        console.error("Error fetching Vietnam victims:", err);
        setVietnamError("Không thể tải dữ liệu nạn nhân tại Việt Nam");
        toast.error("Không thể tải dữ liệu Việt Nam", {
          description: "Đã xảy ra lỗi khi tải dữ liệu nạn nhân tại Việt Nam."
        });
      } finally {
        setLoadingVietnam(false);
      }
    };
    
    loadVietnamVictims();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất Cả Nạn Nhân</TabsTrigger>
          <TabsTrigger value="recent">Gần Đây (24h)</TabsTrigger>
          <TabsTrigger value="vietnam">Việt Nam</TabsTrigger>
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
          ) : recentVictims.length === 0 && !loading ? (
            <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
              <AlertTriangle className="h-10 w-10" />
              Không có nạn nhân mới trong 24 giờ qua
            </div>
          ) : (
            <VictimsTable 
              victims={recentVictims} 
              loading={loading} 
            />
          )}
        </TabsContent>
        <TabsContent value="vietnam" className="pt-4">
          {vietnamError || error ? (
            <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
              <Bug className="h-10 w-10" />
              {vietnamError || error}
            </div>
          ) : vietnamVictims.length === 0 && !loadingVietnam ? (
            <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
              <AlertTriangle className="h-10 w-10" />
              Không tìm thấy nạn nhân tại Việt Nam
            </div>
          ) : (
            <VictimsTable 
              victims={vietnamVictims} 
              loading={loadingVietnam} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
