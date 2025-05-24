
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_BASE_URL = "https://api.ransomware.live/v2";

// Enhanced CORS and Security Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  // Security headers
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'; script-src 'none';",
};

// Rate limiting storage (in-memory for this example)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Enhanced allowed endpoints with stricter validation
const ALLOWED_ENDPOINTS = [
  /^\/info$/,
  /^\/recentvictims$/,
  /^\/groups$/,
  /^\/group\/[a-zA-Z0-9_-]{1,50}$/,
  /^\/allcyberattacks$/,
  /^\/recentcyberattacks$/,
  /^\/groupvictims\/[a-zA-Z0-9_-]{1,50}$/,
  /^\/searchvictims\/[a-zA-Z0-9._-]{1,100}$/,
  /^\/countrycyberattacks\/[A-Z]{2}$/,
  /^\/countryvictims\/[A-Z]{2}$/,
  /^\/victims\/\d{4}\/\d{2}$/,
  /^\/sectorvictims\/[a-zA-Z0-9\s_-]{1,50}$/,
  /^\/sectorvictims\/[a-zA-Z0-9\s_-]{1,50}\/[A-Z]{2}$/,
  /^\/certs\/[A-Z]{2}$/,
  /^\/yara\/[a-zA-Z0-9_-]{1,50}$/
];

// Input validation functions
const validateCountryCode = (code: string): boolean => {
  return /^[A-Z]{2}$/.test(code);
};

const validateGroupName = (group: string): boolean => {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(group);
};

const validateSearchTerm = (term: string): boolean => {
  // Allow alphanumeric, dots, hyphens, underscores
  return /^[a-zA-Z0-9._-]{1,100}$/.test(term);
};

const validateYearMonth = (year: string, month: string): boolean => {
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  return yearNum >= 2020 && yearNum <= new Date().getFullYear() + 1 && 
         monthNum >= 1 && monthNum <= 12;
};

// Rate limiting function
const checkRateLimit = (clientIP: string): boolean => {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);
  
  if (!clientData) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return false;
  }
  
  clientData.count++;
  return true;
};

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Clean up every minute

serve(async (req) => {
  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow GET requests
  if (req.method !== "GET") {
    console.error("Non-GET request attempted:", req.method);
    return new Response(
      JSON.stringify({ error: "Only GET requests are allowed" }), 
      { status: 405, headers: corsHeaders }
    );
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get("x-forwarded-for") || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.error("Rate limit exceeded for IP:", clientIP);
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
      { status: 429, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/ransomware-proxy/, "");
  const query = url.search;

  // Enhanced path validation
  if (!ALLOWED_ENDPOINTS.some(pattern => pattern.test(path))) {
    console.error("Blocked path:", path);
    return new Response(
      JSON.stringify({ error: "Endpoint not allowed" }), 
      { status: 404, headers: corsHeaders }
    );
  }

  // Additional input validation based on endpoint type
  const pathParts = path.split('/').filter(Boolean);
  
  if (pathParts.length >= 2) {
    // Validate country codes
    if ((pathParts[0] === 'countrycyberattacks' || pathParts[0] === 'countryvictims' || pathParts[0] === 'certs') && 
        pathParts[1] && !validateCountryCode(pathParts[1])) {
      console.error("Invalid country code:", pathParts[1]);
      return new Response(
        JSON.stringify({ error: "Invalid country code format" }), 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate group names
    if ((pathParts[0] === 'group' || pathParts[0] === 'groupvictims' || pathParts[0] === 'yara') && 
        pathParts[1] && !validateGroupName(pathParts[1])) {
      console.error("Invalid group name:", pathParts[1]);
      return new Response(
        JSON.stringify({ error: "Invalid group name format" }), 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate search terms
    if (pathParts[0] === 'searchvictims' && pathParts[1] && !validateSearchTerm(pathParts[1])) {
      console.error("Invalid search term:", pathParts[1]);
      return new Response(
        JSON.stringify({ error: "Invalid search term format" }), 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate year/month for victims endpoint
    if (pathParts[0] === 'victims' && pathParts.length === 3) {
      if (!validateYearMonth(pathParts[1], pathParts[2])) {
        console.error("Invalid year/month:", pathParts[1], pathParts[2]);
        return new Response(
          JSON.stringify({ error: "Invalid year/month format" }), 
          { status: 400, headers: corsHeaders }
        );
      }
    }
    
    // Validate sector names with optional country code
    if (pathParts[0] === 'sectorvictims') {
      if (pathParts[1] && !/^[a-zA-Z0-9\s_-]{1,50}$/.test(pathParts[1])) {
        console.error("Invalid sector name:", pathParts[1]);
        return new Response(
          JSON.stringify({ error: "Invalid sector name format" }), 
          { status: 400, headers: corsHeaders }
        );
      }
      if (pathParts[2] && !validateCountryCode(pathParts[2])) {
        console.error("Invalid country code in sector endpoint:", pathParts[2]);
        return new Response(
          JSON.stringify({ error: "Invalid country code format" }), 
          { status: 400, headers: corsHeaders }
        );
      }
    }
  }

  const target = `${API_BASE_URL}${path}${query}`;
  console.log("Proxy →", target, "from IP:", clientIP);

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const apiRes = await fetch(target, { 
      headers: { "User-Agent": "RansomwareMonitor/1.0" },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const contentType = apiRes.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      console.error("Non-JSON response:", contentType);
      return new Response(
        JSON.stringify({ error: "Upstream returned non-JSON response" }), 
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await apiRes.json();
    
    // Enhanced logging with sanitized data
    console.log(`Response from ${path} endpoint:`, { 
      status: apiRes.status, 
      dataType: typeof data, 
      isArray: Array.isArray(data),
      sampleSize: Array.isArray(data) ? data.length : "N/A",
      clientIP: clientIP.substring(0, 10) + "..." // Partially hide IP for privacy
    });
    
    // Log special cases for debugging
    if (path === "/countryvictims/VN" && Array.isArray(data)) {
      console.log(`Vietnam data received: ${data.length} items`);
      if (data.length > 0) {
        console.log("Vietnam data structure:", Object.keys(data[0]).join(", "));
        console.log("Sample Vietnam victim:", data[0]);
      }
    }
    
    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample data item:", data[0]);
      
      // Enhanced logging for victim data endpoints
      if ((path === "/recentvictims" || path.startsWith("/groupvictims/") || path.startsWith("/countryvictims/")) && Array.isArray(data) && data.length > 0) {
        const sample = data[0];
        console.log("Fields in victim data:", Object.keys(sample));
        console.log("Victim data sample values:", {
          victim: sample.victim,
          victim_name: sample.victim_name,
          website: sample.website,
          post_title: sample.post_title,
          group: sample.group,
          group_name: sample.group_name,
          attackdate: sample.attackdate,
          discovered: sample.discovered, 
          published: sample.published,
          country: sample.country,
          industry: sample.industry,
          activity: sample.activity,
          organization: sample.organization,
          title: sample.title
        });
      }
    }

    return new Response(JSON.stringify(data), {
      status: apiRes.status,
      headers: corsHeaders
    });
  } catch (err) {
    // Enhanced error handling
    if (err.name === 'AbortError') {
      console.error("Request timeout for:", target);
      return new Response(
        JSON.stringify({ error: "Request timeout" }), 
        { status: 504, headers: corsHeaders }
      );
    }
    
    console.error("Proxy error:", err.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: corsHeaders }
    );
  }
});
