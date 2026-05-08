import { useState, useEffect } from 'react';
import type { ProductFrontend } from '../../domain/product/types';
import { productService, mapProductToFrontend } from '../../infrastructure/api/productService';

interface UseProductsReturn {
  products: ProductFrontend[];
  loading: boolean;
  error: string | null;
}

export const useProducts = (category: string): UseProductsReturn => {
  const [products, setProducts] = useState<ProductFrontend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts();

      if (response.error) {
        setError(response.error);
        setProducts([]);
      } else if (response.data) {
        const filteredProducts = productService.filterByCategory(response.data, category);
        const mappedProducts = filteredProducts.map(mapProductToFrontend);
        setProducts(mappedProducts);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};