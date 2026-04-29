import React from 'react';
import styles from './SupplementsPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { type Product } from '../../../domain/product/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements') => void;
}

const supplementProducts: Product[] = [
  {
    id: '1',
    title: 'Whey Protein Isolate',
    price: 64.99,
    rating: 4.9,
    reviews: 1200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYqZICvkwV6YP0LWpQ1Go-OvP-V2r9J7sxt1LzFB4Eim5na3qTlK65uKIJZUwmIGZPBXDUNwEwPwuzpi07CxH7qA5f_mj6ThflC4qsqAnLZ_YZ43YnFSRLdqLXWJYxKAwIfjdF-_oeU2xoffAfNvOEkkHu9xgYn52YsTAqiIpkYDx2ThtUS-xvg-LBEt1_-DVSdGEIWV45gc7PV5mCUNF7KrQWZ_etGw68W2M-tuAu9n4tGXCt1mZ7R3OUhzg1Rni73IXUV8JCZYA',
    imageAlt: 'Premium Whey Protein Isolate',
    brand: 'Iron Gear Elite',
    isPremium: true
  },
  {
    id: '2',
    title: 'Creatine Monohydrate',
    price: 29.99,
    rating: 5.0,
    reviews: 845,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAimVVtb-Cek6Vl4ohZ8KDzsPQKIMqcLGph2QC_2h2Bu8Uo9giQszeARKwvG1WID8YWJl3DUfcq6snt-r1QEzCm8TTfBSFmr2TULQf1w9dWckFCxWAw-psknqw5xXul5pXPVSL3Vyv8IBElVlQIJum5J5Ff3nOJ8znKf2WcVdUbDef0VgouG93iUpRrFE1kciMvVkdCH_nii3CuaUUxBJLqZzmQ_wLH0-_ureQ44yb0P_0s6UBStzaH8m49GbGUkKuXZ-eUKDpNsjQ1',
    imageAlt: 'Creatine Monohydrate',
    brand: 'Performance Series'
  },
  {
    id: '3',
    title: 'Nitro Pre-Workout',
    price: 44.95,
    rating: 4.8,
    reviews: 612,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASlpZAprs56AR1IHsKQYNXtS6xOhiO4uoY3zNQL6y5BrNvAyLEnHU5PThTq6Pd2M3bDbsi3Pkh9ESz3fTfG7g81HPpuvrzCK7D0NNZ3O9fpWHhoW1qpDt_wWXejLfHOPah22IWIwfGiv3UUq7jLiNcxwJgS_P3GzQJ9EDB3UfM3CPOJfqBNQq47QuzUpSkk09duLeH74ow9fZP3vjgmIiTrvlb5ssYSHCGnDVdaznutU34pMnTRrofbr11gPLZb9eqSrUT7um-ZgOC',
    imageAlt: 'Pre-workout Nitro Boost',
    brand: 'Energy Matrix',
    isNew: true
  },
  {
    id: '4',
    title: 'BCAA 2:1:1 Complex',
    price: 34.50,
    rating: 4.7,
    reviews: 230,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnl4nJvHKXu_jkBLcW6CVrXfP41GppNDuEZhRgou-A7nlc8wAmP7JQs6DJIKEiDuEvKsFpt7v7-HgpsIY8nzaGY6lbgElhFF3A3N1TDV46pv_U0ni5yVH7n9YBf0ooKxJ3avmk_G-h1qGWp50cEGuAt-QwULx4EoGs_3aMByvFSxOTahsktjOJxEtQqGMlnOT6-wSBQLp_MZeyn_in2sOBy7lv652IBts9CEy8ESF6PLlr_nexdWUjTu3LJ5FIZeMtnPFuiFibo_4H',
    imageAlt: 'BCAA 2:1:1 Recover',
    brand: 'Recovery Fuel'
  },
  {
    id: '5',
    title: 'Men Multi Elite',
    price: 24.99,
    rating: 4.9,
    reviews: 450,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZdiIVBWXEvkSHcQO7hzL9vZD85Mj4XTCrOZ3rbV_XR9gR65cYzgwNGbKwz4WG6FDcJA8jD4Bvptpmnh6UNR62F7s2UMSiJ-rrAIEqvPEfUqg1ZsVzA8QI-puhCz6PMzx1souqlgdD836hXWDkdcjkER9hsZJlvMfSVDZFbkHBUjJhAhB0BRd73YrMUmS_yUp5A7MPkm_C9EPEdQOCGzuo-7qMiz3hNFTntv8XzsGt9H5CuNFp_qGpESnBbFAlOwIyipkffMk6HxUH',
    imageAlt: 'Daily Multivitamins',
    brand: 'Wellness Essential'
  }
];

export const SupplementsPage: React.FC<Props> = ({ currentPage = 'supplements', onNavigate }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className={styles.pageContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.categoryHeader}>
            <h1 className={styles.categoryTitle}>Suplementos</h1>
          </div>
          <div className={styles.productGrid}>
            {supplementProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <img src={product.imageUrl} alt={product.imageAlt} className={styles.productImage} />
                  <div className={styles.quickAdd}>
                    <button className={styles.quickAddButton}>
                      <span className="material-symbols-outlined">shopping_cart</span>
                      AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productBrand}>{product.brand}</span>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>{String(product.price)}</p>
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