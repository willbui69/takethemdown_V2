
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
      // Make sure each entry has at least a minimum set of properties
      processedData = Array.isArray(data) ? data.map(item => {
        // Extract victim name from multiple possible fields
        const victimName = 
          item.victim_name || 
          item.name || 
          item.title || 
          item.company ||
          (typeof item.url === 'string' && item.url.replace(/^https?:\/\//, '').split('/')[0]) ||
          "Unknown Organization";
        
        // Extract publish date from multiple possible fields
        const published = 
          item.published || 
          item.date || 
          item.discovery_date || 
          item.leaked || 
          item.discovered || 
          null;
        
        return {
          victim_name: victimName,
          group_name: item.group_name || item.group || "Unknown Group",
          published: published,
          country: item.country || null,
          industry: item.industry || item.sector || null,
          url: item.url || item.victim_url || null,
          ...item // Keep all original properties
        };
      }) : data;
      
      // Additional logging to help debug
      console.log("Processed victim data:", JSON.stringify(processedData.slice(0, 2)));
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
