import React from 'react';
import styles from './MachinesPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements') => void;
}

const machineProducts: Product[] = [
  {
    id: '1',
    title: 'IronPress X900 Pro Leg Press',
    price: 2499.00,
    rating: 5,
    reviews: 48,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFwxvMsaEqLmiRQklAzU4YgTUr_FDHUGJpC_eBXzQg01-I_mtxQSbEjUuipKpB8Eppspn2s-SQjPjYs4j4aHhKtei1xtCnUt-JS_3mNAJiWW-itP4Wd0UVa5DRZebkehUTpRX6p8oFOw7b-TYj6hXqXVOVW-CJg187E70rq-Yo1IRkr8B5ncr-5sowInMhFnbNcRUXhZuZFZ2wcxN-RARFRdEl6Z9o-9Z9NoUzXjPlcLE9FMtMo7tSlQEm55TBh4EsXFQamOmOIJV',
    imageAlt: 'Prensa de Piernas Profesional',
    isPremium: true
  },
  {
    id: '2',
    title: 'Titan Series Smith Machine',
    price: 1850.00,
    rating: 4,
    reviews: 32,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx-AjkAcRCpC-7l4xTfz3AtTAFa2xGctzNV4S75ZGy3a55kz49fxhca0hO8STNVpnOrbkpKlQgqxCnKCBU30e_0n13GX3Gdi2plw-o5Xy4AIFdqgt5gBuI5VEp-2euFqPqNhxyteO9_eFUEhKpV6LC372ezAvJR1NJromfsctqKoZUUT_1fmIuPIrRnmLU41sShTMFzSCs9Q4To9i_N0YSCjT3KWOswpqUPBrs6ZqLl3ezCapz5qP0VEXWy6-gkSFtnQnAuUPOlV9U',
    imageAlt: 'Máquina Smith Premium'
  },
  {
    id: '3',
    title: 'Dual Pulley Functional Station',
    price: 3200.00,
    rating: 5,
    reviews: 56,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVfV3eDywlgrxgLV5P9ugbUgkHcUWeSKArBWwEj78xrDl1kn71mb5TWPThx5om_rPh1HyUlfx8wJ3rAzLHKQCwdhT2ISCAuAkAwnR1Yg1kv5p5PCnqL3TBKLu2dQx7cWPntWdL1FoJHhdMPEvo85qznp_lNUpAlcfQXWJEUvdk6vNidckuGQD9C5td2uT9NyrdKXl-gLo5pUctWib4kmzojaNHJfqkQ_NsSr9GMQu-6uGyMbkPnevACcPN_yqqyFKJ8c6txXlWQuLU',
    imageAlt: 'Rack de Poleas Dual'
  },
  {
    id: '4',
    title: 'Dorian Row Seated Station',
    price: 1250.00,
    rating: 5,
    reviews: 19,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA_AS6ulpuASSsJqBDd1GifQ7cCJKsXgJ_Qbj1D77c0ICL6N1NRv_3NRE7588jtIj2gUa6jmxP_0M_NlIb2OK6nppi4nY9ju9CW0V0RIEJkL_I1I8q7ZuSQZJJZ30-DGtqA168BTyaraPWtwlIxfy7fDtQ65lUXpFRXm5RJ9Gmtl9-d9k6ApzqrOjzEz_6FVgErPlcskMqV8vmd2rmXHm-UI8_5IKcQTniMeDdPCdKOsi38sre4LF76qVyXHjfHRy3VE0bgH-kujiv',
    imageAlt: 'Máquina Remo Sentado'
  },
  {
    id: '5',
    title: 'QuadMaster Elite Extension',
    price: 990.00,
    rating: 4,
    reviews: 24,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5pnFN3VvO7loz2jzkhDgfS1UQMmUu5jTRP_8tkWQxPKFWdcBKbdTQmVVuBXxfRtIdcYLBKmWkIX0-2ltvKkDLMeAPnCXRT0PPGuDfO-_tS02Ki92rKeFaij3J9vLq3X1-6LNXo9qiCOQGP3l9AcmBxm-P-BaQlyYuoQHQO8vC9WnoQSnIpjAA27xf5E_SKKgf9CmyYZMr4hyuMtzNypv06244DPacHKNMwXHBd_lunmKnbrh6w0YZpbQysCxCUvcUVOhA6DkWrJDw',
    imageAlt: 'Extensión de Cuádriceps'
  },
  {
    id: '6',
    title: 'IronPec Dual Function Fly',
    price: 1450.00,
    rating: 5,
    reviews: 41,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7PLwjYbqhHLpd9gnIoQ5S0sQoklI62-I7gwAqyvUW1jRGVIOOUcQs8fNi_wYSs-tOFfD5cSPdRQTYmCE_dZJm1LmVphzZDFnFj0xbAYaUUA2h5bgnOEoSMC2VYjAGKmYKUftb8-B4aD-rlMRC_KA07HkkRmE46WtXmg3wqkPH0J8rYZCY11d77rm2mPpBTfpIWMIv1gtqaaRYbaCId5S8Zm1DDCbdAvWATYG8PtVyH7Kgdh-jqcKf6CkE866xl21hWi4CdHAQKfq3',
    imageAlt: 'Pec Deck Fly'
  }
];

export const MachinesPage: React.FC<Props> = ({ currentPage = 'machines', onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.categoryHeader}>
            <h1 className={styles.categoryTitle}>Maquinaria</h1>
          </div>

          <div className={styles.productGrid}>
            {machineProducts.map((product) => (
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