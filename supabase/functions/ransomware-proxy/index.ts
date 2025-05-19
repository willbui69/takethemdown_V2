
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { API_BASE_URL, corsHeaders, ALLOWED } from "./config.ts";
import { handleApiResponse } from "./apiHandlers.ts";

// Simple rate limiting implementation
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute in ms
const ipRequests = new Map<string, number[]>();

// Security headers to add to every response
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

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
  const headers = { ...corsHeaders, ...securityHeaders };
  
  // Always handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  
  // Validate request method
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed", message: "Only GET requests are permitted" }), 
      { status: 405, headers }
    );
  }
  
  // Get client IP for rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  // Apply rate limiting
  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: "Too many requests", message: "Rate limit exceeded. Try again later." }), 
      { status: 429, headers }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/ransomware-proxy/, "");  // Remove function prefix from path
  const query = url.search;

  // Validate requested path against allowed patterns
  if (!ALLOWED.some(rx => rx.test(path))) {
    console.error("Blocked unauthorized path:", path, "from IP:", clientIP);
    return new Response(
      JSON.stringify({ error: "Not found", message: "The requested resource does not exist" }), 
      { status: 404, headers }
    );
  }

  const target = `${API_BASE_URL}${path}${query}`;
  console.log("Proxy →", target);

  try {
    const apiRes = await fetch(target, { 
      headers: { 
        "User-Agent": "RansomwareMonitor/1.0",
        "Accept": "application/json"
      } 
    });
    
    return await handleApiResponse(apiRes, path);
  } catch (err) {
    console.error("Proxy error:", err.message);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: "An error occurred processing your request" 
      }), 
      { status: 500, headers }
    );
  }
});
