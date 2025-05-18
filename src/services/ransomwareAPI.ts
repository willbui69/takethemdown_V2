
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { toast } from "sonner";

// The API base URL for ransomware.live
const API_BASE_URL = "https://api.ransomware.live";
// Use a CORS proxy to avoid CORS issues when accessing the API
const CORS_PROXY = "https://corsproxy.io/?";

// Function to check if the API is available
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    // Use the CORS proxy for the API check
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${API_BASE_URL}/api/groups.json`)}`, {
      method: 'HEAD',
      // Use a short timeout to quickly determine API availability
      signal: AbortSignal.timeout(5000)
    });
    
    const isAvailable = response.ok;
    console.log(`Ransomware.live API ${isAvailable ? 'is' : 'is not'} available`);
    return isAvailable;
  } catch (error) {
    console.error("Error checking API availability:", error);
    return false;
  }
};

// Helper function to build API URLs with CORS proxy
const getApiUrl = (endpoint: string): string => {
  return `${CORS_PROXY}${encodeURIComponent(`${API_BASE_URL}${endpoint}`)}`;
};

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(getApiUrl('/api/victims.json'));
    if (!response.ok) {
      throw new Error(`Error fetching victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    toast.error("Failed to fetch victim data. Please try again later.");
    throw error;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(getApiUrl(`/api/victims/${group}.json`));
    if (!response.ok) {
      throw new Error(`Error fetching victims for group ${group}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    toast.error(`Failed to fetch victim data for ${group}. Please try again later.`);
    throw error;
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  try {
    const response = await fetch(getApiUrl('/api/groups.json'));
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Failed to fetch group data. Please try again later.");
    throw error;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  try {
    const response = await fetch(getApiUrl('/api/stats.json'));
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast.error("Failed to fetch statistics data. Please try again later.");
    throw error;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(getApiUrl('/api/today.json'));
    if (!response.ok) {
      throw new Error(`Error fetching recent victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Failed to fetch recent victim data. Please try again later.");
    throw error;
  }
};
