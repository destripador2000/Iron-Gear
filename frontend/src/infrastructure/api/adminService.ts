import type { User, UserCreate, Distributor, DistributorCreate } from '../../domain/administration/types';
import { authService } from './authService';

const API_BASE = '/router';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status?: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

export const adminService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE}/rt_users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: User[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async createUser(user: UserCreate): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE}/rt_users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error: ${response.status}`);
      }

      const data: User = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE}/rt_users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error: ${response.status}`);
      }

      return { data: undefined, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async getDistributors(): Promise<ApiResponse<Distributor[]>> {
    try {
      const response = await fetch(`${API_BASE}/rt_distributors`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: Distributor[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async createDistributor(distributor: DistributorCreate): Promise<ApiResponse<Distributor>> {
    try {
      const response = await fetch(`${API_BASE}/rt_distributors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(distributor),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error: ${response.status}`);
      }

      const data: Distributor = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async deleteDistributor(distributorId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE}/rt_distributors/${distributorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error: ${response.status}`);
      }

      return { data: undefined, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },
};