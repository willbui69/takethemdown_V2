
import { RansomwareGroup, RansomwareStat } from "@/types/ransomware";
import { callEdgeFunction, handleApiError } from "./apiUtils";
import { fetchVictimCountForGroup } from "./victims";

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  try {
    const data = await callEdgeFunction('/groups');
    
    // Process the groups but defer victim count to the separate API call
    const processedGroups = data.map((group: any) => {
      return {
        name: group.name,
        active: group.parser || false,
        url: group.url || "",
        count: 0 // Initialize with 0, will fetch actual counts separately
      };
    });
    
    return processedGroups;
  } catch (error) {
    handleApiError("Failed to fetch groups:", "Could not fetch group data");
    return [];
  }
};

// We'll derive stats by fetching victim counts for each group
export const fetchStats = async (): Promise<RansomwareStat[]> => {
  try {
    console.log("Fetching groups to derive stats from victim counts");
    const groups = await fetchGroups();
    
    // For each group, fetch the actual victim count from the dedicated endpoint
    const statsPromises = groups.map(async (group) => {
      const victimCount = await fetchVictimCountForGroup(group.name);
      return {
        group: group.name,
        count: victimCount,
        last_update: new Date().toISOString() // Use current date as we don't have actual last update
      };
    });
    
    const derivedStats = await Promise.all(statsPromises);
    
    console.log("Derived stats with actual victim counts:", derivedStats.slice(0, 5));
    return derivedStats;
  } catch (error) {
    handleApiError("Failed to fetch stats:", "Could not fetch statistics data");
    return [];
  }
};
