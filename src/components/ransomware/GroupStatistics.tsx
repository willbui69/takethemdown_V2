
import { useEffect, useState } from "react";
import { RansomwareGroup, RansomwareStat } from "@/types/ransomware";
import { fetchGroups, fetchStats } from "@/services/ransomwareAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Bug, ShieldAlert } from "lucide-react";

export const GroupStatistics = () => {
  const [stats, setStats] = useState<RansomwareStat[]>([]);
  const [groups, setGroups] = useState<RansomwareGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsGeoBlocked(false);
        
        // First fetch groups data
        const groupsData = await fetchGroups();
        console.log("Fetched groups data:", groupsData.slice(0, 5));
        setGroups(groupsData);
        
        // Derive initial stats from groups data to ensure we have something to display
        const initialStats: RansomwareStat[] = groupsData.map((group: RansomwareGroup) => ({
          group: group.name,
          count: typeof group.count === 'number' ? group.count : 0
        }));
        
        try {
          // Then try to fetch dedicated stats if available
          const statsData = await fetchStats();
          console.log("Fetched stats data:", statsData.slice(0, 5));
          
          // Ensure we have proper count values
          const processedStats = statsData.map((stat: RansomwareStat) => ({
            ...stat,
            count: typeof stat.count === 'number' ? stat.count : 0
          }));
          
          setStats(processedStats);
        } catch (statsError) {
          console.error("Error fetching stats:", statsError);
          // Fall back to the derived stats from groups
          console.log("Using derived stats from groups");
          setStats(initialStats);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu nhóm ransomware");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Combine group and stats data
  const combinedData = stats
    .map(stat => {
      const group = groups.find(g => g.name === stat.group);
      const victimCount = typeof stat.count === 'number' ? stat.count : 0;
      
      // Log to debug statistics data
      console.log(`Processing group ${stat.group}, count: ${victimCount}, active: ${group?.active}`);
      
      return {
        name: stat.group,
        victims: victimCount,
        active: group?.active ?? false,
      };
    })
    .filter(item => {
      if (filter === "all") return true;
      if (filter === "active") return item.active;
      if (filter === "inactive") return !item.active;
      return true;
    })
    .sort((a, b) => b.victims - a.victims)
    .slice(0, 15); // Only show top 15 groups

  console.log("Final chart data:", combinedData);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Thống Kê Nhóm Ransomware</CardTitle>
            <CardDescription>
              Số lượng nạn nhân theo nhóm ransomware
            </CardDescription>
          </div>
          <Select 
            value={filter} 
            onValueChange={(value) => setFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Nhóm</SelectItem>
              <SelectItem value="active">Nhóm Hoạt Động</SelectItem>
              <SelectItem value="inactive">Nhóm Không Hoạt Động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80 flex-col gap-2">
            {isGeoBlocked ? (
              <>
                <ShieldAlert className="h-10 w-10 text-red-500" />
                <p className="text-red-500">{error}</p>
                <p className="text-gray-500 text-sm text-center max-w-md mt-2">
                  Khu vực của bạn dường như bị chặn truy cập vào API ransomware.live.
                  Điều này có thể do các giới hạn địa lý được áp dụng bởi nhà cung cấp dữ liệu.
                </p>
              </>
            ) : (
              <>
                <Bug className="h-10 w-10 text-amber-500" />
                <p className="text-amber-500">{error}</p>
              </>
            )}
          </div>
        ) : combinedData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-gray-500">Không có dữ liệu cho bộ lọc đã chọn</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={combinedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="victims" 
                  name="Số Nạn Nhân" 
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
