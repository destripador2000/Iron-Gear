import React from 'react';
import styles from './App.module.css';
import { Header } from './presentation/components/header/Header';
import { Footer } from './presentation/components/footer/Footer';
import { Sidebar } from './presentation/components/sidebar/Sidebar';
import { ProductCard } from './presentation/components/product/ProductCard';
import {type Product } from './domain/product/types';

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Olympic Weight Plates Set',
    price: 299.00,
    rating: 4.8,
    imageUrl: 'https://via.placeholder.com/600x400',
    imageAlt: 'Olympic Plates',
    description: 'Construidos con uretano de alta densidad para máxima durabilidad y absorción de impacto. Ideales para levantamientos explosivos.',
    isPremium: true
  },
  {
    id: '2',
    title: 'Whey Protein Isolated 5lb',
    price: 79.99,
    rating: 4.9,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Whey Protein'
  },
  {
    id: '3',
    title: 'Adjustable Pro Bench G3',
    price: 199.00,
    rating: 4.7,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Adjustable Bench'
  }
];

const App: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContainer}>
        <Sidebar />
        
        <section className={styles.catalogSection}>
          <div className={styles.catalogHeader}>
            <div>
              <h1 className={styles.mainTitle}>Top 5 Productos Destacados</h1>
              <p className={styles.subtitle}>Nuestra selección premium de ingeniería superior diseñada para atletas de alto rendimiento.</p>
            </div>
          </div>

          <div className={styles.productGrid}>
            {mockProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFeatured={index === 0} 
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
