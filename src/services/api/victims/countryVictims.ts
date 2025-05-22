
import { RansomwareVictim } from "@/types/ransomware";
import { callEdgeFunction, handleApiError } from "../apiUtils";
import { normalizeVictimData } from "../victimDataNormalizer";

/**
 * Fetches victims for a specific country code with fallback mechanisms
 */
export const fetchVictimsByCountry = async (countryCode: string): Promise<RansomwareVictim[]> => {
  try {
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
      handleApiError(
        `Failed to fetch victims for country ${countryCode}:`, 
        `Could not fetch ${countryCode} victim data`
      );
      
      // Return empty array as last resort
      return [];
    }
  }
};
