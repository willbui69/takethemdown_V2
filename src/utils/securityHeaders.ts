
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://euswzjdcxrnuupcyiddb.supabase.co https://submit.jotform.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://euswzjdcxrnuupcyiddb.supabase.co https://api.ransomware.live https://submit.jotform.com; frame-src 'self' https://submit.jotform.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://submit.jotform.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN', // Changed from DENY to SAMEORIGIN to allow iframes
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};
