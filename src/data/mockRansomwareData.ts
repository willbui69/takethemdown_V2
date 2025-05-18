
import { RansomwareGroup, RansomwareStat, RansomwareVictim } from "@/types/ransomware";

export const mockVictims: RansomwareVictim[] = [
  {
    group_name: "LockBit",
    victim_name: "ABC Corporation",
    published: "2025-05-17T12:00:00Z",
    url: "https://example.com/victim1",
    description: "Multinational technology company",
    country: "United States",
    industry: "Technology"
  },
  {
    group_name: "Conti",
    victim_name: "XYZ Healthcare",
    published: "2025-05-16T10:30:00Z",
    url: "https://example.com/victim2",
    country: "Canada",
    industry: "Healthcare"
  },
  {
    group_name: "BlackCat",
    victim_name: "Global Logistics Inc.",
    published: "2025-05-15T15:45:00Z",
    url: "https://example.com/victim3",
    country: "Germany",
    industry: "Logistics"
  },
  {
    group_name: "REvil",
    victim_name: "City Power Services",
    published: "2025-05-14T09:20:00Z",
    url: "https://example.com/victim4",
    country: "Australia",
    industry: "Energy"
  },
  {
    group_name: "LockBit",
    victim_name: "Financial Trust Bank",
    published: "2025-05-13T14:10:00Z",
    url: "https://example.com/victim5",
    country: "United Kingdom",
    industry: "Finance"
  }
];

export const mockRecentVictims: RansomwareVictim[] = [
  {
    group_name: "LockBit",
    victim_name: "ABC Corporation",
    published: "2025-05-17T12:00:00Z",
    url: "https://example.com/victim1",
    description: "Multinational technology company",
    country: "United States",
    industry: "Technology"
  },
  {
    group_name: "Conti",
    victim_name: "XYZ Healthcare",
    published: "2025-05-16T10:30:00Z",
    url: "https://example.com/victim2",
    country: "Canada",
    industry: "Healthcare"
  }
];

export const mockGroups: RansomwareGroup[] = [
  {
    name: "LockBit",
    description: "Ransomware-as-a-Service operation active since 2019",
    active: true,
    url: "https://example.com/lockbit",
    count: 1200
  },
  {
    name: "Conti",
    description: "Believed to operate from Russia, known for high-profile attacks",
    active: false,
    url: "https://example.com/conti",
    count: 850
  },
  {
    name: "BlackCat",
    description: "Also known as ALPHV, operates as RaaS",
    active: true,
    url: "https://example.com/blackcat",
    count: 650
  },
  {
    name: "REvil",
    description: "Ransomware operation believed to be disbanded",
    active: false,
    url: "https://example.com/revil",
    count: 760
  },
  {
    name: "Cl0p",
    description: "Known for targeting zero-day vulnerabilities",
    active: true,
    url: "https://example.com/clop",
    count: 420
  }
];

export const mockStats: RansomwareStat[] = [
  {
    group: "LockBit",
    count: 1200,
    last_update: "2025-05-17T00:00:00Z"
  },
  {
    group: "Conti",
    count: 850,
    last_update: "2025-04-30T00:00:00Z"
  },
  {
    group: "BlackCat",
    count: 650,
    last_update: "2025-05-16T00:00:00Z"
  },
  {
    group: "REvil",
    count: 760,
    last_update: "2025-03-15T00:00:00Z"
  },
  {
    group: "Cl0p",
    count: 420,
    last_update: "2025-05-15T00:00:00Z"
  },
  {
    group: "Hive",
    count: 380,
    last_update: "2025-04-10T00:00:00Z"
  },
  {
    group: "AvosLocker",
    count: 290,
    last_update: "2025-05-12T00:00:00Z"
  },
  {
    group: "BlackByte",
    count: 210,
    last_update: "2025-05-10T00:00:00Z"
  },
  {
    group: "Vice Society",
    count: 180,
    last_update: "2025-05-05T00:00:00Z"
  },
  {
    group: "LV",
    count: 160,
    last_update: "2025-04-25T00:00:00Z"
  }
];
