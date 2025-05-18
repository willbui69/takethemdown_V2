
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { mockVictims, mockRecentVictims, mockGroups, mockStats } from "@/data/mockRansomwareData";
import { toast } from "sonner";

// The API base URL for ransomware.live
const API_BASE_URL = "https://api.ransomware.live";
// Use a CORS proxy to avoid CORS issues when accessing the API
const CORS_PROXY = "https://corsproxy.io/?";
let API_AVAILABLE: boolean | null = null;

// Function to check if the API is available
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    // Use the CORS proxy for the API check
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${API_BASE_URL}/api/groups.json`)}`, {
      method: 'HEAD',
      // Use a short timeout to quickly determine API availability
      signal: AbortSignal.timeout(5000)
    });
    
    API_AVAILABLE = response.ok;
    console.log(`Ransomware.live API ${API_AVAILABLE ? 'is' : 'is not'} available`);
    return API_AVAILABLE;
  } catch (error) {
    console.error("Error checking API availability:", error);
    API_AVAILABLE = false;
    return false;
  }
};

// Helper function to build API URLs with CORS proxy
const getApiUrl = (endpoint: string): string => {
  return `${CORS_PROXY}${encodeURIComponent(`${API_BASE_URL}${endpoint}`)}`;
};

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  // If API availability hasn't been checked yet, check it
  if (API_AVAILABLE === null) {
    await checkApiAvailability();
  }
  
  // If API is not available, use mock data
  if (API_AVAILABLE === false) {
    console.log("Using mock victim data instead of API");
    return mockVictims;
  }
  
  try {
    const response = await fetch(getApiUrl('/api/victims.json'));
    if (!response.ok) {
      throw new Error(`Error fetching victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    toast.error("Failed to fetch victim data. Using offline data instead.");
    // Set API availability to false for future requests
    API_AVAILABLE = false;
    return mockVictims;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  // If API availability hasn't been checked yet, check it
  if (API_AVAILABLE === null) {
    await checkApiAvailability();
  }
  
  // If API is not available, use mock data
  if (API_AVAILABLE === false) {
    console.log(`Using mock victim data for group ${group} instead of API`);
    return mockVictims.filter(victim => victim.group_name === group);
  }
  
  try {
    const response = await fetch(getApiUrl(`/api/victims/${group}.json`));
    if (!response.ok) {
      throw new Error(`Error fetching victims for group ${group}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    toast.error(`Failed to fetch victim data for ${group}. Using offline data instead.`);
    // Set API availability to false for future requests
    API_AVAILABLE = false;
    return mockVictims.filter(victim => victim.group_name === group);
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  // If API availability hasn't been checked yet, check it
  if (API_AVAILABLE === null) {
    await checkApiAvailability();
  }
  
  // If API is not available, use mock data
  if (API_AVAILABLE === false) {
    console.log("Using mock group data instead of API");
    return mockGroups;
  }
  
  try {
    const response = await fetch(getApiUrl('/api/groups.json'));
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Failed to fetch group data. Using offline data instead.");
    // Set API availability to false for future requests
    API_AVAILABLE = false;
    return mockGroups;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  // If API availability hasn't been checked yet, check it
  if (API_AVAILABLE === null) {
    await checkApiAvailability();
  }
  
  // If API is not available, use mock data
  if (API_AVAILABLE === false) {
    console.log("Using mock stats data instead of API");
    return mockStats;
  }
  
  try {
    const response = await fetch(getApiUrl('/api/stats.json'));
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast.error("Failed to fetch statistics data. Using offline data instead.");
    // Set API availability to false for future requests
    API_AVAILABLE = false;
    return mockStats;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  // If API availability hasn't been checked yet, check it
  if (API_AVAILABLE === null) {
    await checkApiAvailability();
  }
  
  // If API is not available, use mock data
  if (API_AVAILABLE === false) {
    console.log("Using mock recent victim data instead of API");
    return mockRecentVictims;
  }
  
  try {
    const response = await fetch(getApiUrl('/api/today.json'));
    if (!response.ok) {
      throw new Error(`Error fetching recent victims: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Failed to fetch recent victim data. Using offline data instead.");
    // Set API availability to false for future requests
    API_AVAILABLE = false;
    return mockRecentVictims;
  }
};
