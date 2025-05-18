
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
import { Bug, CloudOff } from "lucide-react";

export const GroupStatistics = () => {
  const [stats, setStats] = useState<RansomwareStat[]>([]);
  const [groups, setGroups] = useState<RansomwareGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using Promise.allSettled to continue even if one promise fails
        const [groupsResult, statsResult] = await Promise.allSettled([
          fetchGroups(),
          fetchStats(),
        ]);
        
        if (groupsResult.status === 'fulfilled') {
          setGroups(groupsResult.value);
          if (groupsResult.value.length > 0 && groupsResult.value[0].name === 'LockBit') {
            setUsingMockData(true);
          }
        } else {
          console.error("Error fetching groups:", groupsResult.reason);
          setUsingMockData(true);
        }
        
        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value);
        } else {
          console.error("Error fetching stats:", statsResult.reason);
          setUsingMockData(true);
        }
      } catch (err) {
        setError("Failed to fetch ransomware group data");
        setUsingMockData(true);
        console.error("Error fetching data:", err);
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
      return {
        name: stat.group,
        victims: stat.count,
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ransomware Group Statistics</CardTitle>
            <CardDescription>
              Victim counts by ransomware group
              {usingMockData && (
                <span className="flex items-center mt-1 text-amber-600 text-xs font-medium">
                  <CloudOff className="h-3 w-3 mr-1" /> Using mock data
                </span>
              )}
            </CardDescription>
          </div>
          <Select 
            value={filter} 
            onValueChange={(value) => setFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="active">Active Groups</SelectItem>
              <SelectItem value="inactive">Inactive Groups</SelectItem>
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
            <Bug className="h-10 w-10 text-amber-500" />
            <p className="text-amber-500">{error}</p>
          </div>
        ) : combinedData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-gray-500">No data available for the selected filter</p>
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
                  name="Victim Count" 
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
