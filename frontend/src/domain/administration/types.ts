export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Distributor {
  id: number;
  name: string;
  contact_email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
}

export interface DistributorCreate {
  name: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
}

export type UserRole = 'administrador' | 'vendedor' | 'cliente';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'cliente', label: 'Cliente' },
];