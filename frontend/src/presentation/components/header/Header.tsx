import React, { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';
import { useCart } from '../../../infrastructure/context/CartContext';
import { productService } from '../../../infrastructure/api/productService';
import type { Page } from '../../../domain/types';
import type { Product } from '../../../domain/product/types';

interface Props {
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
}

export const Header: React.FC<Props> = ({ currentPage = 'home', onNavigate }) => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (page: Page) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      logout();
      onNavigate?.('home');
    } else {
      onNavigate?.('account');
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('cart');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      const result = await productService.getProducts();
      if (result.data) {
        const filtered = result.data.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8);
        setSearchResults(filtered);
        setShowResults(true);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleResultClick = (product: Product) => {
    setShowResults(false);
    setSearchQuery('');
    onNavigate?.('home');
  };

  const getCategoryName = (category: string): string => {
    const map: Record<string, string> = {
      'mancuernas': 'dumbbells',
      'barras': 'bars',
      'ropa': 'clothing',
      'máquinas': 'machines',
      'suplementos': 'supplements',
      'farmacología': 'pharmacology'
    };
    return map[category] || 'home';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logo} onClick={handleNavClick('home')}>IRON GEAR</div>

          <div className={styles.searchWrapper} ref={searchRef}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Buscar equipamiento profesional..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {showResults && searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map(product => (
                  <div 
                    key={product.id} 
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(product)}
                  >
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultCategory}>{product.category}</span>
                    <span className={styles.resultPrice}>${product.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {isAuthenticated && user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.name || user.email}</span>
                <button className={styles.logoutBtn} onClick={handleAccountClick}>
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <button className={styles.iconBtn} onClick={handleAccountClick}>
                <span className="material-symbols-outlined">person</span>
              </button>
            )}
            <button className={styles.iconBtn} onClick={handleCartClick}>
              <span className="material-symbols-outlined">shopping_cart</span>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">support_agent</span>
            </button>
          </div>
        </div>

        <nav className={styles.navigation}>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'home' ? styles.active : ''}`}
            onClick={handleNavClick('home')}
          >
            Inicio
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'dumbbells' ? styles.active : ''}`}
            onClick={handleNavClick('dumbbells')}
          >
            Mancuernas
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'bars' ? styles.active : ''}`}
            onClick={handleNavClick('bars')}
          >
            Barras
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'clothing' ? styles.active : ''}`}
            onClick={handleNavClick('clothing')}
          >
            Ropa
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'machines' ? styles.active : ''}`}
            onClick={handleNavClick('machines')}
          >
            Máquinas
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'supplements' ? styles.active : ''}`}
            onClick={handleNavClick('supplements')}
          >
            Suplementos
          </a>
          <a 
            href="#" 
            className={`${styles.navLink} ${currentPage === 'pharmacology' ? styles.active : ''}`}
            onClick={handleNavClick('pharmacology')}
          >
            Farmacología Deportiva
          </a>
        </nav>
      </div>
    </header>
  );
};
