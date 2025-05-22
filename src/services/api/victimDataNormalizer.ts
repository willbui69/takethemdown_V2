
import { RansomwareVictim } from "@/types/ransomware";

// Function to normalize victim data from different API sources
export const normalizeVictimData = (data: any[]): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }

  return data.map(item => {
    // Check for field mappings based on actual API response structure
    const victim_name = item.victim || item.victim_name || item.name || item.domain || "Unknown";
    
    // Group name is usually consistent as "group" in the API
    const group_name = item.group || item.group_name || "Unknown Group";
    
    // Look for various date fields and select the first available one
    const publishedDate = item.discovered || item.attackdate || item.published || item.date || null;
    
    // Map country and industry from the available fields
    const country = item.country || item.location || null;
    const industry = item.activity || item.industry || item.sector || item.business_sector || null;
    
    // URL might be in different fields
    const url = item.url || item.victim_url || item.claim_url || item.link || null;

    // Detailed logging for debugging data processing
    console.log("Processing victim data:", { 
      name: victim_name, 
      group: group_name, 
      published: publishedDate, 
      country, 
      industry,
      originalItem: {
        victim: item.victim,
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
