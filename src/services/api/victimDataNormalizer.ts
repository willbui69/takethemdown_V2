
import { RansomwareVictim } from "@/types/ransomware";

// Function to normalize victim data from different API sources
export const normalizeVictimData = (data: any[], source?: string): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }

  return data.map(item => {
    // Handle source-specific data formats
    if (source === 'countryvictims') {
      console.log("Processing country-specific victim data item:", item);
      
      // Country-specific endpoints may have a different structure
      const victim_name = 
        item.victim || 
        item.title ||
        item.organization || 
        item.name || 
        (item.extrainfos && typeof item.extrainfos === 'object' && item.extrainfos.company) || 
        "Unknown";
      
      // For country-specific data, group may be in different fields
      const group_name = item.group_name || item.group || "Unknown Group";
      
      // Date fields may be in different formats for country data
      const publishedDate = item.published || item.discovered || item.attackdate || item.date || null;
      
      return {
        victim_name: victim_name,
        group_name: group_name,
        published: publishedDate,
        country: item.country || item.location || null,
        industry: item.industry || item.activity || item.sector || null,
        url: item.url || item.claim_url || item.victim_url || null,
      };
    }
    
    // Standard victim data processing for general endpoints
    const victim_name = 
      item.victim_name || 
      item.victim || 
      item.name || 
      item.domain || 
      item.company_name ||
      (item.title ? item.title.toString() : null) || 
      item.organization ||
      (item.extrainfos && item.extrainfos.company ? item.extrainfos.company : null) ||
      "Unknown";
    
    const group_name = item.group_name || item.group || "Unknown Group";
    const publishedDate = item.published || item.discovered || item.attackdate || item.date || null;
    
    return {
      victim_name: victim_name,
      group_name: group_name,
      published: publishedDate,
      country: item.country || item.location || null,
      industry: item.industry || item.activity || item.sector || item.business_sector || null,
      url: item.url || item.victim_url || item.claim_url || item.link || null,
    };
  });
};
