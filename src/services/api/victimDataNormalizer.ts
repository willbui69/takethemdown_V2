
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
    
    // Check for field mappings based on actual API response structure
    // For country-specific endpoints, the structure may differ
    const victim_name = item.victim_name || item.victim || item.name || item.domain || 
                        (item.title ? item.title.toString() : null) || "Unknown";
    
    // Group name is usually consistent as "group" in the API
    const group_name = item.group_name || item.group || "Unknown Group";
    
    // Look for various date fields and select the first available one
    const publishedDate = item.published || item.discovered || item.attackdate || item.date || null;
    
    // Map country and industry from the available fields
    const country = item.country || item.location || null;
    const industry = item.industry || item.activity || item.sector || item.business_sector || null;
    
    // URL might be in different fields
    const url = item.url || item.victim_url || item.claim_url || item.link || null;

    // Detailed logging for debugging data processing
    console.log("Normalized victim data:", { 
      name: victim_name, 
      group: group_name, 
      published: publishedDate, 
      country, 
      industry,
      originalItem: {
        victim: item.victim,
        victim_name: item.victim_name,
        name: item.name,
        domain: item.domain,
        title: item.title,
        group: item.group,
        discovered: item.discovered,
        country: item.country,
        activity: item.activity,
        industry: item.industry
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
