import React from 'react';
import styles from './Header.module.css';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';
import { useCart } from '../../../infrastructure/context/CartContext';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout') => void;
}

export const Header: React.FC<Props> = ({ currentPage = 'home', onNavigate }) => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const { totalItems } = useCart();

  const handleNavClick = (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout') => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logo}>IRON GEAR</div>

          <div className={styles.searchWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Buscar equipamiento profesional..." 
            />
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
