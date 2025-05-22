
import { RansomwareVictim, RansomwareGroup, RansomwareStat } from "@/types/ransomware";

// Re-export from individual modules
export { useMockData, checkApiAvailability } from "./api/apiUtils";
export { 
  fetchAllVictims, 
  fetchVictimsByGroup, 
  fetchVictimCountForGroup, 
  fetchRecentVictims 
} from "./api/victimsApi";
export { fetchGroups, fetchStats } from "./api/groupsApi";
