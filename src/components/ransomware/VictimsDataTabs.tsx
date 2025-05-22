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
        
        console.log("Fetching Vietnam victims data...");
        const data = await fetchVictimsByCountry("VN");
        
        if (!Array.isArray(data)) {
          console.error("Invalid Vietnam victims data format:", data);
          setVietnamError("Dữ liệu nạn nhân không đúng định dạng");
          return;
        }
        
        console.log(`Retrieved ${data.length} Vietnam victims before filtering`);
        
        // Only filter out completely invalid entries
        const filteredData = data.filter(victim => {
          // Keep entries with any valid victim name that's not one of the common placeholders
          const name = victim.victim_name || "";
          return name && 
                 name !== "Unknown" && 
                 name.trim() !== "" && 
                 name !== "N/A" &&
                 name !== "Not Available";
        });
        
        console.log(`Vietnam victims: Total ${data.length}, After filtering ${filteredData.length}`);
        console.log("First 3 Vietnam victims after filtering:", filteredData.slice(0, 3));
        
        if (filteredData.length === 0) {
          // If we still don't have enough valid victims, use the unfiltered data as last resort
          if (data.length > 0) {
            console.log("Using unfiltered data as last resort");
            setVietnamVictims(data);
          } else {
            // Final fallback - search for Vietnam in the general victims list
            console.log("No Vietnam victims found, searching in general list...");
            const fallbackVietnamVictims = victims.filter(victim => {
              const country = (victim.country || "").toLowerCase();
              return country === "vietnam" || 
                     country === "việt nam" || 
                     country === "viet nam" || 
                     country === "vn";
            });
            
            if (fallbackVietnamVictims.length > 0) {
              console.log(`Found ${fallbackVietnamVictims.length} Vietnam victims in general list`);
              setVietnamVictims(fallbackVietnamVictims);
            } else {
              setVietnamVictims([]);
              setVietnamError("Không tìm thấy dữ liệu nạn nhân tại Việt Nam");
            }
          }
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
  }, [victims]);

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
