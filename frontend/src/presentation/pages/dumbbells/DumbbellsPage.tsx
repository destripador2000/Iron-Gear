import React from 'react';
import styles from './DumbbellsPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing') => void;
}

const dumbbellProducts: Product[] = [
  {
    id: '1',
    title: 'Mancuernas Hexagonales de Caucho',
    price: 189.00,
    rating: 5,
    reviews: 124,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5Je7CTDU7lxd1bT6dAF-d4l__pdIUGhlqnSA7OHg1YVMC8vHYbNwyIYqDyg0gZK7sOIL-N1vA9DPadURN3b56TaJVqrCnh0_tbGELMRSJG-YVF8FmzZTuzZsVlNztr18SZCeBqzQClFi5WVHuGB6OqaqvYyAy74nTzv9rlWpX9huzZejZfMYwf4M6RE09BYs8k24wsGf7G0HeT_mwVcD3N6EqT3naDwGZii_arYbWJXHWj46Nt5oXKexIu0JRXKALbMsUCVi7eliZ',
    imageAlt: 'Hex Dumbbells',
    weight: '2x 22.5kg',
    material: 'Núcleo de Acero'
  },
  {
    id: '2',
    title: 'Mancuernas Ajustables Premium',
    price: 499.00,
    rating: 5,
    reviews: 89,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDow3Je5cqPwiqk87x665wWcsp_HmZCleQ-K487PyI44qx_VI1ihVDDXwvEy6ENdGJnIkkDrruN9lzxkZeX41pu8SlztSSctCamGHzp35oglByhA2kuoTeLk7faaBFS7dQTcsvTJwQmZlM7kK8EZ_3-baK2P6dBQXJCEgeoxKH-ArUmuguh78UMYDeynplnmoYy_nDpu4uKcT3fXy_E7idxCrIUgUuN95zMZ1TcM2eRZoK7d5cf_ut6SkpYmT3DAAQVO8kfmOOP-C-y',
    imageAlt: 'Adjustable Dumbbells',
    weight: '2kg a 40kg',
    material: 'Sistema Click-Lock',
    isNew: true
  },
  {
    id: '3',
    title: 'Mancuernas de Cromo Pulido',
    price: 125.00,
    rating: 4,
    reviews: 42,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEvdusJQqNZhLNiNF9XuG7pMDZ_QVqqSfq4s66Ywsfe82E5QLdQHWoDcTHsaRq3bsJUGFg3i04xYWfw7n0XKYT1E3WqhUOjuKohNYDYi5Fs0or96uffwGsJ3ShZzVozDXmkFblKZJvUbtzn6ih8HIb7m-Bk0FXCMRWuBcrsGLAOcxvY-t_UDKzHKIoxrSimBZmEklbBwQHgX3nxm5-RZZ_MoKWb_pubk5DmvDWiXxks4xwaTiUSdwp8pN9oCsNIfmvwDifgY2Nia4A',
    imageAlt: 'Chrome Dumbbells',
    weight: 'Set de 2.5kg a 10kg',
    material: 'Ergonomía Pro'
  },
  {
    id: '4',
    title: 'Rack de Mancuernas de 3 Niveles',
    price: 295.00,
    rating: 5,
    reviews: 215,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgtwIswRgwmt_a5X3OgUbqpvs0gBTSZGqLbM06HXehQ2f2rXJ99r3j1AxDntq0g4gxRO1b99Qcb3JzerxLtxhVcSwXGJ5GdhdUmrwk5O-VGm1srA8wDEjT3BJfZrodiQeWGTZSPb6sVTUb6r1f9TKmQoo7PK02WyM9oojQXhWrHeimbfYIhCC7_bHbG0Lzma94wky8Tei7CMttgbF_xChjYo5VMnYT-TwkiHdrl4Zvn1JBHfoATkt3hwCWD4zSaMztr9OPAiJtNU-',
    imageAlt: 'Dumbbell Rack',
    weight: 'Capacidad 600kg',
    material: 'Acero Calibre 11'
  },
  {
    id: '5',
    title: 'Mancuerna Hexagonal Individual',
    price: 95.00,
    rating: 5,
    reviews: 56,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX_OQt3mCaG9wIF8n9I5yWhQ2wMvPIX8pViU9dWs8IkqVaICk557KmRG7IiThW3eO5lJD8R-FZ8v4xzBfTlCfQAVzaZqod34Biok5u8an5hndxY7R_YyZeXakeduKE215uCfZelpx0IGYoqvkGIClTICXrnnVatDlxjLZ5lwFvb75Dlc13-GE4eznlSKzSq_Yp-M9gM58YPFrkHkdD0B9pElrG5KVpWCFeDwqmVU6qmZwohH-Zyd0RJRg_l28RW4JukCba4h5KfIUz',
    imageAlt: 'Hex Dumbbells 30kg',
    weight: '30kg',
    material: 'Grado Profesional'
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span 
      key={i} 
      className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty} material-symbols-outlined`}
      style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
    >
      star
    </span>
  ));
};

export const DumbbellsPage: React.FC<Props> = ({ currentPage = 'dumbbells', onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.categoryHeader}>
            <h1 className={styles.categoryTitle}>Mancuernas</h1>
          </div>

          <div className={styles.productGrid}>
            {dumbbellProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.imageAlt} 
                    className={styles.productImage}
                  />
                  {product.isNew && (
                    <span className={styles.newBadge}>NUEVO</span>
                  )}
                  <div className={styles.quickAdd}>
                    <button className={styles.quickAddButton}>
                      <span className="material-symbols-outlined">shopping_cart</span>
                      AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.rating}>
                    {renderStars(product.rating)}
                    <span className={styles.reviewCount}>({product.reviews})</span>
                  </div>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productWeight}>{product.weight} • {product.material}</p>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      <Footer />
      <button className={styles.mobileFilterBtn}>
        <span className="material-symbols-outlined">support_agent</span>
      </button>
    </div>
  );
};
