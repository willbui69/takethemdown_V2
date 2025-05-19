
// Configuration and utility functions for the ransomware API

// Flag to track if we're falling back to mock data
export let useMockData = false;

// Base URL for the Edge Function - ensure it uses HTTPS for security
export const EDGE_FUNCTION_URL = "https://euswzjdcxrnuupcyiddb.supabase.co/functions/v1/ransomware-proxy";

// URL for local development testing - utilize to test in development mode
export const LOCAL_EDGE_FUNCTION_URL = "http://localhost:54321/functions/v1/ransomware-proxy";

// Supabase anon key - this is public and safe to include in client-side code
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3d6amRjeHJudXVwY3lpZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTE2MTIsImV4cCI6MjA2MzIyNzYxMn0.Yiy4i60R-1-K3HSwWAQSmPZ3FTLrq0Wd78s0yYRA8NE";

// Request signing configuration - same secret as in the Edge Function
// In a real-world scenario, this would be stored server-side only, but we're
// demonstrating the concept here. This is better than no signature at all.
const API_REQUEST_SECRET = "ransomware-monitor-42735919";

// Failover mechanism to handle API availability
let consecutiveFailures = 0;
const MAX_FAILURES = 5; // Increased from 3 to 5
const API_RETRY_TIMEOUT = 120000; // 2 minutes (increased from 60 seconds)
let lastFailureTime = 0;

// Simple signature generation for API requests
// Uses the same algorithm as the Edge Function
function generateSignature(path: string, timestamp: number): string {
  const message = `${path}:${timestamp}:${API_REQUEST_SECRET}`;
  return hashMessage(message);
}

// Simple hash function - matched to the one in the Edge Function
function hashMessage(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Get the appropriate Edge Function URL based on environment
function getEdgeFunctionUrl() {
  // Check for development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  // For lovable preview environments always use production URL
  const isLovablePreview = window.location.hostname.includes("lovableproject.com");
  
  if (isDevelopment && !isLovablePreview) {
    console.log("Using local Edge Function URL");
    return LOCAL_EDGE_FUNCTION_URL;
  }

  return EDGE_FUNCTION_URL;
}

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
    
    // Check network connectivity first - expanded check
    if (!navigator.onLine) {
      useMockData = true;
      throw new Error("Không có kết nối Internet. Vui lòng kiểm tra mạng của bạn.");
    }
    
    // Set a longer timeout for the request (45 seconds instead of 30)
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`Request timeout for endpoint: ${endpoint}`);
      abortController.abort();
    }, 45000);
    
    // Generate request signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(endpoint, timestamp);
    
    console.log(`Generated signature: ${signature} for timestamp: ${timestamp}`);
    
    // Determine the correct URL for the Edge Function
    const edgeFunctionUrl = getEdgeFunctionUrl();
    console.log(`Using Edge Function URL: ${edgeFunctionUrl}`);
    
    // Add random cache-busting param
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const urlWithCacheBuster = `${edgeFunctionUrl}${endpoint}${separator}${cacheBuster}`;
    
    try {
      const response = await fetch(urlWithCacheBuster, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-Request-Timestamp': timestamp.toString(),
          'X-Request-Signature': signature,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Origin': window.location.origin
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

      // Handle unauthorized access
      if (response.status === 401 || response.status === 403) {
        console.error("Authorization error with Edge Function:", await response.text());
        useMockData = true;
        throw new Error("API access unauthorized. Using mock data instead.");
      }
  
      if (!response.ok) {
        // Track consecutive failures for backoff
        consecutiveFailures++;
        lastFailureTime = Date.now();
        
        const errorText = await response.text();
        console.error(`Edge Function returned status ${response.status}: ${errorText}`);
        throw new Error(`API request failed with status: ${response.status}`);
      }

      // Reset failures counter on success
      consecutiveFailures = 0;
      useMockData = false;
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Re-throw the original error
      throw error;
    }
  } catch (error: any) {
    // Handle specific error types
    if (error.name === 'AbortError') {
      console.error(`Edge Function request timeout for endpoint ${endpoint}`);
      throw new Error("Request timed out. API không phản hồi trong thời gian chờ.");
    }
    
    console.error(`Error calling Edge Function with endpoint ${endpoint}:`, error);
    
    // Track consecutive failures for backoff
    consecutiveFailures++;
    lastFailureTime = Date.now();
    
    throw error;
  }
};

// Function to check API availability with more detailed diagnostics
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking API availability via Edge Function");
    
    // Check network connectivity first
    if (!navigator.onLine) {
      console.error("Network offline");
      throw new Error("Không có kết nối Internet. Vui lòng kiểm tra mạng của bạn.");
    }
    
    // Generate signature for availability check
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature("/groups", timestamp);
    
    console.log(`API check signature: ${signature} for timestamp: ${timestamp}`);
    
    // Determine the correct URL for the Edge Function
    const edgeFunctionUrl = getEdgeFunctionUrl();
    console.log(`Checking API availability at: ${edgeFunctionUrl}`);
    
    // Add cache buster to prevent caching
    const cacheBuster = `_cb=${Date.now()}`;
    
    // Call the edge function with the /groups endpoint path
    const response = await fetch(`${edgeFunctionUrl}/groups?${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Request-Timestamp': timestamp.toString(),
        'X-Request-Signature': signature,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Origin': window.location.origin
      },
      // Set a longer timeout for the availability check (15 seconds instead of 10)
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function returned status", response.status, errorText);
      useMockData = true;
      return false;
    }

    console.log("Edge Function is available");
    useMockData = false;
    consecutiveFailures = 0;
    return true;
  } catch (err: any) {
    console.error("Error checking API availability:", err);
    useMockData = true;
    return false;
  }
};

// Set mock data state
export const setUseMockData = (value: boolean) => {
  useMockData = value;
};
