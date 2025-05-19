import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_BASE_URL = "https://api.ransomware.live/v2";
const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type":                "application/json",
};

const ALLOWED = [
  /^\/info$/,
  /^\/recentvictims$/,
  /^\/groups$/,
  /^\/group\/[^/]+$/,
  /^\/allcyberattacks$/,
  /^\/recentcyberattacks$/,
  /^\/groupvictims\/[^/]+$/,
  /^\/searchvictims\/[^/]+$/,
  /^\/countrycyberattacks\/[A-Za-z]{2}$/,
  /^\/countryvictims\/[A-Za-z]{2}$/,
  /^\/victims\/\d{4}\/\d{2}$/,
  /^\/sectorvictims\/[^/]+$/,
  /^\/sectorvictims\/[^/]+\/[A-Za-z]{2}$/,
  /^\/certs\/[A-Za-z]{2}$/,
  /^\/yara\/[^/]+$/
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Only GET allowed" }), { status: 405, headers: corsHeaders });
  }

  const url   = new URL(req.url);
  const path  = url.pathname.replace(/^\/ransomware-proxy/, "");  // Remove function prefix from path
  const query = url.search;

  if (!ALLOWED.some(rx => rx.test(path))) {
    console.error("Blocked path:", path);
    return new Response(JSON.stringify({ error: "Endpoint not allowed" }), { status: 404, headers: corsHeaders });
  }

  const target = `${API_BASE_URL}${path}${query}`;
  console.log("Proxy →", target);

  try {
    const apiRes = await fetch(target, { headers: { "User-Agent": "RansomwareMonitor/1.0" } });
    const contentType = apiRes.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      console.error("Non-JSON response:", contentType);
      return new Response(JSON.stringify({ error: "Upstream returned non-JSON" }), { status: 502, headers: corsHeaders });
    }

    const data = await apiRes.json();
    
    // Process and enhance the data before returning it
    let processedData = data;
    
    if (path === '/recentvictims' || path.startsWith('/groupvictims/') || path.includes('victim')) {
      // Process the data to ensure proper formatting and 24-hour filtering
      processedData = Array.isArray(data) ? data.map(item => {
        // Extract victim name properly from the correct fields
        let victimName = null;
        
        // First check the "victim" field which seems to have the actual organization name
        if (item.victim && typeof item.victim === 'string' && item.victim !== 'null' && item.victim !== 'undefined') {
          victimName = item.victim;
        } 
        // Fall back to domain if no victim name
        else if (item.domain && typeof item.domain === 'string' && item.domain !== 'null' && item.domain !== 'undefined') {
          victimName = item.domain;
        }
        // Additional fallback options if needed
        else if (item.company && typeof item.company === 'string' && item.company !== 'null' && item.company !== 'undefined') {
          victimName = item.company;
        }
        else if (item.title && typeof item.title === 'string' && item.title !== 'null' && item.title !== 'undefined') {
          victimName = item.title;
        }
        else if (item.victim_name && typeof item.victim_name === 'string' && item.victim_name !== 'null' && item.victim_name !== 'undefined') {
          victimName = item.victim_name;
        }
        else if (item.name && typeof item.name === 'string' && item.name !== 'null' && item.name !== 'undefined') {
          victimName = item.name;
        }
        else {
          victimName = "Unknown Organization";
        }
        
        // Extract industry information, check 'activity' field first
        const industry = item.activity || item.industry || item.sector || null;
        
        // Extract publish date from multiple possible fields
        const published = 
          item.discovered || 
          item.discovery_date ||
          item.published || 
          item.date || 
          item.leaked || 
          null;
        
        // Build a consistent object structure
        return {
          victim_name: victimName,
          group_name: item.group_name || item.group || "Unknown Group",
          published: published,
          country: item.country || null,
          industry: industry,
          url: item.url || item.claim_url || item.victim_url || null,
          // Keep all original properties for debugging and future use
          ...item
        };
      }) : data;
      
      // Debug the first two items to verify correct extraction
      if (Array.isArray(processedData) && processedData.length > 0) {
        console.log("Processed victim data:", JSON.stringify(processedData.slice(0, 2)));
      }
    }
    
    return new Response(JSON.stringify(processedData), {
      status: apiRes.status,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
