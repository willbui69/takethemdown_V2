
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Flag to track if we're falling back to mock data
export let useMockData = false;

// Base URL for the Edge Function
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Supabase anon key - this is public and safe to include in client-side code
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

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
export const callEdgeFunction = async (endpoint: string) => {
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

// Helper function to display error toast and fall back to mock data
export const handleApiError = (errorMsg: string, fallbackMsg: string) => {
  console.error(errorMsg);
  toast.error(fallbackMsg, {
    description: "Falling back to demonstration data"
  });
  useMockData = true;
};
