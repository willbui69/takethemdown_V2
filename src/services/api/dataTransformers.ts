
import { RansomwareVictim } from "@/types/ransomware";

// Transform and normalize ransomware victim data
export const normalizeVictimData = (data: any[]): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }
  
  return data.map(item => {
    // Enhanced victim name extraction with strict validation
    let victimName = "Unknown Organization";
    
    // First try using the 'victim' field, which seems to contain the actual organization name
    if (item.victim && typeof item.victim === 'string' && item.victim.trim() !== '' && 
        item.victim !== 'null' && item.victim !== 'undefined' && 
        !item.victim.includes('ransomware.live')) {
      victimName = item.victim;
    } 
    // Then try domain
    else if (item.domain && typeof item.domain === 'string' && item.domain.trim() !== '' && 
             item.domain !== 'null' && item.domain !== 'undefined' &&
             !item.domain.includes('ransomware.live')) {
      victimName = item.domain;
    }
    // Try website field (commonly used in Vietnamese victims data)
    else if (item.website && typeof item.website === 'string' && item.website.trim() !== '' &&
             item.website !== 'null' && item.website !== 'undefined') {
      victimName = item.website;
    }
    // Try post_title field (commonly used in Vietnamese victims data)
    else if (item.post_title && typeof item.post_title === 'string' && item.post_title.trim() !== '' &&
             item.post_title !== 'null' && item.post_title !== 'undefined') {
      victimName = item.post_title;
    }
    // Fall back to other fields
    else if (item.victim_name && typeof item.victim_name === 'string' && item.victim_name.trim() !== '' && 
             item.victim_name !== 'null' && item.victim_name !== 'undefined' &&
             !item.victim_name.includes('ransomware.live')) {
      victimName = item.victim_name;
    } 
    else if (item.company && typeof item.company === 'string' && item.company.trim() !== '' && 
             item.company !== 'null' && item.company !== 'undefined') {
      victimName = item.company;
    } 
    else if (item.title && typeof item.title === 'string' && item.title.trim() !== '' && 
             item.title !== 'null' && item.title !== 'undefined') {
      victimName = item.title;
    } 
    else if (item.name && typeof item.name === 'string' && item.name.trim() !== '' && 
             item.name !== 'null' && item.name !== 'undefined') {
      victimName = item.name;
    }
    else if (item.url && typeof item.url === 'string' && item.url.trim() !== '') {
      // Try to extract name from URL only if we have no other options
      try {
        const urlObj = new URL(item.url);
        const hostname = urlObj.hostname.replace('www.', '');
        // Only use the hostname if it's not ransomware.live
        if (!hostname.includes('ransomware.live')) {
          victimName = hostname;
        }
      } catch (e) {
        // If URL parsing fails, use the URL as is or fallback
        const urlString = item.url.replace(/^https?:\/\//, '');
        if (!urlString.includes('ransomware.live')) {
          victimName = urlString;
        }
      }
    }
    
    // Log the data extraction process for the first few items to help with debugging
    if (data.indexOf(item) < 2) {
      console.log("Raw item data:", item);
      console.log("Extracted victim name:", victimName);
      console.log("Source field for name:", 
        item.victim ? "victim field" : 
        item.domain ? "domain field" :
        item.website ? "website field" :
        item.post_title ? "post_title field" : 
        item.victim_name ? "victim_name field" :
        item.company ? "company field" :
        item.title ? "title field" :
        item.name ? "name field" :
        item.url ? "url field" : "fallback value");
    }
    
    // Enhanced date extraction - prioritizing discovered/discovery_date fields
    const publishDate = 
      item.discovered || 
      item.discovery_date ||
      item.published || 
      item.date || 
      item.leaked ||
      null;
    
    // Extract industry information, check 'activity' field first which seems more reliable
    const industry = item.activity || item.industry || item.sector || null;
    
    // For the group name, extract from multiple possible fields
    const groupName = item.group_name || item.group || "Unknown Group";
    
    return {
      victim_name: victimName,
      group_name: groupName,
      published: publishDate,
      country: item.country || null,
      industry: industry,
      url: item.url || item.claim_url || item.victim_url || null,
      ...item // Keep all original properties
    };
  });
};
