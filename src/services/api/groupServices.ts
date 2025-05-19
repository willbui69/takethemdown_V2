
import { RansomwareGroup, RansomwareStat } from "@/types/ransomware";
import { toast } from "sonner";
import { mockGroups, mockStats } from "@/data/mockRansomwareData";
import { callEdgeFunction, useMockData } from "./ransomwareConfig";

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  if (useMockData) {
    console.log("Using mock group data");
    return mockGroups;
  }
  
  try {
    const data = await callEdgeFunction('/groups');
    console.log("Fetched groups data:", data?.length || 0, "records");
    
    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample group data:", 
        data.slice(0, 5).map(g => ({
          name: g.name,
          victim_count: g.victim_count,
          active: g.active
        }))
      );
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Could not fetch group data", {
      description: "Falling back to demonstration data"
    });
    return mockGroups;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  // Since we now get victim counts directly from groups, we can derive stats from there
  try {
    const groups = await fetchGroups();
    
    if (!Array.isArray(groups)) {
      console.error("Invalid groups data format");
      throw new Error("Invalid groups data format");
    }
    
    console.log("Deriving stats from", groups.length, "groups");
    
    // Convert the groups data to stats format
    const derivedStats: RansomwareStat[] = groups
      .filter(group => group && typeof group === 'object')
      .map((group: RansomwareGroup) => {
        return {
          group: group.name || "Unknown Group",
          count: typeof group.victim_count === 'number' ? group.victim_count : 0
        };
      });
    
    console.log("Derived stats:", derivedStats.length, "records");
    return derivedStats;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast.error("Could not fetch statistics data", {
      description: "Falling back to demonstration data"
    });
    return mockStats;
  }
};
