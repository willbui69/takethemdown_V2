
// Configuration and utility functions for the ransomware API

// Flag to track if we're falling back to mock data
export let useMockData = false;

// Base URL for the Edge Function
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// Supabase anon key - this is public and safe to include in client-side code
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

// Failover mechanism to handle API availability
let consecutiveFailures = 0;
const MAX_FAILURES = 3;
const API_RETRY_TIMEOUT = 60000; // 1 minute
let lastFailureTime = 0;

// Helper function to call the Edge Function with retry mechanism and timeout
export const callEdgeFunction = async (endpoint: string) => {
  // Check if we're in a backoff period after multiple failures
  const now = Date.now();
  if (consecutiveFailures >= MAX_FAILURES && (now - lastFailureTime < API_RETRY_TIMEOUT)) {
    console.warn(`API in backoff mode. Waiting until ${new Date(lastFailureTime + API_RETRY_TIMEOUT).toLocaleTimeString()}`);
    useMockData = true;
    throw new Error("API temporarily unavailable due to multiple failures");
  }
  
  try {
    console.log(`Calling Edge Function with endpoint: ${endpoint}`);
    
    // Set a timeout for the request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${EDGE_FUNCTION_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      signal: abortController.signal
    });
    
    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 429) {
      console.warn("Rate limit hit on API. Using mock data temporarily.");
      useMockData = true;
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (!response.ok) {
      // Track consecutive failures for backoff
      consecutiveFailures++;
      lastFailureTime = Date.now();
      
      console.error(`Edge Function returned status ${response.status}`);
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Reset failures counter on success
    consecutiveFailures = 0;
    useMockData = false;
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Edge Function request timeout for endpoint ${endpoint}`);
      throw new Error("Request timeout. Please try again later.");
    }
    
    console.error(`Error calling Edge Function with endpoint ${endpoint}:`, error);
    
    // Track consecutive failures for backoff
    consecutiveFailures++;
    lastFailureTime = Date.now();
    
    throw error;
  }
};

// Function to check API availability
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking API availability via Edge Function");
    // Call the edge function with the /groups endpoint path
    const response = await fetch(`${EDGE_FUNCTION_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      // Set a short timeout for the availability check
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.error("Edge Function returned status", response.status);
      useMockData = true;
      return false;
    }

    console.log("Edge Function is available");
    useMockData = false;
    consecutiveFailures = 0;
    return true;
  } catch (err) {
    console.error("Error checking API availability:", err);
    useMockData = true;
    return false;
  }
};

// Set mock data state
export const setUseMockData = (value: boolean) => {
  useMockData = value;
};
