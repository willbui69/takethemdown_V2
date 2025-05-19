
import { useEffect, useState } from "react";
import { RansomwareGroup, RansomwareStat } from "@/types/ransomware";
import { fetchGroups } from "@/services/ransomwareAPI";
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
import { Bug, ShieldAlert, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const GroupStatistics = () => {
  const [groups, setGroups] = useState<RansomwareGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeoBlocked, setIsGeoBlocked] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsGeoBlocked(false);
        
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
        
        // Calculate active and inactive counts
        const activeGroups = fetchedGroups.filter(group => group.active);
        const inactive = fetchedGroups.filter(group => !group.active);
        
        setActiveCount(activeGroups.length);
        setInactiveCount(inactive.length);
        
        console.log("Fetched groups:", fetchedGroups.length);
        console.log("Active groups:", activeGroups.length);
        console.log("Inactive groups:", inactive.length);
        
      } catch (err) {
        setError("Không thể tải dữ liệu nhóm ransomware");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare data for chart display with filtering
  const chartData = groups
    .filter(group => {
      if (filter === "all") return true;
      if (filter === "active") return group.active;
      if (filter === "inactive") return !group.active;
      return true;
    })
    .sort((a, b) => (b.victim_count || 0) - (a.victim_count || 0))
    .slice(0, 15); // Only show top 15 groups

  console.log("Filtered chart data:", filter, chartData.length);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Thống Kê Nhóm Ransomware</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Số lượng nạn nhân theo nhóm ransomware
              <div className="flex gap-2 items-center mt-1">
                <Badge variant="outline" className="bg-green-100">
                  <AlertCircle className="h-3 w-3 mr-1 text-green-600" />
                  {activeCount} Nhóm Hoạt Động
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-600" />
                  {inactiveCount} Nhóm Không Hoạt Động
                </Badge>
              </div>
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
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-gray-500">Không có dữ liệu cho bộ lọc đã chọn</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [Number(value).toLocaleString(), 'Số Nạn Nhân']}
                  labelFormatter={(label) => `Nhóm: ${label}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const group = chartData.find(g => g.name === label);
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm">{Number(payload[0].value).toLocaleString()} nạn nhân</p>
                          <p className="text-xs text-gray-600">
                            Trạng thái: {group?.active ? 'Hoạt Động' : 'Không Hoạt Động'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend formatter={(value) => `Số Nạn Nhân`} />
                <Bar 
                  dataKey="victim_count" 
                  name="Số Nạn Nhân" 
                  fill="#8884d8" 
                  fillOpacity={0.9}
                  stroke="#6661b1"
                  // Change bar color based on active status
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
