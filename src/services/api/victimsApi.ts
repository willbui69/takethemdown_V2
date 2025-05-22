
import { RansomwareVictim } from "@/types/ransomware";
import { callEdgeFunction, handleApiError } from "./apiUtils";
import { normalizeVictimData } from "./victimDataNormalizer";

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  try {
    // Try to use the recentvictims endpoint
    const data = await callEdgeFunction('/recentvictims');
    return normalizeVictimData(data);
  } catch (error) {
    handleApiError("Failed to fetch victims:", "Could not fetch victim data");
    return [];
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  try {
    // Try the groupvictims endpoint format
    const data = await callEdgeFunction(`/groupvictims/${group}`);
    return normalizeVictimData(data);
  } catch (error) {
    handleApiError(`Failed to fetch victims for group ${group}:`, "Could not fetch group data");
    return [];
  }
};

// This method will fetch victim counts directly from the groupvictims endpoint
export const fetchVictimCountForGroup = async (groupName: string): Promise<number> => {
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
  try {
    // Try the recentvictims endpoint
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
    return [];
  }
};

// Improved function to fetch victims by country code
export const fetchVictimsByCountry = async (countryCode: string): Promise<RansomwareVictim[]> => {
  try {
    // For Vietnam we need special handling as the API may return data in a different format
    const endpoint = `/countryvictims/${countryCode}`;
    
    console.log(`Fetching victims for country ${countryCode} from ${endpoint}`);
    const data = await callEdgeFunction(endpoint);
    
    if (!Array.isArray(data)) {
      console.error(`Invalid response format from ${endpoint}:`, data);
      throw new Error(`Invalid data format from ${endpoint}`);
    }
    
    console.log(`Received ${data.length} victims for country ${countryCode}`);
    
    // For debugging - log sample data structure
    if (data.length > 0) {
      console.log(`Sample victim data structure for ${countryCode}:`, 
        Object.keys(data[0]).join(', '));
      console.log(`First 2 victims for ${countryCode}:`, data.slice(0, 2));
    }
    
    // Use source parameter to help normalizer process country-specific data
    const normalizedData = normalizeVictimData(data, 'countryvictims');
    console.log(`Normalized ${normalizedData.length} victims for country ${countryCode}`);
    
    if (normalizedData.length > 0) {
      console.log(`First 3 normalized victims for ${countryCode}:`, normalizedData.slice(0, 3));
      return normalizedData;
    } else {
      console.log(`No victims found after normalization for ${countryCode}, trying allcyberattacks endpoint`);
      
      // Backup approach for Vietnam: try the allcyberattacks endpoint
      if (countryCode === "VN") {
        const backupData = await callEdgeFunction('/allcyberattacks');
        
        if (Array.isArray(backupData)) {
          // Filter for Vietnam entries
          const vnAttacks = backupData.filter(item => {
            const country = (item.country || '').toUpperCase();
            return country === 'VN' || country === 'VIETNAM';
          });
          
          console.log(`Found ${vnAttacks.length} Vietnam attacks in allcyberattacks`);
          
          if (vnAttacks.length > 0) {
            return normalizeVictimData(vnAttacks, 'cyberattacks');
          }
        }
      }
      
      // If all attempts failed, return empty array
      return [];
    }
  } catch (error) {
    console.error(`Failed to fetch victims for country ${countryCode}:`, error);
    
    // If the countryvictims endpoint fails, try a fallback to the general victims
    try {
      console.log(`Attempting fallback for ${countryCode} using all victims endpoint`);
      const allData = await callEdgeFunction('/recentvictims');
      
      // Filter by country manually
      const filteredData = allData.filter(item => {
        const country = (item.country || '').toLowerCase();
        if (countryCode === 'VN') {
          return country === 'vietnam' || 
                 country === 'vn' || 
                 country === 'việt nam' || 
                 country === 'viet nam';
        }
        return country === countryCode.toLowerCase();
      });
      
      console.log(`Fallback found ${filteredData.length} victims for ${countryCode}`);
      return normalizeVictimData(filteredData);
    } catch (fallbackError) {
      console.error(`Fallback also failed for ${countryCode}:`, fallbackError);
      handleApiError(`Failed to fetch victims for country ${countryCode}:`, `Could not fetch ${countryCode} victim data`);
      
      // Return empty array as last resort
      return [];
    }
  }
};
