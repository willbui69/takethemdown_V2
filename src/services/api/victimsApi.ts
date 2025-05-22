
import { RansomwareVictim } from "@/types/ransomware";
import { mockVictims, mockRecentVictims } from "@/data/mockRansomwareData";
import { callEdgeFunction, useMockData, handleApiError } from "./apiUtils";
import { normalizeVictimData } from "./victimDataNormalizer";

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock victim data");
    return mockVictims;
  }
  
  try {
    // Try to use the new recentvictims endpoint as it might be more reliable
    const data = await callEdgeFunction('/recentvictims');
    return normalizeVictimData(data);
  } catch (error) {
    handleApiError("Failed to fetch victims:", "Could not fetch victim data");
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
    handleApiError(`Failed to fetch victims for group ${group}:`, "Could not fetch group data");
    return mockVictims.filter(v => v.group_name === group);
  }
};

// This method will fetch victim counts directly from the groupvictims endpoint
export const fetchVictimCountForGroup = async (groupName: string): Promise<number> => {
  if (useMockData) {
    console.log(`Using mock victim count data for group ${groupName}`);
    const mockGroupVictims = mockVictims.filter(v => v.group_name === groupName);
    return mockGroupVictims.length;
  }
  
  try {
    console.log(`Fetching victim count for group ${groupName} from /groupvictims endpoint`);
    const data = await callEdgeFunction(`/groupvictims/${groupName}`);
    
    if (!Array.isArray(data)) {
      console.error(`Invalid response format for group ${groupName} victims:`, data);
      return 0;
    }
    
    console.log(`Received ${data.length} victims for group ${groupName}`);
    return data.length;
  } catch (error) {
    console.error(`Failed to fetch victim count for group ${groupName}:`, error);
    return 0;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock recent victims data");
    // Filter mock data to last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return mockRecentVictims.filter(victim => {
      if (!victim.published) return false;
      const publishDate = new Date(victim.published);
      return publishDate >= oneDayAgo;
    });
  }
  
  try {
    // Try the recentvictims endpoint (new format)
    const data = await callEdgeFunction('/recentvictims');
    const normalizedData = normalizeVictimData(data);
    
    // Filter to only victims from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return normalizedData.filter(victim => {
      if (!victim.published) {
        // If published date is missing, fall back to other date fields
        const dateField = victim.discovered || victim.attackdate;
        if (!dateField) return false;
        
        const victimDate = new Date(dateField);
        return !isNaN(victimDate.getTime()) && victimDate >= oneDayAgo;
      }
      
      const publishDate = new Date(victim.published);
      return !isNaN(publishDate.getTime()) && publishDate >= oneDayAgo;
    });
  } catch (error) {
    handleApiError("Failed to fetch recent victims:", "Could not fetch recent victim data");
    
    // Filter mock data to last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return mockRecentVictims.filter(victim => {
      if (!victim.published) return false;
      const publishDate = new Date(victim.published);
      return publishDate >= oneDayAgo;
    });
  }
};

// Added new function to fetch victims by country code
export const fetchVictimsByCountry = async (countryCode: string): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log(`Using mock victim data for country ${countryCode}`);
    // Filter mock data for country with more thorough name matching
    return mockVictims.filter(v => {
      if (!v.country) return false;
      const victimCountry = v.country.toLowerCase();
      if (countryCode === "VN") {
        return victimCountry === "vietnam" || 
               victimCountry === "việt nam" || 
               victimCountry === "viet nam" || 
               victimCountry === "vn";
      }
      return victimCountry === countryCode.toLowerCase();
    });
  }
  
  try {
    // Call the country-specific endpoint
    console.log(`Fetching victims for country ${countryCode} from /countryvictims endpoint`);
    const data = await callEdgeFunction(`/countryvictims/${countryCode}`);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No data returned for country ${countryCode} or invalid response format`);
    } else {
      console.log(`Received ${data.length} victims for country ${countryCode}`);
      // Log a sample of the first victim data
      if (data.length > 0) {
        console.log("Sample victim data structure:", JSON.stringify(data[0], null, 2));
      }
    }
    
    return normalizeVictimData(data);
  } catch (error) {
    handleApiError(`Failed to fetch victims for country ${countryCode}:`, `Could not fetch ${countryCode} victim data`);
    
    // Fallback to filtered mock data with improved matching
    return mockVictims.filter(v => {
      if (!v.country) return false;
      const victimCountry = v.country.toLowerCase();
      if (countryCode === "VN") {
        return victimCountry === "vietnam" || 
               victimCountry === "việt nam" || 
               victimCountry === "viet nam" || 
               victimCountry === "vn";
      }
      return victimCountry === countryCode.toLowerCase();
    });
  }
};
