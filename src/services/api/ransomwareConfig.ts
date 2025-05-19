
import { RansomwareGroup, RansomwareVictim } from "@/types/ransomware";

// Edge Function URL for accessing the API
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Mock data for testing/fallback
let useMockData = false;

// Toggle between API and mock data
export const setUseMockData = (value: boolean) => {
  useMockData = value;
  console.log(`Using ${value ? 'mock' : 'real'} data for ransomware API`);
};

// Check if API is available
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/groups`);
    return response.ok;
  } catch (err) {
    console.error("API availability check failed:", err);
    return false;
  }
};
