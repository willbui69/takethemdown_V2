
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://euswzjdcxrnuupcyiddb.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://euswzjdcxrnuupcyiddb.supabase.co https://api.ransomware.live; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};
