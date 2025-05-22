
import { RansomwareVictim } from "@/types/ransomware";
import { callEdgeFunction, handleApiError } from "../apiUtils";
import { normalizeVictimData } from "../victimDataNormalizer";

/**
 * Fetches victims from the last 24 hours
 */
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
