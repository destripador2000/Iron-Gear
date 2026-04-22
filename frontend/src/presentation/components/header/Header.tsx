import React from 'react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
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
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">person</span>
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className={styles.cartBadge}>0</span>
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">support_agent</span>
            </button>
          </div>
        </div>

        <nav className={styles.navigation}>
          <a href="#" className={`${styles.navLink} ${styles.active}`}>Mancuernas</a>
          <a href="#" className={styles.navLink}>Barras</a>
          <a href="#" className={styles.navLink}>Máquinas</a>
          <a href="#" className={styles.navLink}>Ropa Deportiva</a>
          <a href="#" className={styles.navLink}>Suplementos</a>
          <a href="#" className={styles.navLink}>Farmacología Deportiva</a>
        </nav>
      </div>
    </header>
  );
};