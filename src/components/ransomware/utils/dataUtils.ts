
import { RansomwareVictim } from "@/types/ransomware";

// Filter victims to only include those within the last 24 hours
export const filterRecent24Hours = (victims: RansomwareVictim[]): RansomwareVictim[] => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return victims.filter(victim => {
    if (!victim.published) return false;
    
    try {
      const publishDate = new Date(victim.published);
      return publishDate >= twentyFourHoursAgo && publishDate <= now;
    } catch (err) {
      console.error("Invalid date format for victim:", victim.victim_name, victim.published);
      return false;
    }
  });
};
