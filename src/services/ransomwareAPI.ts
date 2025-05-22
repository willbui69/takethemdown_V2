
import { RansomwareVictim, RansomwareGroup, RansomwareStat } from "@/types/ransomware";

// Re-export from individual modules
export { checkApiAvailability } from "./api/apiUtils";
export { 
  fetchAllVictims, 
  fetchVictimsByGroup, 
  fetchVictimCountForGroup, 
  fetchRecentVictims,
  fetchVictimsByCountry 
} from "./api/victims";
export { fetchGroups, fetchStats } from "./api/groupsApi";
