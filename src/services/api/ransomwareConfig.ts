
import { RansomwareGroup, RansomwareVictim } from "@/types/ransomware";

// Edge Function URL for accessing the API
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Mock data for testing/fallback
export let useMockData = false;

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

// Function to call the Edge Function API
export const callEdgeFunction = async (endpoint: string): Promise<any> => {
  try {
    console.log(`Calling edge function: ${EDGE_FUNCTION_URL}${endpoint}`);
    const response = await fetch(`${EDGE_FUNCTION_URL}${endpoint}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error calling edge function ${endpoint}:`, err);
    throw err;
  }
};
