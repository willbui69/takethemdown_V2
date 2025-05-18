
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";

const API_BASE_URL = "https://api.ransomware.live";

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/victims.json`);
    if (!response.ok) {
      throw new Error(`Error fetching victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    throw error;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/victims/${group}.json`);
    if (!response.ok) {
      throw new Error(`Error fetching victims for group ${group}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    throw error;
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/groups.json`);
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats.json`);
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/today.json`);
    if (!response.ok) {
      throw new Error(`Error fetching recent victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    throw error;
  }
};
