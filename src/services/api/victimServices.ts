
import { RansomwareVictim } from "@/types/ransomware";
import { toast } from "sonner";
import { mockVictims, mockRecentVictims } from "@/data/mockRansomwareData";
import { callEdgeFunction, useMockData } from "./ransomwareConfig";
import { normalizeVictimData } from "./dataTransformers";

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock victim data");
    return mockVictims;
  }
  
  try {
    // Try to use the new recentvictims endpoint as it might be more reliable
    const data = await callEdgeFunction('/recentvictims');
    console.log("Fetched victim data:", data?.length || 0, "records");
    return normalizeVictimData(data);
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    toast.error("Could not fetch victim data", {
      description: "Falling back to demonstration data"
    });
    return mockVictims;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log(`Using mock victim data for group ${group}`);
    return mockVictims.filter(v => v.group_name === group);
  }
  
  try {
    // Try the new groupvictims endpoint format
    const data = await callEdgeFunction(`/groupvictims/${group}`);
    return normalizeVictimData(data);
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    toast.error("Could not fetch group data", {
      description: "Falling back to demonstration data"
    });
    return mockVictims.filter(v => v.group_name === group);
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock recent victims data");
    return mockRecentVictims;
  }
  
  try {
    // Try the recentvictims endpoint (new format)
    const data = await callEdgeFunction('/recentvictims');
    console.log("Fetched recent victim data:", data?.length || 0, "records");
    
    // Log a sample of the raw data
    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample recent victim data:", data[0]);
    }
    
    return normalizeVictimData(data);
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Could not fetch recent victim data", {
      description: "Falling back to demonstration data"
    });
    return mockRecentVictims;
  }
};

export const fetchVietnameseVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock data for Vietnamese victims");
    // Filter mock data to only return Vietnamese victims
    return mockVictims.filter(v => v.country === "VN");
  }
  
  try {
    console.log("Fetching Vietnamese victims data");
    const data = await callEdgeFunction('/countryvictims/VN');
    console.log("Fetched Vietnamese victims data:", data?.length || 0, "records");
    
    // Log a sample of the raw data
    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample Vietnamese victim data:", data[0]);
    }
    
    return normalizeVictimData(data);
  } catch (error) {
    console.error("Failed to fetch Vietnamese victims:", error);
    toast.error("Không thể tải dữ liệu nạn nhân Việt Nam", {
      description: "Đang sử dụng dữ liệu mẫu thay thế"
    });
    return mockVictims.filter(v => v.country === "VN");
  }
};
