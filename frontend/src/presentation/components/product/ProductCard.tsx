import React from 'react';
import styles from './ProductCard.module.css';
import {type Product } from '../../../domain/product/types';

interface Props {
  product: Product;
  isFeatured?: boolean;
}

export const ProductCard: React.FC<Props> = ({ product, isFeatured }) => {
  return (
    <article className={`${styles.card} ${isFeatured ? styles.featured : ''}`}>
      <div className={styles.imageContainer}>
        <img src={product.imageUrl} alt={product.imageAlt} className={styles.image} />
        {product.isPremium && <span className={styles.premiumBadge}>PREMIUM</span>}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.rating}>
            <span className="material-symbols-outlined">star</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {isFeatured && product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button className={styles.addToCartBtn}>
            <span className="material-symbols-outlined">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
};
