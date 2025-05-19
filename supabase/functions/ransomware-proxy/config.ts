
// Configuration for the ransomware proxy edge function

export const API_BASE_URL = "https://api.ransomware.live/v2";

// Increase security with a request signing mechanism
// This shared key is used to sign requests, different from the JWT
// It should match the key used by authorized clients
export const API_REQUEST_SECRET = "ransomware-monitor-42735919";

export const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-signature",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

export const ALLOWED = [
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

// Security headers to add to every response
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'"
};

// Get timestamp for validating request freshness
export const getTimestamp = () => Math.floor(Date.now() / 1000);

// Create a signature for request validation
export const generateSignature = (path: string, timestamp: number): string => {
  // This is a simple hash-based signature for demonstration
  // In production, use a proper HMAC implementation
  const message = `${path}:${timestamp}:${API_REQUEST_SECRET}`;
  return hashMessage(message);
};

// Validate incoming request signature
export const validateSignature = (
  signature: string | null, 
  path: string, 
  timestamp: number
): boolean => {
  if (!signature) return false;
  
  // Allow a 5-minute window for timestamp to account for clock drift
  const now = getTimestamp();
  if (Math.abs(now - timestamp) > 300) return false;
  
  const expectedSignature = generateSignature(path, timestamp);
  return signature === expectedSignature;
};

// Simple hash function for signatures
// In production, use crypto.subtle or similar for proper HMAC
function hashMessage(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}
