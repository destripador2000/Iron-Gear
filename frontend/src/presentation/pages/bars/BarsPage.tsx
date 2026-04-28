import React from 'react';
import styles from './BarsPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars') => void;
}

const barProducts: Product[] = [
  {
    id: '1',
    title: 'Barra Olímpica de 20kg (Acero Cromo)',
    price: 349.99,
    rating: 5,
    reviews: 89,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm8Q4r__XOd10pS4qMbXL2DrqeiBuaa1U7yy2oOIc7Xqw8jubTmmW4JYPe9zWi6pP6QlyEJnjPPB16WHiO8s3E1Hkl11_BgkUKlcNBlmaIo8nzNCSahQSJaRybHgT6FAjRL2QA6tqAfuysFd3AB_S0FoUO8yQTNxmCHr5m81WUaSJ7MtUZYxfD3HOJv0atxLYixiF1c-sPtapRrIM0QypBYsOKfEKGagLFsAO_UNuMavJGwpUsSQ1MUAy-ObIkXWFv26hzc-tgAlvr',
    imageAlt: 'Barra Olímpica de 20kg'
  },
  {
    id: '2',
    title: 'Barra Z Profesional',
    price: 129.50,
    rating: 4,
    reviews: 45,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL6EVG4-WRLvavwtroiuFmQEI0_8Ue2f9JPn4SJ1CKZeiPWhF2psgNpyENDO-gYpxlg9fbLmyW-gbFQcPmDBwH8UfDGbYUBBAEXDAreMN7q20BAM0Tt_7w0dW40QBlLgRGlMCUDKjyFdj8EyBasYNN52oJHNfYp7r1UrtiTW7g7sqC1zd9pwCTeljnqkOeN-w6IJOIRzk43nQXaFE4MbMVpIgZLucPVcMSz8rf_BzZ2Ck_GAhu_ILl9aPojJ6-B7CDr0FfHkiPAzcq',
    imageAlt: 'Barra Z Profesional'
  },
  {
    id: '3',
    title: 'Barra Hexagonal (Trap Bar)',
    price: 285.00,
    rating: 5,
    reviews: 67,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBos5YfEaThT3EX_SU41lVJxt3ijTGPesvvCaH5FzvQ6aEFb04WYJfjzaaCTq_FuS_eY1RtGI8IMjpDj95xDBKuvEq9wBHuSmJecsO_HBQGtmS2MfoiCNCIyCEsCrZVKovN9h7p7GlsDXWbf40pzEmcxdwFIN2-onBZn0TXT_hwyM9FYijv-YaHfKiRUUhiVLoxvHLqB41PEDJrZ21PKYPiJCFtbdZtZlys2Knb-WjQcrnuWHxAuNZZA7l0OP73ZbbzTZUqsmAun_iy',
    imageAlt: 'Barra Hexagonal'
  },
  {
    id: '4',
    title: 'Barra Powerlifting (Rígida)',
    price: 399.00,
    rating: 5,
    reviews: 112,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVxBVRb3l2bnRPOF8g83q1xZz8KtRYbZG9wOZsy-U4d7sqEo9kkbdBFjTHenomFN8RDFp8nC90W03JQ0g8uiC9Q7KZxwbxsUFIpe2XepB3_H8qNQCQErYJntGFEv-MtPtUceyK42m-B5V7zw0yR8vSezF2R8PvN_VwTPhj2zLs6fYyQY3Odi776WjQs_MggMeL4OgofmkEuGqbB3bm5kWN7nBsb-23mPc2n5w2AcS59uPn9UEYwG0J_mTcG_2IxdC6DjJ8m5kACJMK',
    imageAlt: 'Barra Powerlifting'
  },
  {
    id: '5',
    title: 'Barra para Curl de Bíceps',
    price: 89.00,
    rating: 4,
    reviews: 38,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoyy-UAOa1vBfzxZmDeENxOpgBGW2SbPErEdw7smdMyIjN6AyHSOElfH8nWKMHiehAxodKlMl9a1h2gi6MWkLURgzqMHgP-rOiCon4ZugD-otEAY-DxeyIR3tJU3wUWTrYQwFWnUF1NqzFm6ENQwwSvSOvct-G2ost9B917bqMdHtBq-DffmPvHJUnsBG4Cq24EGXLQeIDGqkFFAOy5gBuYn522n-Dl0fCOneKdAKrI6hmVq0-P3UTo2liiMTYcC6tAkYYeRLXonuL',
    imageAlt: 'Barra para Curl'
  },
  {
    id: '6',
    title: 'Juego de Seguros para Barra',
    price: 24.99,
    rating: 5,
    reviews: 203,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwRhX8AFtcrNEUNtPWfA5aOtUTpv0CAAEkLMq9wxUuY5YD2jdcXqYOgd4Jk41MsOUeL6WWojuHH5h8MoKji1xSAsqDwWF51xpcnpkDduVQJoK7XtssmNP3oLMuvsq4oc-f6xWOis-kYPyxmoY8M8I8-lMCnVUFezT2Ra8WIGd2HWGl5wcvRVLa_uADP90LjezQ3sIqqheiRMew2OYanR6yjTOyczBTVNVC9GR6mxsVGdJv0mn1C5E9zIFrwweuCjE2FJwAA5ZK6McE',
    imageAlt: 'Juego de Seguros'
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

export const BarsPage: React.FC<Props> = ({ currentPage = 'bars', onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.categoryHeader}>
            <h1 className={styles.categoryTitle}>Barras Olímpicas y Profesionales</h1>
          </div>

          <div className={styles.productGrid}>
            {barProducts.map((product) => (
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
                      Agregar al carrito
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.rating}>
                    {renderStars(product.rating)}
                  </div>
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