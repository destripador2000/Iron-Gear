import React, { useState } from 'react';
import styles from './Sidebar.module.css';

export interface FilterState {
  maxPrice: number;
  brands: string[];
}

const DEFAULT_FILTERS: FilterState = {
  maxPrice: 0,
  brands: [],
};

interface SidebarProps {
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  variant?: 'default' | 'pharmacology';
}

const BRANDS = [
  { id: 'iron', name: 'Iron Supply Co' },
  { id: 'fitworld', name: 'FitWorld Distributors' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  filters = DEFAULT_FILTERS, 
  onFilterChange,
  variant = 'default' 
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handlePriceChange = (value: number) => {
    const newFilters = { ...localFilters, maxPrice: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleBrandToggle = (brandId: string) => {
    const currentBrands = localFilters.brands;
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter(b => b !== brandId)
      : [...currentBrands, brandId];
    const newFilters = { ...localFilters, brands: newBrands };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = { maxPrice: 0, brands: [] };
    setLocalFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

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
              value={localFilters.maxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
            />
            <div className={styles.priceValue}>
              {localFilters.maxPrice === 0 
                ? 'Todos los precios' 
                : `$${localFilters.maxPrice.toLocaleString()} - $${(localFilters.maxPrice + 999).toLocaleString()}`}
            </div>
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
            {BRANDS.map(brand => (
              <label key={brand.id} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={localFilters.brands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                />
                {brand.name}
              </label>
            ))}
          </div>

          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Limpiar Filtros
          </button>
        </>
      )}
    </aside>
  );
};