
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";
import { toast } from "sonner";
import { mockVictims, mockRecentVictims, mockGroups, mockStats } from "@/data/mockRansomwareData";
import { supabase } from "@/integrations/supabase/client";

// Flag to track if we're falling back to mock data
let useMockData = false;

// Base URL for the Edge Function
const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Supabase anon key - this is public and safe to include in client-side code
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking API availability via Edge Function");
    // Call the edge function with the /groups endpoint path
    const response = await fetch(`${EDGE_FUNCTION_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      console.error("Edge Function returned status", response.status);
      useMockData = true;
      return false;
    }

    console.log("Edge Function is available");
    useMockData = false;
    return true;
  } catch (err) {
    console.error("Error checking API availability:", err);
    useMockData = true;
    return false;
  }
};

// Helper function to call the Edge Function
const callEdgeFunction = async (endpoint: string) => {
  try {
    console.log(`Calling Edge Function with endpoint: ${endpoint}`);
    const response = await fetch(`${EDGE_FUNCTION_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Edge Function returned status ${response.status}`);
    }

    const text = await response.text();
    
    // Check if we received HTML
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error("API returned HTML instead of JSON");
    }
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from API response:", e);
      throw new Error("Failed to parse API response");
    }
  } catch (error) {
    console.error(`Error calling Edge Function with endpoint ${endpoint}:`, error);
    throw error;
  }
};

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock victim data");
    return mockVictims;
  }
  
  try {
    const data = await callEdgeFunction('/victims');
    return data;
  } catch (error) {
    console.error("Failed to fetch victims:", error);
    toast.error("Could not fetch victim data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockVictims;
  }
};

export const fetchVictimsByGroup = async (group: string): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log(`Using mock victim data for group ${group}`);
    return mockVictims.filter(v => v.group_name === group);
  }
  
  try {
    const data = await callEdgeFunction(`/victims/${group}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch victims for group ${group}:`, error);
    toast.error("Could not fetch group data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockVictims.filter(v => v.group_name === group);
  }
};

export const fetchGroups = async (): Promise<RansomwareGroup[]> => {
  if (useMockData) {
    console.log("Using mock group data");
    return mockGroups;
  }
  
  try {
    const data = await callEdgeFunction('/groups');
    return data;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Could not fetch group data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockGroups;
  }
};

export const fetchStats = async (): Promise<RansomwareStat[]> => {
  if (useMockData) {
    console.log("Using mock stats data");
    return mockStats;
  }
  
  try {
    const data = await callEdgeFunction('/stats');
    return data;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    toast.error("Could not fetch statistics data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockStats;
  }
};

export const fetchRecentVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock recent victims data");
    return mockRecentVictims;
  }
  
  try {
    const data = await callEdgeFunction('/today');
    return data;
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Could not fetch recent victim data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockRecentVictims;
  }
};
