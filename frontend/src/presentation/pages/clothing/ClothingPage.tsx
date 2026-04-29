import React from 'react';
import styles from './ClothingPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology') => void;
}

const clothingProducts: Product[] = [
  {
    id: '1',
    title: 'IronSkin Compression',
    price: 45.00,
    rating: 5,
    reviews: 128,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsHK6V1jTH0xqyqyGit7-hfe9IuwGWZVutstoG-EL3ZNS5Qzhs2D0r4sX8hQhb_FWbMUQxstyMDzsd_3zwZgtQPRq9GT-82-dOfZW1YJvHxh_N1JaIdyqPd1rjWrs4QQSKZR7v1BXXbDetMNVhM2RF-KzAtPU7s4sCK93LI0UvFBNe1jN_3lCtGUG8oQn2M418UlLAg9CgOEiqt9uQjOeq6mtYWeq0LYSSNYKZy1G0R2ETC61emEri4egLfts-AeSuAd2GgU8pyOvv',
    imageAlt: 'Camiseta de compresión IronSkin',
    isPremium: true
  },
  {
    id: '2',
    title: 'Elite Squat Shorts',
    price: 38.00,
    rating: 4,
    reviews: 94,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYl-dTZTZFOPIL3U_1XXHNU25WqNagGAWYIo6NouWRPx_u8tibAF3IblpR7yK0ntDE-WKUvb9QNHn5qcWZ7lTPM2Lmz8pthDH1ZO7szij4MrpxqlCYe3DaiFUPuSg07SkoCT8Dtb20udY86J7ZqTp2utfaO9PobGmSHd5DFDIgb0DP9gFHBHToSW1gogc6U5Str0PJpFAFKjHEVIhsKTUs9utctP1OCsPLnpAzRMs8zmaEoI6iNi46bEDyJA3X1kqTXVLbS8DsOoOk',
    imageAlt: 'Pantalones cortos Elite Squat'
  },
  {
    id: '3',
    title: 'Hardcore Heavy',
    price: 65.00,
    rating: 5,
    reviews: 210,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ujFbNa4Z5Gh524l-PAYhuJ_XfG9H2An88aNGbdJeZsrwjJJf_v9p6fH1JXYP7HxXXzpXvnI2GYksdHK2MgLQNEcwg9YU5Ph4K4qJwEtxHVOiwOPDwJfJeZRqHSlOQOwNNeCT0ZKvrdoW6UyZoRGiz6qB13-EOrlF4VfiNa6WW6Oy1BIy80xzDkoaZpIqjXVgiIjNCWDFKjqvRErdyesJVek7OhT5Bq3khWhFwKL4jH5I8oGGsCZskgTwctNzafIfd3ouWYLUHmCO',
    imageAlt: 'Sudadera Hardcore Heavy'
  },
  {
    id: '4',
    title: 'Bodybuilder Classic',
    price: 29.00,
    rating: 4,
    reviews: 56,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByTomiTo5RQsamZ6fes6NSUK42GFw8i9Mz7O1ZDs0mSmgWILdCv81fIaRLdnmvs-SdIVuqKGZ4gM_ciLV7JfI08NdYX0CvJA209u2TB1gObEOuRAx7cjolApUo3zazv-CQcxog5TGqjJAbZ9p_p-a-6l6WeCFFo3QZmRSk7c0-k3RpqeFYFpCqQH5Dv99X-LPoZp_Gm2HfpoMyo4hNKC4pWJzmJ1raUXPBU02wl59lGtdegC8Jo7pNFPVJGZDLZMVwmBh2MiphNquz',
    imageAlt: 'Camiseta Bodybuilder Classic'
  },
  {
    id: '5',
    title: 'Calcetines Impact',
    price: 18.00,
    rating: 5,
    reviews: 320,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-zT4hvKz_ldSsYkGNSo1MBnQpXmhf4GgICWHKpuWLz2BSawFa5soM9V9YTIhUOqAAMyq4dx0Y-ms-FuaKT3uP2759MS-ddl5W0vEjC_pqCxY49e0HGptNHPymu6iBLIl7Eci6KeerYb6958J_87ZHiaT7tUesyF3O8kk3-rdBzPSkoxcJ39rJ7Lwy21fvwnzu06GbJT9b6lStoB3bX4L4kXEZeoTxufjeMy6pe61ZK_dX4YYbvY4v41rfngsvZuemNszeETCZt-t5',
    imageAlt: 'Calcetines de alto impacto'
  },
  {
    id: '6',
    title: 'Iron Snapback',
    price: 25.00,
    rating: 4,
    reviews: 42,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwHix6EPUw1yYNC3nMJIyQhqyzI3wK4QAb8z-Gx4JOscDP1JzMWnm5J-Z-nzVvD3BkGOXgTfCXjO-2HNgOTVbytFYEZyZKxlPRKnaQdnNcA6V6PQvHL4UbobXo0B52QxpVrBdhW9ymSZu2JM4PB9B3aSupsiqsOrFW3OnT4s5n70E5BQQcFpl32AVqU_0sMxW223OSnelUv9VwSY4c5Sw_uR-o4svAcl6VJagSv_TKnJY1BtFniIhoZHOT21aTlOksDgxxaLymY3zO',
    imageAlt: 'Gorra Iron Gear Snapback'
  }
];

export const ClothingPage: React.FC<Props> = ({ currentPage = 'clothing', onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.heroBanner}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVaR-IHY98Czm9Yyq_Psl6ag4Zg8RhdSxKhxurHyD9ol7LLlQKQEB23FC7BliUkeD31sdIME9_tZj-igl_9a3tXf0wglDU1pTvedskPFpkV7cPFIlYMHuLmQBPtjH58DUwv-19lCm-00nCdlZ9zoMV5-8vhaEkVaA7Cs3nPqSfr8B33ReqR3QHp4OSzWZXIAJNir_TsQ3D0Qa6tbvRV7W9mfvZzTQbm4hj4rWo0zj_Aq873NKgBJYJ9iLD08d6Ids-YAnMfVgMCWx" 
              alt="Clothing" 
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>Athletic Wear</span>
              <h1 className={styles.heroTitle}>Ropa</h1>
              <p className={styles.heroDescription}>Ropa deportiva de alta calidad diseñada para máximo rendimiento y confort.</p>
            </div>
          </div>

          <div className={styles.productGrid}>
            {clothingProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.imageAlt} 
                    className={styles.productImage}
                  />
                  <div className={styles.quickAdd}>
                    <button className={styles.quickAddButton}>
                      <span className="material-symbols-outlined">shopping_cart</span>
                      AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};