
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
