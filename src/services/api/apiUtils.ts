
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, ClientRateLimit } from "@/utils/security";

// Base URL for the Edge Function
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Supabase anon key - this is public and safe to include in client-side code
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

// Client-side rate limiting
const rateLimit = new ClientRateLimit(50, 60000); // 50 requests per minute

export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    if (!rateLimit.canMakeRequest()) {
      console.warn("Rate limit exceeded on client side");
      return false;
    }

    console.log("Checking API availability via Edge Function");
    const response = await fetch(`${EDGE_FUNCTION_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      console.error("Edge Function returned status", response.status);
      return false;
    }

    console.log("Edge Function is available");
    return true;
  } catch (err) {
    console.error("Error checking API availability:", err);
    return false;
  }
};

// Helper function to call the Edge Function with enhanced security
export const callEdgeFunction = async (endpoint: string) => {
  try {
    // Client-side rate limiting
    if (!rateLimit.canMakeRequest()) {
      const timeUntilReset = rateLimit.getTimeUntilReset();
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(timeUntilReset / 1000)} seconds.`);
    }

    // Sanitize the endpoint
    const sanitizedEndpoint = sanitizeInput(endpoint, 200);
    
    // Basic endpoint validation
    if (!sanitizedEndpoint.startsWith('/')) {
      throw new Error('Invalid endpoint format');
    }

    console.log(`Calling Edge Function with endpoint: ${sanitizedEndpoint}`);
    const response = await fetch(`${EDGE_FUNCTION_URL}${sanitizedEndpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        // Security headers
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error('Invalid request parameters.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(`Edge Function returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Basic response validation
    if (data && typeof data === 'object' && data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`Error calling Edge Function with endpoint ${endpoint}:`, error);
    throw error;
  }
};

// Helper function to display error toast with better security
export const handleApiError = (errorMsg: string, fallbackMsg: string) => {
  // Don't log sensitive information in production
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMsg);
  }
  
  // Show user-friendly error messages
  toast.error(fallbackMsg, {
    description: "Unable to load data, please try again later"
  });
};
