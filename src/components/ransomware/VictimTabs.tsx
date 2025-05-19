
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VictimsTable } from "./VictimsTable";
import { RansomwareVictim } from "@/types/ransomware";
import { Flag } from "lucide-react";
import { InfoPanel } from "./InfoPanel";

interface VictimTabsProps {
  victims: RansomwareVictim[];
  recentVictims: RansomwareVictim[];
  vietnameseVictims: RansomwareVictim[];
  loading: boolean;
  error: string | null;
}

export const VictimTabs = ({
  victims,
  recentVictims,
  vietnameseVictims,
  loading,
  error
}: VictimTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất Cả Nạn Nhân</TabsTrigger>
          <TabsTrigger value="recent">Gần Đây (24h)</TabsTrigger>
          <TabsTrigger value="vietnam" className="flex items-center gap-1">
            <Flag className="h-4 w-4" /> Việt Nam
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          {error ? (
            <InfoPanel isGeoBlocked={false} error={error} />
          ) : (
            <VictimsTable 
              victims={victims} 
              loading={loading} 
            />
          )}
        </TabsContent>
        <TabsContent value="recent" className="pt-4">
          {error ? (
            <InfoPanel isGeoBlocked={false} error={error} />
          ) : (
            <VictimsTable 
              victims={recentVictims} 
              loading={loading} 
            />
          )}
        </TabsContent>
        <TabsContent value="vietnam" className="pt-4">
          {error ? (
            <InfoPanel isGeoBlocked={false} error={error} />
          ) : (
            <VictimsTable 
              victims={vietnameseVictims} 
              loading={loading} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
