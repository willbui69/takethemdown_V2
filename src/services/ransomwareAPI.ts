
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
    
    // If we get a 403 with country blocked message, consider it a special case
    if (response.status === 403) {
      const data = await response.json().catch(() => null);
      if (data?.error?.message?.includes("Country blocked")) {
        console.error("API access blocked: Your country is blocked from accessing ransomware.live data");
        toast.error("Geographic restriction", {
          description: "Your location is blocked from accessing ransomware.live data"
        });
        return false;
      }
    }
    
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
    
    // Handle country blocking specific error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message?.includes("Country blocked")) {
        throw new Error("Geographic restriction: Your location is blocked from accessing ransomware.live data");
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching victims: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    const message = error instanceof Error && error.message.includes("Geographic restriction") 
      ? "Geographic restriction: Your location is blocked from accessing victim data" 
      : "Failed to fetch victim data. Please try again later.";
    
    toast.error(message);
    throw error;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(getApiUrl(`/api/victims/${group}.json`));
    
    // Handle country blocking specific error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message?.includes("Country blocked")) {
        throw new Error("Geographic restriction: Your location is blocked from accessing ransomware.live data");
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching victims for group ${group}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    const message = error instanceof Error && error.message.includes("Geographic restriction") 
      ? "Geographic restriction: Your location is blocked from accessing victim data" 
      : `Failed to fetch victim data for ${group}. Please try again later.`;
    
    toast.error(message);
    throw error;
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  try {
    const response = await fetch(getApiUrl('/api/groups.json'));
    
    // Handle country blocking specific error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message?.includes("Country blocked")) {
        throw new Error("Geographic restriction: Your location is blocked from accessing ransomware.live data");
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    const message = error instanceof Error && error.message.includes("Geographic restriction") 
      ? "Geographic restriction: Your location is blocked from accessing group data" 
      : "Failed to fetch group data. Please try again later.";
    
    toast.error(message);
    throw error;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  try {
    const response = await fetch(getApiUrl('/api/stats.json'));
    
    // Handle country blocking specific error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message?.includes("Country blocked")) {
        throw new Error("Geographic restriction: Your location is blocked from accessing ransomware.live data");
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    const message = error instanceof Error && error.message.includes("Geographic restriction") 
      ? "Geographic restriction: Your location is blocked from accessing statistics data" 
      : "Failed to fetch statistics data. Please try again later.";
    
    toast.error(message);
    throw error;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    const response = await fetch(getApiUrl('/api/today.json'));
    
    // Handle country blocking specific error
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message?.includes("Country blocked")) {
        throw new Error("Geographic restriction: Your location is blocked from accessing ransomware.live data");
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching recent victims: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    const message = error instanceof Error && error.message.includes("Geographic restriction") 
      ? "Geographic restriction: Your location is blocked from accessing recent victim data" 
      : "Failed to fetch recent victim data. Please try again later.";
    
    toast.error(message);
    throw error;
  }
};
