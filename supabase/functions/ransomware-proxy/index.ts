
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Ransomware API endpoints
const API_BASE_URL = "https://api.ransomware.live/v2";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let path = "";
    
    // Check if the request has a body and try to extract the path from it
    if (req.method === "POST") {
      try {
        const body = await req.json();
        path = body.path || "";
      } catch (e) {
        console.error("Error parsing request body:", e);
      }
    } else {
      // Get the path from the URL for GET requests
      const url = new URL(req.url);
      path = url.pathname.replace(/^\/ransomware-proxy/, "");
    }
    
    if (!path) {
      return new Response(
        JSON.stringify({ error: "Endpoint path required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`Proxying request to: ${API_BASE_URL}${path}`);
    
    // Forward the request to Ransomware.live API
    const apiResponse = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RansomwareMonitor/1.0",
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({ 
        error: `API returned status ${apiResponse.status}` 
      }));
      
      return new Response(
        JSON.stringify(errorData),
        { status: apiResponse.status, headers: corsHeaders }
      );
    }

    // Get the response data
    const data = await apiResponse.json();
    
    // Return the data
    return new Response(
      JSON.stringify(data),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in ransomware-proxy function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
