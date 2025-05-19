
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_BASE_URL = "https://api.ransomware.live/v2";
const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type":                "application/json",
};

// Only allow these endpoints:
const ALLOWED = [
  /^\/info$/,
  /^\/groups$/,
  /^\/group\/[^/]+$/,
  /^\/recentvictims$/,
  /^\/victims$/,
  /^\/victims\/[^/]+$/,
  /^\/today$/,
  /^\/stats$/
];

serve(async (req) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 2) Only GET for now
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Only GET is supported" }),
      { status: 405, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/ransomware-proxy/, "");      // e.g. "/groups"
  const query = url.search;       // e.g. "?limit=10"

  // 3) Reject anything not in our whitelist
  if (!ALLOWED.some((rx) => rx.test(path))) {
    console.error(`Rejected non-whitelisted path: ${path}`);
    return new Response(
      JSON.stringify({ error: "Endpoint not allowed" }),
      { status: 404, headers: corsHeaders }
    );
  }

  const targetUrl = `${API_BASE_URL}${path}${query}`;
  console.log(`Proxying → ${targetUrl}`);

  try {
    const apiRes = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RansomwareMonitor/1.0",
        "Accept": "application/json"
      },
    });

    const body = await apiRes.text(); // in case it's not JSON
    
    // Check if we received HTML instead of JSON and log for debugging
    if (body.trim().startsWith('<!DOCTYPE') || body.trim().startsWith('<html')) {
      console.error("API returned HTML content instead of JSON");
      return new Response(
        JSON.stringify({ 
          error: "API returned HTML content instead of JSON", 
          note: "The API may be blocking requests or returning an error page" 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Log response details for debugging
    console.log(`Response status: ${apiRes.status}, content-type: ${apiRes.headers.get('content-type')}`);
    
    return new Response(body, {
      status: apiRes.status,
      headers: corsHeaders
    });

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
