
// If the file already exists, we need to add the countries field to the Subscription interface
// This is likely just a part of the file, so we'll update just that part
export interface Subscription {
  id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  verificationToken?: string;
  unsubscribeToken?: string;
  countries?: string[];
}

// Adding the missing type definitions
export interface RansomwareVictim {
  victim_name: string;
  group_name: string;
  published: string;
  url?: string;
  country?: string;
  industry?: string;
  [key: string]: any; // For any additional properties
}

export interface RansomwareGroup {
  name: string;
  active: boolean;
  url?: string;
  [key: string]: any; // For any additional properties
}

export interface RansomwareStat {
  group: string;
  count: number;
  [key: string]: any; // For any additional properties
}

export interface FetchHistory {
  id: string;
  timestamp: string;
  status?: string;
  error?: string;
  successful: boolean;
  totalCount: number;
  newCount: number;
}
