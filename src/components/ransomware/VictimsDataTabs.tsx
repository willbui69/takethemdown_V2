
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VictimsTable } from "@/components/ransomware/VictimsTable";
import { RansomwareVictim } from "@/types/ransomware";
import { Bug, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

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
  
  // Filter victims to find those located in Vietnam
  const vietnamVictims = useMemo(() => {
    return victims.filter(victim => {
      if (!victim.country) return false;
      
      // Case-insensitive check for "Vietnam" in the country field
      const countryLower = victim.country.toLowerCase();
      return countryLower === "vietnam" || 
             countryLower === "việt nam" || 
             countryLower === "viet nam" || 
             countryLower === "vn";
    });
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
          {error ? (
            <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
              <Bug className="h-10 w-10" />
              {error}
            </div>
          ) : vietnamVictims.length === 0 && !loading ? (
            <div className="text-center py-8 text-amber-500 flex flex-col items-center gap-2">
              <AlertTriangle className="h-10 w-10" />
              Không tìm thấy nạn nhân tại Việt Nam
            </div>
          ) : (
            <VictimsTable 
              victims={vietnamVictims} 
              loading={loading} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
