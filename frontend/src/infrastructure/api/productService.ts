import type { Product } from '../../domain/product/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/router/rt_products/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null, loading: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { data: null, error: errorMessage, loading: false };
    }
  },

  async getProductById(productId: number): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`/router/rt_products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null, loading: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { data: null, error: errorMessage, loading: false };
    }
  },

  filterByCategory(products: Product[], category: string): Product[] {
    return products.filter(product => product.category === category);
  },
};

export const mapProductToFrontend = (product: Product) => {
  const imageUrl = (product as unknown as { image_url?: string }).image_url || '';
  
  return {
    ...product,
    imageUrl: imageUrl || '/placeholder-product.png',
    imageAlt: product.name,
  };
};