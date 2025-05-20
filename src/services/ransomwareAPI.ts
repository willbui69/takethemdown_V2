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

    return await response.json();
  } catch (error) {
    console.error(`Error calling Edge Function with endpoint ${endpoint}:`, error);
    throw error;
  }
};

// Function to normalize victim data from different API sources
const normalizeVictimData = (data: any[]): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }

  return data.map(item => {
    // Check for field mappings based on actual API response structure
    const victim_name = item.victim || item.victim_name || item.name || item.domain || "Unknown";
    
    // Group name is usually consistent as "group" in the API
    const group_name = item.group || item.group_name || "Unknown Group";
    
    // Look for various date fields and select the first available one
    const publishedDate = item.discovered || item.attackdate || item.published || item.date || null;
    
    // Map country and industry from the available fields
    const country = item.country || item.location || null;
    const industry = item.activity || item.industry || item.sector || item.business_sector || null;
    
    // URL might be in different fields
    const url = item.url || item.victim_url || item.claim_url || item.link || null;

    // Detailed logging for debugging data processing
    console.log("Processing victim data:", { 
      name: victim_name, 
      group: group_name, 
      published: publishedDate, 
      country, 
      industry,
      originalItem: {
        victim: item.victim,
        group: item.group,
        discovered: item.discovered,
        country: item.country,
        activity: item.activity,
        industry: item.industry
      }
    });

    return {
      victim_name: victim_name,
      group_name: group_name,
      published: publishedDate,
      country: country,
      industry: industry,
      url: url,
    };
  });
};

export const fetchAllVictims = async (): Promise<RansomwareVictim[]> => {
  if (useMockData) {
    console.log("Using mock victim data");
    return mockVictims;
  }
  
  try {
    // Try to use the new recentvictims endpoint as it might be more reliable
    const data = await callEdgeFunction('/recentvictims');
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
    
    // Process the data to ensure we extract proper count values
    const processedGroups = data.map((group: any) => {
      // Extract count from various possible locations in the API response
      let victimCount = 0;
      
      // Based on the Edge Function logs, we know that group.locations is available
      if (Array.isArray(group.locations)) {
        victimCount = group.locations.length;
      }
      // The API might include count directly
      else if (typeof group.count === 'number') {
        victimCount = group.count;
      } 
      // Or it might be in victim_count
      else if (typeof group.victim_count === 'number') {
        victimCount = group.victim_count;
      }
      // It could also be in the victims array length
      else if (Array.isArray(group.victims)) {
        victimCount = group.victims.length;
      }
      // Or in posts array length
      else if (Array.isArray(group.posts)) {
        victimCount = group.posts.length;
      }
      
      console.log(`Group ${group.name}: extracted count = ${victimCount}, has locations: ${Array.isArray(group.locations)}, locations length: ${Array.isArray(group.locations) ? group.locations.length : 'N/A'}`);
      
      return {
        name: group.name,
        active: group.parser || false, // Based on Edge Function logs, parser seems to be the active flag
        url: group.url || "",
        count: victimCount
      };
    });
    
    return processedGroups;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    toast.error("Could not fetch group data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    return mockGroups;
  }
};

// We'll derive stats directly from the groups data since the /stats endpoint isn't working
export const fetchStats = async (): Promise<RansomwareStat[]> => {
  if (useMockData) {
    console.log("Using mock stats data");
    return mockStats;
  }
  
  try {
    // From the Edge Function logs, we see the /stats endpoint is blocked
    // So we'll derive stats directly from the groups data
    console.log("Stats endpoint seems to be blocked, deriving from groups data");
    const groups = await fetchGroups();
    
    // Convert group data to stats format
    const derivedStats: RansomwareStat[] = groups.map((group) => {
      return {
        group: group.name,
        count: group.count
      };
    });
    
    console.log("Derived stats from groups:", derivedStats.slice(0, 5));
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
    // Filter mock data to last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return mockRecentVictims.filter(victim => {
      if (!victim.published) return false;
      const publishDate = new Date(victim.published);
      return publishDate >= oneDayAgo;
    });
  }
  
  try {
    // Try the recentvictims endpoint (new format)
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
    console.error("Failed to fetch recent victims:", error);
    toast.error("Could not fetch recent victim data", {
      description: "Falling back to demonstration data"
    });
    useMockData = true;
    
    // Filter mock data to last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return mockRecentVictims.filter(victim => {
      if (!victim.published) return false;
      const publishDate = new Date(victim.published);
      return publishDate >= oneDayAgo;
    });
  }
};
