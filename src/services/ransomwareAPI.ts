
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { mockVictims, mockRecentVictims, mockGroups, mockStats } from "@/data/mockRansomwareData";
import { toast } from "sonner";

const API_BASE_URL = "https://api.ransomware.live";
const USE_MOCK_DATA = true; // Set to true to force using mock data

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock victim data instead of API");
    return mockVictims;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/victims.json`);
    if (!response.ok) {
      throw new Error(`Error fetching victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    toast.error("Failed to fetch victim data. Using offline data instead.");
    return mockVictims;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  if (USE_MOCK_DATA) {
    console.log(`Using mock victim data for group ${group} instead of API`);
    return mockVictims.filter(victim => victim.group_name === group);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/victims/${group}.json`);
    if (!response.ok) {
      throw new Error(`Error fetching victims for group ${group}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    toast.error(`Failed to fetch victim data for ${group}. Using offline data instead.`);
    return mockVictims.filter(victim => victim.group_name === group);
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock group data instead of API");
    return mockGroups;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/groups.json`);
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Failed to fetch group data. Using offline data instead.");
    return mockGroups;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock stats data instead of API");
    return mockStats;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats.json`);
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast.error("Failed to fetch statistics data. Using offline data instead.");
    return mockStats;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock recent victim data instead of API");
    return mockRecentVictims;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/today.json`);
    if (!response.ok) {
      throw new Error(`Error fetching recent victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Failed to fetch recent victim data. Using offline data instead.");
    return mockRecentVictims;
  }
};
