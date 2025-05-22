
// Re-export all functions from victim API modules
export { 
  fetchAllVictims,
  fetchVictimsByGroup,
  fetchVictimCountForGroup 
} from './core';

export { fetchRecentVictims } from './recentVictims';
export { fetchVictimsByCountry } from './countryVictims';
