import React, { useState } from 'react';
import styles from './App.module.css';
import { Header } from './presentation/components/header/Header';
import { Footer } from './presentation/components/footer/Footer';
import { Sidebar } from './presentation/components/sidebar/Sidebar';
import { ProductCard } from './presentation/components/product/ProductCard';
import { DumbbellsPage } from './presentation/pages/dumbbells/DumbbellsPage';
import { BarsPage } from './presentation/pages/bars/BarsPage';
import { ClothingPage } from './presentation/pages/clothing/ClothingPage';
import { MachinesPage } from './presentation/pages/machines/MachinesPage';
import { SupplementsPage } from './presentation/pages/supplements/SupplementsPage';
import { PharmacologyPage } from './presentation/pages/pharmacology/PharmacologyPage';
import {type Product } from './domain/product/types';

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Olympic Weight Plates Set',
    price: 299.00,
    rating: 4.8,
    reviews: 0,
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
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Whey Protein'
  },
  {
    id: '3',
    title: 'Adjustable Pro Bench G3',
    price: 199.00,
    rating: 4.7,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Adjustable Bench'
  },
  {
    id: '4',
    title: 'Barra Olímpica de Acero',
    price: 149.99,
    rating: 4.6,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Barra Olímpica',
    description: 'Barra de acero resistente con capacidad de 700kg. Acabado cromado anti-corrosión.'
  },
  {
    id: '5',
    title: 'Kettlebell Competition 16kg',
    price: 89.99,
    rating: 4.5,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Kettlebell',
    description: 'Kettlebell de competencia con mango ergonómico. Fundición de alta calidad.'
  },
  {
    id: '6',
    title: 'Cinturón de Cuero Profesional',
    price: 59.99,
    rating: 4.8,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Cinturón',
    description: 'Cinturón de cuero genuino con hebilla de doble pin. Soporte lumbar reforzado.'
  },
  {
    id: '7',
    title: 'Mancuernas Ajustables 5-25kg',
    price: 249.00,
    rating: 4.7,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Mancuernas Ajustables',
    description: 'Sistema de ajuste rápido con incrementos de 2.5kg. Platos de acero recubiertos.'
  },
  {
    id: '8',
    title: 'Guantes de Levantamiento Pro',
    price: 34.99,
    rating: 4.4,
    reviews: 0,
    imageUrl: 'https://via.placeholder.com/300x300',
    imageAlt: 'Guantes',
    description: 'Guantes con soporte de muñeca y palma reforzada. Material transpirable.'
  }
];

type Page = 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (currentPage === 'dumbbells') {
    return <DumbbellsPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'bars') {
    return <BarsPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'clothing') {
    return <ClothingPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'machines') {
    return <MachinesPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'supplements') {
    return <SupplementsPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'pharmacology') {
    return <PharmacologyPage currentPage={currentPage} onNavigate={setCurrentPage} />;
  }

  return (
    <div className={styles.layout}>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className={styles.mainContainer}>
        <Sidebar />
        
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