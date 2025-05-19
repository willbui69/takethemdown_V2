
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { supabase } from "@/integrations/supabase/client";

export { checkApiAvailability, setUseMockData } from './api/ransomwareConfig';
export { fetchAllVictims, fetchRecentVictims, fetchVictimsByGroup, fetchVietnameseVictims } from './api/victimServices';
export { fetchGroups, fetchStats } from './api/groupServices';
export { normalizeVictimData } from './api/dataTransformers';
