
import { RansomwareVictim } from "@/types/ransomware";
import { callEdgeFunction, handleApiError } from "../apiUtils";
import { normalizeVictimData } from "../victimDataNormalizer";

/**
 * Fetches all victims from the ransomware API
 */
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

/**
 * Fetches victims by the specified ransomware group
 */
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

/**
 * Gets the victim count for a specific ransomware group
 */
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
