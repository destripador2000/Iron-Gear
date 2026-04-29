import React from 'react';
import styles from './PharmacologyPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology') => void;
}

const pharmacologyProducts: Product[] = [
  {
    id: '1',
    title: 'Neuro-Peak 500',
    price: 189.00,
    rating: 4.9,
    reviews: 342,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABYLMenPoer7wbg8-h_boQYjK8Ebn0t9TPtZnmSJKJBNCDHgoh6kOIGrjthlXG38IqlEFPmFABuIVJUvH9HtMcUedrjti00LDPEM95baC8rTM3PApheRTx56lFjMuWcAue86YjfQObjqeXnNxUn48BZ6opRrwW3wCla-l6VzuAnc-R2zfuPxTr5X8cWanhV6igvMTddPGfIOi_MQJf5-oBjrR02T3b5XguxoC7N6vSi9mW1alel6JsN2MSxjttpzKL-MRjbQOs4Jma',
    imageAlt: 'Neuro-Peak 500',
    brand: 'Cognitive Support',
    isPremium: true
  },
  {
    id: '2',
    title: 'Iso-Recovery RX',
    price: 145.00,
    rating: 4.8,
    reviews: 218,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2xTOPmZNtDsZHAvs-xjyUIuoKmcUOGdcikY0WJ8-qkLvCXKDyQowv4gvP7_CPo0G9TajSAqjz0ZAzUi5lkhArx7ivWGCPG33jO7X0zCUOPysfTpPIvdqRfqaw_6gZe9SWQ0qxGOfKX4y60hNYTSjZobDnmU8IiOn_Cn645OnwC9s6vBRA4_nVdLoez-7MiobCx3Syj7Ihl-spzgAdGRiDXlsKqc67zh3NGG-KBAOt7jTjsagjPXFHoztJlnDoYL0vsTslFwBRCxgZ',
    imageAlt: 'Iso-Recovery RX',
    brand: 'Intense Recovery'
  },
  {
    id: '3',
    title: 'Anabolic Primer',
    price: 312.00,
    rating: 4.7,
    reviews: 156,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx5HIWSvL_kDFOvVUbpmeaVak7beZo0_fjQ6NJg0qKDkl6zh-nQUDP293qCjYmaIbsBTzbwh2hoV_PreYnZnwhHW7TyET4FQlJzgfRuVoCjjEvSsp2hmH3dhceVdpF16L4SD7Dofhr2-SQxyl-K5Qz11R87FmPp6Fm9XDafxf2VnScxCL9LY2dSWzHAxDXoCmfrwiOtqVKRoF0QjyBZMP_q_IF03a-kD01PGH8mVrWm7adg7sywrClrZOVY7N0c8kek6hwQ_BVSRBx',
    imageAlt: 'Anabolic Primer',
    brand: 'Hormonal Optimization'
  },
  {
    id: '4',
    title: 'HGH Supp-Max',
    price: 450.00,
    rating: 4.6,
    reviews: 89,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVzi70SosQ3IPnIVSGjFJEz74FDnPhZlPPWYa4lOJQdb0WzZseiG7D-07EO7CZn6iq73B6XI8jD5eEnSOjLhF5vQXQwyVLGabEPgu62P-lRsplBZc9_aY5zospJDGCcFI03JoJEmYITO71PQBwuj_ew_WWhovIuMwuyiScRW5UG878BcQQhkaEDrsMf5VrPWii2mHzEP9nSFGSBpBZLJuXP3DYY74m5-ozhclQk0TDDitqBeqOVlvH5yf_aGJTvJSImUXP1is053P',
    imageAlt: 'HGH Supp-Max',
    brand: 'Growth Factor'
  }
];

export const PharmacologyPage: React.FC<Props> = ({ currentPage = 'pharmacology', onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.heroBanner}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVaR-IHY98Czm9Yyq_Psl6ag4Zg8RhdSxKhxurHyD9ol7LLlQKQEB23FC7BliUkeD31sdIME9_tZj-igl_9a3tXf0wglDU1pTvedskPFpkV7cPFIlYMHuLmQBPtjH58DUwv-19lCm-00nCdlZ9zoMV5-8vhaEkVaA7Cs3nPqSfr8B33ReqR3QHp4OSzWZXIAJNir_TsQ3D0Qa6tbvRV7W9mfvZzTQbm4hj4rWo0zj_Aq873NKgBJYJ9iLD08d6Ids-YAnMfVgMCWx" 
              alt="Clinical laboratory" 
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>Performance Enhancement</span>
              <h1 className={styles.heroTitle}>Advanced Pharmacological Support</h1>
            </div>
          </div>

          <div className={styles.productGrid}>
            {pharmacologyProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.imageAlt} 
                    className={styles.productImage}
                  />
                  <div className={styles.quickAdd}>
                    <button className={styles.quickAddButton}>
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h4 className={styles.productTitle}>{product.title}</h4>
                  <p className={styles.productBrand}>{product.brand}</p>
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