
export interface ResourceLink {
  name: string;
  url?: string;
  email?: string;
  phone?: string;
  description: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  resources: ResourceLink[];
}

export interface CountryContact {
  country: string;
  phone: string;
  email: string;
  reportLink: string;
}

export interface LocalContact {
  province: string;
  channels: {
    name: string;
    phone: string;
    email: string;
    reportLink: string;
    address: string;
  }[];
}

export interface InternationalOrg {
  organization: string;
  phone: string;
  email: string;
  reportLink: string;
}
