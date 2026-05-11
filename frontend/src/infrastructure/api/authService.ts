import type { LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '../../domain/auth/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      // FastAPI requiere form-urlencoded para OAuth2
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (response.status === 401) {
        return {
          data: null,
          error: 'Correo o contraseña incorrectos',
          loading: false,
          status: 401,
        };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();
      return { data, error: null, loading: false, status: 200 };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { data: null, error: errorMessage, loading: false };
    }
  },

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'cliente',
      };

      const response = await fetch(`${API_BASE_URL}/router/rt_users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        return {
          data: null,
          error: null,
          loading: false,
          status: 201,
        };
      }

      if (response.status === 400) {
        const errorData = await response.json();
        return {
          data: null,
          error: errorData.detail || 'El correo ya está registrado',
          loading: false,
          status: 400,
        };
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null, loading: false, status: 200 };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { data: null, error: errorMessage, loading: false };
    }
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  removeToken(): void {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};
