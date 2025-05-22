
import { RansomwareVictim } from "@/types/ransomware";

// Function to normalize victim data from different API sources
export const normalizeVictimData = (data: any[], source?: string): RansomwareVictim[] => {
  if (!Array.isArray(data)) {
    console.error("Invalid victim data format:", data);
    return [];
  }

  return data.map(item => {
    // Special handling for country victims data which has a different structure
    if (source === 'countryvictims') {
      console.log("Processing country-specific victim data:", item);
      
      // For Vietnam, website or post_title are most reliable victim identifiers
      let victim_name = 
        item.post_title || 
        item.website ||
        item.victim ||
        item.title ||
        item.organization || 
        item.name || 
        (item.extrainfos && typeof item.extrainfos === 'object' && item.extrainfos.company) || 
        "Unknown";
      
      // Clean up victim name if it's just a domain
      if (victim_name.includes('.') && !victim_name.includes(' ')) {
        // Format domain nicely by removing common TLDs
        victim_name = victim_name
          .replace(/\.(com|net|org|vn|edu|gov|io)$/i, '')
          .replace(/\./g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
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
        url: item.url || item.claim_url || item.post_url || item.victim_url || null,
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
      item.website ||
      item.post_title ||
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
      url: item.url || item.victim_url || item.claim_url || item.post_url || item.link || null,
    };
  });
};
