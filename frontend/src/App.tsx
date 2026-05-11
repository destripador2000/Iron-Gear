import React, { useState, useEffect, useMemo } from 'react';
import styles from './App.module.css';
import { AuthProvider } from './infrastructure/context/AuthContext';
import { CartProvider } from './infrastructure/context/CartContext';
import { Header } from './presentation/components/header/Header';
import { Footer } from './presentation/components/footer/Footer';
import { Sidebar, type FilterState } from './presentation/components/sidebar/Sidebar';
import { AddToCartButton } from './presentation/components/product/AddToCartButton';
import { DumbbellsPage } from './presentation/pages/dumbbells/DumbbellsPage';
import { BarsPage } from './presentation/pages/bars/BarsPage';
import { ClothingPage } from './presentation/pages/clothing/ClothingPage';
import { MachinesPage } from './presentation/pages/machines/MachinesPage';
import { SupplementsPage } from './presentation/pages/supplements/SupplementsPage';
import { PharmacologyPage } from './presentation/pages/pharmacology/PharmacologyPage';
import { AccountPage } from './presentation/pages/account/AccountPage';
import { RegisterPage } from './presentation/pages/account/RegisterPage';
import { CartPage } from './presentation/pages/cart/CartPage';
import { CheckoutPage } from './presentation/pages/checkout/CheckoutPage';
import { DashboardPage } from './presentation/pages/admin/DashboardPage';
import { productService, mapProductToFrontend } from './infrastructure/api/productService';
import type { Product } from './domain/product/types';
import type { Page } from './domain/types';

const DEFAULT_FILTERS: FilterState = { maxPrice: 0, brands: [] };

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [homeProducts, setHomeProducts] = useState<{ products: Product[]; loading: boolean }>({ products: [], loading: true });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productService.getProducts();
      if (result.data) {
        setHomeProducts({ products: result.data.slice(0, 5), loading: false });
      } else {
        setHomeProducts({ products: [], loading: false });
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return homeProducts.products.filter(product => {
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
  }, [homeProducts.products, filters]);

  if (currentPage === 'dumbbells') {
    return (
      <CartProvider>
        <AuthProvider>
          <DumbbellsPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'bars') {
    return (
      <CartProvider>
        <AuthProvider>
          <BarsPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'clothing') {
    return (
      <CartProvider>
        <AuthProvider>
          <ClothingPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'machines') {
    return (
      <CartProvider>
        <AuthProvider>
          <MachinesPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'supplements') {
    return (
      <CartProvider>
        <AuthProvider>
          <SupplementsPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'pharmacology') {
    return (
      <CartProvider>
        <AuthProvider>
          <PharmacologyPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'account') {
    return (
      <CartProvider>
        <AuthProvider>
          <AccountPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'register') {
    return (
      <CartProvider>
        <AuthProvider>
          <RegisterPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'cart') {
    return (
      <CartProvider>
        <AuthProvider>
          <CartPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <CartProvider>
        <AuthProvider>
          <CheckoutPage currentPage={currentPage} onNavigate={setCurrentPage} />
        </AuthProvider>
      </CartProvider>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <CartProvider>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <AuthProvider>
        <div className={styles.layout}>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className={styles.mainContainer}>
            <Sidebar filters={filters} onFilterChange={setFilters} />
            
            <section className={styles.catalogSection}>
              <div className={styles.heroBanner}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVaR-IHY98Czm9Yyq_Psl6ag4Zg8RhdSxKhxurHyD9ol7LLlQKQEB23FC7BliUkeD31sdIME9_tZj-igl_9a3tXf0wglDU1pTvedskPFpkV7cPFIlYMHuLmQBPtjH58DUwv-19lCm-00nCdlZ9zoMV5-8vhaEkVaA7Cs3nPqSfr8B33ReqR3QHp4OSzWZXIAJNir_TsQ3D0Qa6tbvRV7W9mfvZzTQbm4hj4rWo0zj_Aq873NKgBJYJ9iLD08d6Ids-YAnMfVgMCWx" 
                  alt="Iron Gear" 
                  className={styles.heroImage}
                />
                <div className={styles.heroContent}>
                  <span className={styles.heroLabel}>Professional Equipment</span>
                  <h1 className={styles.heroTitle}>Iron Gear</h1>
                  <p className={styles.heroDescription}>Nuestra selección premium de ingeniería superior diseñada para atletas de alto rendimiento.</p>
                </div>
              </div>

              {homeProducts.loading ? (
                <div className={styles.loading}>Cargando productos...</div>
              ) : (
                <div className={styles.productGrid}>
                  {filteredProducts.map((product) => {
                    const frontendProduct = mapProductToFrontend(product);
                    return (
                      <article key={product.id} className={styles.productCard}>
                        <div className={styles.imageWrapper}>
                          <img 
                            src={frontendProduct.imageUrl} 
                            alt={frontendProduct.imageAlt} 
                            className={styles.productImage}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e5e7eb/9ca3af?text=Imagen+no+disponible';
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
                          <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
