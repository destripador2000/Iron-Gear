import React from 'react';
import styles from './DumbbellsPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useProducts } from '../../../infrastructure/hooks/useProducts';
import { CATEGORIES } from '../../../domain/product/constants';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account') => void;
}

const CATEGORY = CATEGORIES.DUMBBELLS;

const LoadingSkeleton = () => (
  <div className={styles.skeletonGrid}>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className={styles.skeletonCard}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonTitle} />
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

export const DumbbellsPage: React.FC<Props> = ({ currentPage = 'dumbbells', onNavigate }) => {
  const { products, loading, error } = useProducts(CATEGORY);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.heroBanner}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVaR-IHY98Czm9Yyq_Psl6ag4Zg8RhdSxKhxurHyD9ol7LLlQKQEB23FC7BliUkeD31sdIME9_tZj-igl_9a3tXf0wglDU1pTvedskPFpkV7cPFIlYMHuLmQBPtjH58DUwv-19lCm-00nCdlZ9zoMV5-8vhaEkVaA7Cs3nPqSfr8B33ReqR3QHp4OSzWZXIAJNir_TsQ3D0Qa6tbvRV7W9mfvZzTQbm4hj4rWo0zj_Aq873NKgBJYJ9iLD08d6Ids-YAnMfVgMCWx" 
              alt="Dumbbells" 
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>Strength Training</span>
              <h1 className={styles.heroTitle}>Mancuernas</h1>
              <p className={styles.heroDescription}>Entrenamiento de fuerza de grado profesional con weights premium para gimnasio en casa.</p>
            </div>
          </div>

          {loading && <LoadingSkeleton />}

          {error && <ErrorState message={error} onRetry={handleRetry} />}

          {!loading && !error && (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.imageAlt} 
                      className={styles.productImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e5e7eb/9ca3af?text=Imagen+no+disponible';
                      }}
                    />
                    <div className={styles.quickAdd}>
                      <button className={styles.quickAddButton}>
                        <span className="material-symbols-outlined">shopping_cart</span>
                        AGREGAR AL CARRITO
                      </button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    {product.description && (
                      <p className={styles.productDescription}>{product.description}</p>
                    )}
                    {product.distributor && (
                      <p className={styles.productSupplier}>Proveedor: {product.distributor.name}</p>
                    )}
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                  </div>
                </article>
              ))}
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
      <button className={styles.mobileFilterBtn}>
        <span className="material-symbols-outlined">support_agent</span>
      </button>
    </div>
  );
};