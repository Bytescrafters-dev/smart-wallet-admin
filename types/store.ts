export interface Store {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  defaultCurrency: string;
  timezone: string | null;
  supportEmail: string | null;
  logoUrl: string | null;
}
