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

// Transform and normalize ransomware victim data
export const normalizeVictimData = (data: any[]): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }
  
  return data.map(item => {
    // Enhanced victim name extraction with strict validation
    let victimName = "Unknown Organization";
    
    // First try using the 'victim' field, which seems to contain the actual organization name
    if (item.victim && typeof item.victim === 'string' && item.victim.trim() !== '' && 
        item.victim !== 'null' && item.victim !== 'undefined' && 
        !item.victim.includes('ransomware.live')) {
      victimName = item.victim;
    } 
    // Then try domain
    else if (item.domain && typeof item.domain === 'string' && item.domain.trim() !== '' && 
             item.domain !== 'null' && item.domain !== 'undefined' &&
             !item.domain.includes('ransomware.live')) {
      victimName = item.domain;
    }
    // Fall back to other fields
    else if (item.victim_name && typeof item.victim_name === 'string' && item.victim_name.trim() !== '' && 
             item.victim_name !== 'null' && item.victim_name !== 'undefined' &&
             !item.victim_name.includes('ransomware.live')) {
      victimName = item.victim_name;
    } 
    else if (item.company && typeof item.company === 'string' && item.company.trim() !== '' && 
             item.company !== 'null' && item.company !== 'undefined') {
      victimName = item.company;
    } 
    else if (item.title && typeof item.title === 'string' && item.title.trim() !== '' && 
             item.title !== 'null' && item.title !== 'undefined') {
      victimName = item.title;
    } 
    else if (item.name && typeof item.name === 'string' && item.name.trim() !== '' && 
             item.name !== 'null' && item.name !== 'undefined') {
      victimName = item.name;
    }
    else if (item.url && typeof item.url === 'string' && item.url.trim() !== '') {
      // Try to extract name from URL only if we have no other options
      try {
        const urlObj = new URL(item.url);
        const hostname = urlObj.hostname.replace('www.', '');
        // Only use the hostname if it's not ransomware.live
        if (!hostname.includes('ransomware.live')) {
          victimName = hostname;
        }
      } catch (e) {
        // If URL parsing fails, use the URL as is or fallback
        const urlString = item.url.replace(/^https?:\/\//, '');
        if (!urlString.includes('ransomware.live')) {
          victimName = urlString;
        }
      }
    }
    
    // Log the data extraction process for the first few items to help with debugging
    if (data.indexOf(item) < 2) {
      console.log("Raw item data:", item);
      console.log("Extracted victim name:", victimName);
      console.log("Source field for name:", 
        item.victim ? "victim field" : 
        item.domain ? "domain field" : 
        item.victim_name ? "victim_name field" :
        item.company ? "company field" :
        item.title ? "title field" :
        item.name ? "name field" :
        item.url ? "url field" : "fallback value");
    }
    
    // Enhanced date extraction - prioritizing discovered/discovery_date fields
    const publishDate = 
      item.discovered || 
      item.discovery_date ||
      item.published || 
      item.date || 
      item.leaked ||
      null;
    
    // Extract industry information, check 'activity' field first which seems more reliable
    const industry = item.activity || item.industry || item.sector || null;
    
    return {
      victim_name: victimName,
      group_name: item.group_name || item.group || "Unknown Group",
      published: publishDate,
      country: item.country || null,
      industry: industry,
      url: item.url || item.claim_url || item.victim_url || null,
      ...item // Keep all original properties
    };
  });
};

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

    return await response.json();
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
    // Try to use the new recentvictims endpoint as it might be more reliable
    const data = await callEdgeFunction('/recentvictims');
    console.log("Fetched victim data:", data?.length || 0, "records");
    return normalizeVictimData(data);
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
    // Try the new groupvictims endpoint format
    const data = await callEdgeFunction(`/groupvictims/${group}`);
    return normalizeVictimData(data);
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
    // Since the /stats endpoint might not be available in the new API format,
    // let's derive stats from the groups data
    const groups = await callEdgeFunction('/groups');
    
    // Convert the groups data to stats format
    const derivedStats: RansomwareStat[] = groups.map((group: any) => ({
      group: group.name,
      count: group.victim_count || 0
    }));
    
    return derivedStats;
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
    // Try the recentvictims endpoint (new format)
    const data = await callEdgeFunction('/recentvictims');
    console.log("Fetched recent victim data:", data?.length || 0, "records");
    
    // Log a sample of the raw data
    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample recent victim data:", data[0]);
    }
    
    return normalizeVictimData(data);
  } catch (error) {
    console.error("Failed to fetch recent victims:", error);
    toast.error("Could not fetch recent victim data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockRecentVictims;
  }
};
