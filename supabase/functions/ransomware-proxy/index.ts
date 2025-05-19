
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
    return new Response(JSON.stringify(data), {
      status: apiRes.status,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
