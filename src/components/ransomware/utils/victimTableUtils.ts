
import { RansomwareVictim } from "@/types/ransomware";

// Format a date string to a localized format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Không rõ";
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if not a valid date
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

// Get a color for an industry based on its name
export const getIndustryColor = (industry: string | null): string => {
  if (!industry) return "gray";
  
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes("finance") || industryLower.includes("bank")) return "blue";
  if (industryLower.includes("health") || industryLower.includes("medical")) return "red";
  if (industryLower.includes("education") || industryLower.includes("school")) return "yellow";
  if (industryLower.includes("tech") || industryLower.includes("it")) return "green";
  if (industryLower.includes("government") || industryLower.includes("public")) return "purple";
  if (industryLower.includes("manufacturing")) return "orange";
  
  return "gray";
};

// Process victim data to standardize name extraction
export const processVictimData = (victims: RansomwareVictim[]): RansomwareVictim[] => {
  return victims.map(victim => {
    // Use the victim_name field if it's already populated correctly
    if (victim.victim_name && 
        victim.victim_name !== "Unknown Organization" && 
        typeof victim.victim_name === 'string' && 
        victim.victim_name.trim() !== '') {
      return victim;
    }
    
    // Enhanced victim name extraction with strict validation
    let victimName = "Unknown Organization";
    
    // First check website field (commonly used in Vietnamese victims data)
    if (victim.website && typeof victim.website === 'string' && victim.website.trim() !== '' &&
         victim.website !== 'null' && victim.website !== 'undefined') {
      victimName = victim.website;
    }
    // Then check post_title field (commonly used in Vietnamese victims data)
    else if (victim.post_title && typeof victim.post_title === 'string' && victim.post_title.trim() !== '' &&
             victim.post_title !== 'null' && victim.post_title !== 'undefined') {
      victimName = victim.post_title;
    }
    // Try using the 'victim' field, which seems to contain the actual organization name
    else if (victim.victim && typeof victim.victim === 'string' && victim.victim.trim() !== '' && 
             victim.victim !== 'null' && victim.victim !== 'undefined' && 
             !victim.victim.includes('ransomware.live')) {
      victimName = victim.victim;
    } 
    // Then try domain
    else if (victim.domain && typeof victim.domain === 'string' && victim.domain.trim() !== '' && 
             victim.domain !== 'null' && victim.domain !== 'undefined' &&
             !victim.domain.includes('ransomware.live')) {
      victimName = victim.domain;
    }
    // Fall back to other fields
    else if (victim.victim_name && typeof victim.victim_name === 'string' && victim.victim_name.trim() !== '' && 
             victim.victim_name !== 'null' && victim.victim_name !== 'undefined' &&
             !victim.victim_name.includes('ransomware.live')) {
      victimName = victim.victim_name;
    } 
    else if (victim.company && typeof victim.company === 'string' && victim.company.trim() !== '' && 
             victim.company !== 'null' && victim.company !== 'undefined') {
      victimName = victim.company;
    } 
    else if (victim.title && typeof victim.title === 'string' && victim.title.trim() !== '' && 
             victim.title !== 'null' && victim.title !== 'undefined') {
      victimName = victim.title;
    } 
    else if (victim.name && typeof victim.name === 'string' && victim.name.trim() !== '' && 
             victim.name !== 'null' && victim.name !== 'undefined') {
      victimName = victim.name;
    }
    else if (victim.url && typeof victim.url === 'string' && victim.url.trim() !== '') {
      // Try to extract name from URL only if we have no other options
      try {
        const urlObj = new URL(victim.url);
        const hostname = urlObj.hostname.replace('www.', '');
        // Only use the hostname if it's not ransomware.live
        if (!hostname.includes('ransomware.live')) {
          victimName = hostname;
        }
      } catch (e) {
        // If URL parsing fails, use the URL as is or fallback
        const urlString = victim.url.replace(/^https?:\/\//, '');
        if (!urlString.includes('ransomware.live')) {
          victimName = urlString;
        }
      }
    }
    
    // Enhanced date extraction
    const publishDate = 
      victim.discovered || 
      victim.discovery_date ||
      victim.published || 
      victim.date || 
      victim.leaked ||
      null;
    
    // Extract industry information, check 'activity' field first which seems more reliable
    const industry = victim.activity || victim.industry || victim.sector || null;
    
    // Ensure we return a properly structured object
    return {
      ...victim,
      victim_name: victimName,
      group_name: victim.group_name || victim.group || "Unknown Group",
      published: publishDate,
      country: victim.country || null,
      industry: industry,
      url: victim.url || victim.claim_url || victim.victim_url || null,
    };
  });
};
