
/**
 * Security utilities for input validation and sanitization
 */

export const sanitizeInput = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>'"]/g, '') // Remove HTML/script injection characters
    .replace(/[{}]/g, '') // Remove object notation characters
    .replace(/[\x00-\x1f\x7f]/g, '') // Remove control characters
    .trim()
    .slice(0, maxLength);
};

export const validateSearchQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') {
    return true; // Empty queries are allowed
  }
  
  // Allow alphanumeric characters, spaces, dots, hyphens, underscores
  const validPattern = /^[a-zA-Z0-9\s._-]*$/;
  return validPattern.test(query) && query.length <= 100;
};

export const validateCountryCode = (code: string): boolean => {
  return /^[A-Z]{2}$/.test(code);
};

export const validateGroupName = (name: string): boolean => {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(name);
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

// Rate limiting helper for client-side
export class ClientRateLimit {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) {
      return 0;
    }
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest));
  }
}
