import React from 'react';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Filtros Avanzados</h3>
        <p>Equipamiento Profesional</p>
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterTitle}>
          <span className="material-symbols-outlined">payments</span>
          <h4>Precio</h4>
        </div>
        <input type="range" className={styles.rangeInput} min="0" max="5000" />
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
    </aside>
  );
};