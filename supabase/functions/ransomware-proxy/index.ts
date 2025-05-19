
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
    // Check authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error("Missing authorization header in request");
      return new Response(
        JSON.stringify({ code: 401, message: "Missing authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }
    
    let path = "";
    
    // Check if the request has a body and try to extract the path from it
    if (req.method === "POST") {
      try {
        const body = await req.json();
        path = body.path || "";
        console.log("POST request received with path:", path);
      } catch (e) {
        console.error("Error parsing request body:", e);
      }
    } else {
      // Get the path from the URL for GET requests
      const url = new URL(req.url);
      path = url.pathname.replace(/^\/ransomware-proxy/, "");
      console.log("GET request received. Original URL:", req.url);
      console.log("Extracted path after replacement:", path);
    }
    
    if (!path) {
      console.error("No path provided in request");
      return new Response(
        JSON.stringify({ error: "Endpoint path required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const fullApiUrl = `${API_BASE_URL}${path}`;
    console.log(`Proxying request to: ${fullApiUrl}`);
    
    // Forward the request to Ransomware.live API
    const apiResponse = await fetch(fullApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RansomwareMonitor/1.0",
        "Accept": "application/json",
      },
    });

    console.log(`API response status: ${apiResponse.status}`);

    if (!apiResponse.ok) {
      let errorData;
      try {
        errorData = await apiResponse.json();
        console.error("API error response data:", JSON.stringify(errorData));
      } catch (e) {
        errorData = { error: `API returned status ${apiResponse.status}` };
        console.error(`Failed to parse error response: ${e.message}`);
      }
      
      return new Response(
        JSON.stringify(errorData),
        { status: apiResponse.status, headers: corsHeaders }
      );
    }

    // Check content type to diagnose potential issues
    const contentType = apiResponse.headers.get("content-type");
    console.log(`API response content type: ${contentType}`);
    
    // Get the response text first to diagnose potential issues
    const responseText = await apiResponse.text();
    const firstChars = responseText.substring(0, 100).replace(/\n/g, '\\n');
    console.log(`Response text starts with: ${firstChars}...`);
    
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.error("API returned HTML content instead of JSON");
      return new Response(
        JSON.stringify({ 
          error: "API returned HTML content instead of JSON", 
          note: "The API may be blocking requests or returning an error page" 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Try to parse the response as JSON
    try {
      const data = JSON.parse(responseText);
      console.log(`Data parsed successfully. First few items:`, 
        Array.isArray(data) ? data.slice(0, 2) : "Non-array data returned");
      
      // Return the data
      return new Response(
        JSON.stringify(data),
        { headers: corsHeaders }
      );
    } catch (e) {
      console.error("Error parsing API response:", e);
      console.error("Response was not valid JSON. First 200 characters:", responseText.substring(0, 200));
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse API response",
          details: e.message,
          firstChars: firstChars 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error("Error in ransomware-proxy function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
      );
    }
});
