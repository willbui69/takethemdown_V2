
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { toast } from "sonner";

// The API base URL for ransomware.live v2
const API_BASE_URL = "https://api.ransomware.live/v2";
const CORS_PROXY    = "https://corsproxy.io/?";

export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    // Hit the /groups endpoint with GET
    const url = `${CORS_PROXY}${API_BASE_URL}/groups`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(id);

    if (response.status === 403) {
      // (Unlikely for the API, but you can still handle it)
      const data = await response.json().catch(() => null);
      if (data?.error?.message?.includes("Country blocked")) {
        toast.error("Geographic restriction", {
          description: "Your location is blocked from accessing ransomware.live data"
        });
        return false;
      }
    }

    console.log(`Ransomware.live API is ${response.ok ? "available" : "not available"}`);
    return response.ok;
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
    const response = await fetch(getApiUrl('/victims'));
    
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
    const response = await fetch(getApiUrl(`/victims/${group}`));
    
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
    const response = await fetch(getApiUrl('/groups'));
    
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
    const response = await fetch(getApiUrl('/stats'));
    
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
    const response = await fetch(getApiUrl('/today'));
    
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
