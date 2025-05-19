
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  API_BASE_URL, 
  corsHeaders, 
  ALLOWED, 
  securityHeaders, 
  validateSignature, 
  getTimestamp 
} from "./config.ts";
import { handleApiResponse } from "./apiHandlers.ts";

// Origin validation - only allow specific origins (update these to your domains)
const ALLOWED_ORIGINS = [
  "https://euswzjdcxrnuupcyiddb.supabase.co",
  "https://ransomware-monitor.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:54321",
  "https://lovableproject.com",
  "https://*.lovableproject.com",
  "*" // Allow all origins (for temporary debugging)
];

// Check if origin is allowed with wildcard support
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // For debugging: allow all origins temporarily
  if (ALLOWED_ORIGINS.includes("*")) return true;
  
  // First check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  
  // Then check for wildcard matches
  return ALLOWED_ORIGINS.some(allowedOrigin => {
    if (allowedOrigin.includes('*')) {
      const pattern = allowedOrigin.replace(/\./g, '\\.').replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return false;
  });
}

// Simple rate limiting implementation
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60000; // 1 minute in ms
const ipRequests = new Map<string, number[]>();

// Helper function to check rate limits
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // Get or initialize request timestamps for this IP
  let requests = ipRequests.get(ip) || [];
  
  // Filter out old requests outside current window
  requests = requests.filter(time => now - time < RATE_WINDOW);
  
  // Check if we've hit the limit
  if (requests.length >= RATE_LIMIT) {
    return false;
  }
  
  // Add current request timestamp
  requests.push(now);
  ipRequests.set(ip, requests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to run cleanup
    for (const [ip, timestamps] of ipRequests.entries()) {
      const validTimestamps = timestamps.filter(time => now - time < RATE_WINDOW);
      if (validTimestamps.length === 0) {
        ipRequests.delete(ip);
      } else {
        ipRequests.set(ip, validTimestamps);
      }
    }
  }
  
  return true;
}

serve(async (req) => {
  // Customize CORS headers for the specific request
  const reqOrigin = req.headers.get("Origin");
  const headers = { 
    ...corsHeaders,
    ...securityHeaders
  };

  // Set specific origin if provided and allowed
  if (reqOrigin && isOriginAllowed(reqOrigin)) {
    headers["Access-Control-Allow-Origin"] = reqOrigin;
  }
  
  try {
    console.log(`Request received: ${req.method} ${new URL(req.url).pathname}`);
    
    // Always handle CORS preflight
    if (req.method === "OPTIONS") {
      console.log("Handling CORS preflight request");
      return new Response(null, { headers });
    }
    
    // Validate request origin
    const origin = req.headers.get("Origin");
    let isLovablePreview = false;
    
    // If origin is provided, validate it
    if (origin) {
      isLovablePreview = origin.includes("lovableproject.com");
      
      if (!isLovablePreview && !isOriginAllowed(origin)) {
        console.warn("Blocked request from unauthorized origin:", origin);
        return new Response(
          JSON.stringify({ error: "Unauthorized", message: "Origin not allowed" }), 
          { status: 403, headers }
        );
      }
      
      // Origin already set in headers above
    }
    
    // Validate request method
    if (req.method !== "GET") {
      console.warn(`Method not allowed: ${req.method}`);
      return new Response(
        JSON.stringify({ error: "Method not allowed", message: "Only GET requests are permitted" }), 
        { status: 405, headers }
      );
    }
    
    // Get URL parts
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/ransomware-proxy/, "");  // Remove function prefix from path
    const query = url.search;

    console.log(`Processing request for path: ${path}`);
    
    // Validate request signature (except for preview environments)
    if (!isLovablePreview) {
      const requestTimestamp = Number(req.headers.get("x-request-timestamp") || "0");
      const signature = req.headers.get("x-request-signature");

      console.log(`Validating signature: ${signature}, timestamp: ${requestTimestamp}, path: ${path}`);

      if (!validateSignature(signature, path, requestTimestamp)) {
        console.warn(`Invalid signature for request to: ${path}`);
        return new Response(
          JSON.stringify({ 
            error: "Unauthorized", 
            message: "Invalid request signature",
            details: "Signature validation failed. Check client implementation."
          }), 
          { status: 401, headers }
        );
      }
      
      console.log("Signature validation passed");
    } else {
      console.log("Skipping signature validation for Lovable preview");
    }
    
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // Apply rate limiting
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests", message: "Rate limit exceeded. Try again later." }), 
        { status: 429, headers }
      );
    }

    // Validate requested path against allowed patterns
    if (!ALLOWED.some(rx => rx.test(path))) {
      console.error(`Blocked unauthorized path: ${path}, from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Not found", message: "The requested resource does not exist" }), 
        { status: 404, headers }
      );
    }

    const target = `${API_BASE_URL}${path}${query}`;
    console.log(`Proxy → ${target}`);

    try {
      const apiRes = await fetch(target, { 
        headers: { 
          "User-Agent": "RansomwareMonitor/1.0",
          "Accept": "application/json",
          "X-Client-Source": "ransomware-monitor-app" // Add a source identifier
        },
        signal: AbortSignal.timeout(25000) // 25 second timeout (increased from 15)
      });
      
      return await handleApiResponse(apiRes, path);
    } catch (err) {
      console.error(`Proxy error for ${path}:`, err.message);
      return new Response(
        JSON.stringify({ 
          error: "Internal server error", 
          message: "An error occurred processing your request",
          details: err.message
        }), 
        { status: 500, headers }
      );
    }
  } catch (err) {
    // Catch any unexpected errors in the request handling
    console.error("Unexpected error in edge function:", err);
    return new Response(
      JSON.stringify({ 
        error: "Server error", 
        message: "An unexpected error occurred",
        details: err.message 
      }), 
      { status: 500, headers }
    );
  }
});
