
export interface RansomwareVictim {
  group_name: string;
  victim_name: string;
  published: string;
  url: string;
  description?: string;
  country?: string;
  industry?: string;
}

export interface RansomwareGroup {
  name: string;
  description?: string;
  active: boolean;
  url?: string;
  count?: number;
}

export interface RansomwareStat {
  group: string;
  count: number;
  last_update?: string;
}

export interface Subscription {
  id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  verificationToken?: string;
  unsubscribeToken: string;
}

export interface FetchHistory {
  id: string;
  timestamp: string;
  totalCount: number;
  newCount: number;
  successful: boolean;
  error?: string;
}
