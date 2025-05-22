
import { RansomwareVictim } from "@/types/ransomware";

// Function to normalize victim data from different API sources
export const normalizeVictimData = (data: any[]): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }

  return data.map(item => {
    // Log the original item structure to diagnose mapping issues
    console.log("Processing raw victim data item:", item);
    
    // For country-specific endpoints (especially Vietnam), the structure may be different
    // Look for victim information in multiple possible fields
    const victim_name = 
      // Try direct victim name fields first
      item.victim_name || 
      item.victim || 
      item.name || 
      item.domain || 
      item.company_name ||
      // For some endpoints, the title might contain the victim name
      (item.title ? item.title.toString() : null) || 
      // Check if organization field exists (common in some country-specific endpoints)
      item.organization ||
      // If extrainfos contains company info, use that
      (item.extrainfos && item.extrainfos.company ? item.extrainfos.company : null) ||
      // Default to Unknown only if we can't find anything
      "Unknown";
    
    // Group name is usually consistent as "group" in the API
    const group_name = item.group_name || item.group || "Unknown Group";
    
    // Look for various date fields and select the first available one
    const publishedDate = item.published || item.discovered || item.attackdate || item.date || null;
    
    // Map country and industry from the available fields
    const country = item.country || item.location || null;
    const industry = item.industry || item.activity || item.sector || item.business_sector || null;
    
    // URL might be in different fields
    const url = item.url || item.victim_url || item.claim_url || item.link || null;

    // Log normalized victim data with more details for debugging
    console.log("Normalized victim data:", { 
      name: victim_name, 
      group: group_name, 
      published: publishedDate, 
      country, 
      industry,
      url,
      originalItem: {
        victim: item.victim,
        victim_name: item.victim_name,
        name: item.name,
        domain: item.domain,
        title: item.title,
        organization: item.organization,
        group: item.group,
        discovered: item.discovered,
        country: item.country,
        activity: item.activity,
        industry: item.industry,
        extrainfos: item.extrainfos ? JSON.stringify(item.extrainfos).substring(0, 100) + "..." : null
      }
    });

    return {
      victim_name: victim_name,
      group_name: group_name,
      published: publishedDate,
      country: country,
      industry: industry,
      url: url,
    };
  });
};
