import { AdminRole } from "./profile";

interface AdminStore {
  role: string;
  store: {
    id: string;
    name: string;
  };
}

export interface StaffMember {
  id: string;
  phone: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: AdminRole;
  mustChangePassword: boolean;
  createdById: string | null;
  adminStores: AdminStore[];
}
