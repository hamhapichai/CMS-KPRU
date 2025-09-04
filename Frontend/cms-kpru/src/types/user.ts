export type Role = 'admin' | 'dean' | 'officer' | 'committee';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  department?: string;
  lastLoginAt?: string;
  isActive: boolean;
}
