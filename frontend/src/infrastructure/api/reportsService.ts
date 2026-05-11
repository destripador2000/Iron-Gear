import type { SalesReport, TopProduct, TopClient, InventoryAlert, ReportsApiResponse } from '../../domain/reports/types';
import { authService } from './authService';

const API_BASE_URL = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const reportsService = {
  async getSalesReport(): Promise<ReportsApiResponse<SalesReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/sales`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: SalesReport = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async getTopProducts(): Promise<ReportsApiResponse<TopProduct[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/top-products`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: TopProduct[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async getTopClients(): Promise<ReportsApiResponse<TopClient[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/top-clients`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: TopClient[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },

  async getInventoryAlerts(): Promise<ReportsApiResponse<InventoryAlert[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/alerts`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        return { data: null, error: 'Sesión expirada', status: 401 };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: InventoryAlert[] = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  },
};