import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface Props {
  variant?: 'default' | 'pharmacology';
}

export const Sidebar: React.FC<Props> = ({ variant = 'default' }) => {
  const [priceValue, setPriceValue] = useState(5000);

  return (
    <aside className={styles.sidebar}>
      {variant === 'pharmacology' ? (
        <>
          <div className={styles.header}>
            <h3>Filters</h3>
            <p>Refine Equipment</p>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">payments</span>
              <h4>Price Range</h4>
            </div>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> $0 - $100
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> $100 - $500
            </label>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">factory</span>
              <h4>Brand</h4>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">fitness_center</span>
              <h4>Material</h4>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">star</span>
              <h4>Rating</h4>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h3>Filtros Avanzados</h3>
            <p>Equipamiento Profesional</p>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">payments</span>
              <h4>Precio</h4>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="0" 
              max="5000" 
              value={priceValue}
              onChange={(e) => setPriceValue(Number(e.target.value))}
            />
            <div className={styles.priceValue}>${priceValue.toLocaleString()}</div>
            <div className={styles.rangeLabels}>
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>
              <span className="material-symbols-outlined">factory</span>
              <h4>Marca</h4>
            </div>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Iron Gear Pro
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Rogue Fitness
            </label>
          </div>

          <button className={styles.clearBtn}>Limpiar Filtros</button>
        </>
      )}
    </aside>
  );
};