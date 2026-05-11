import React, { useState, useMemo } from 'react';
import styles from './MachinesPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar, type FilterState } from '../../components/sidebar/Sidebar';
import { AddToCartButton } from '../../components/product/AddToCartButton';
import { useProducts } from '../../../infrastructure/hooks/useProducts';
import { CATEGORIES } from '../../../domain/product/constants';
import { mapProductToFrontend } from '../../../infrastructure/api/productService';
import type { Page } from '../../../domain/types';

interface Props {
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
}

const CATEGORY = CATEGORIES.MACHINES;

const DEFAULT_FILTERS: FilterState = { maxPrice: 0, brands: [] };

const LoadingSkeleton = () => (
  <div className={styles.skeletonGrid}>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className={styles.skeletonCard}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonDesc} />
          <div className={styles.skeletonPrice} />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className={styles.errorContainer}>
    <span className={`${styles.errorIcon} material-symbols-outlined`}>error</span>
    <p className={styles.errorMessage}>{message}</p>
    <button className={styles.retryButton} onClick={onRetry}>
      Reintentar
    </button>
  </div>
);

export const MachinesPage: React.FC<Props> = ({ currentPage = 'machines', onNavigate }) => {
  const { products: allProducts, loading, error } = useProducts(CATEGORY);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const products = useMemo(() => {
    return allProducts.filter(product => {
      const price = product.price || 0;
      if (filters.maxPrice > 0) {
        const minPrice = filters.maxPrice;
        const maxPrice = filters.maxPrice + 999;
        if (price < minPrice || price > maxPrice) return false;
      }
      if (filters.brands.length > 0) {
        const distributorName = product.distributor?.name?.toLowerCase() || '';
        const brandMatch = filters.brands.some(brandId => {
          if (brandId === 'iron') return distributorName.includes('iron') || distributorName.includes('supply');
          if (brandId === 'fitworld') return distributorName.includes('fitworld') || distributorName.includes('distributor');
          return false;
        });
        if (!brandMatch) return false;
      }
      return true;
    });
  }, [allProducts, filters]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar filters={filters} onFilterChange={setFilters} />
        <main className={styles.mainContent}>
          <div className={styles.heroBanner}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVaR-IHY98Czm9Yyq_Psl6ag4Zg8RhdSxKhxurHyD9ol7LLlQKQEB23FC7BliUkeD31sdIME9_tZj-igl_9a3tXf0wglDU1pTvedskPFpkV7cPFIlYMHuLmQBPtjH58DUwv-19lCm-00nCdlZ9zoMV5-8vhaEkVaA7Cs3nPqSfr8B33ReqR3QHp4OSzWZXIAJNir_TsQ3D0Qa6tbvRV7W9mfvZzTQbm4hj4rWo0zj_Aq873NKgBJYJ9iLD08d6Ids-YAnMfVgMCWx" 
              alt="Machines" 
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>Professional Equipment</span>
              <h1 className={styles.heroTitle}>Maquinaria</h1>
              <p className={styles.heroDescription}>Máquinas de gym de grado comercial para entrenamiento muscular completo.</p>
            </div>
          </div>

          {loading && <LoadingSkeleton />}

          {error && <ErrorState message={error} onRetry={handleRetry} />}

          {!loading && !error && (
            <div className={styles.productGrid}>
              {products.map((product) => {
                const frontendProduct = mapProductToFrontend(product);
                return (
                  <article key={product.id} className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      <img 
                        src={frontendProduct.imageUrl} 
                        alt={frontendProduct.imageAlt} 
                        className={styles.productImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/e5e7eb/9ca3af?text=Imagen+no+disponible';
                        }}
                      />
                      <div className={styles.quickAdd}>
                        <AddToCartButton
                          product={product}
                          imageUrl={frontendProduct.imageUrl}
                          imageAlt={frontendProduct.imageAlt}
                        />
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.stockBadge} data-stock={product.stock}>
                        <span className="material-symbols-outlined">inventory_2</span>
                        {product.stock === 0 ? 'Agotado' : product.stock <= 5 ? `Poco stock (${product.stock})` : `En stock (${product.stock})`}
                      </div>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      {product.description && (
                        <p className={styles.productDescription}>{product.description}</p>
                      )}
                      {product.distributor && (
                        <p className={styles.productSupplier}>Proveedor: {product.distributor.name}</p>
                      )}
                      <div className={styles.productFooter}>
                        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>No se encontraron productos en esta categoría.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
