import React from 'react';
import styles from './AddToCartButton.module.css';
import { useCart } from '../../../infrastructure/context/CartContext';
import type { Product } from '../../../domain/product/types';

interface AddToCartButtonProps {
  product: Product;
  imageUrl: string;
  imageAlt: string;
  quantity?: number;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  imageUrl,
  imageAlt,
  quantity = 1,
  className = '',
}) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const isAdded = isInCart(product.id);
  const currentQty = getItemQuantity(product.id);
  const isOutOfStock = product.stock === 0;

  const handleClick = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, imageUrl, imageAlt);
    }
  };

  if (isOutOfStock) {
    return (
      <button className={`${styles.button} ${styles.outOfStock} ${className}`} type="button" disabled>
        <span className="material-symbols-outlined">block</span>
        Agotado
      </button>
    );
  }

  if (isAdded) {
    return (
      <button className={`${styles.button} ${styles.added} ${className}`} type="button" disabled>
        <span className="material-symbols-outlined">check</span>
        {currentQty} en carrito
      </button>
    );
  }

  return (
    <button className={`${styles.button} ${className}`} onClick={handleClick} type="button">
      <span className="material-symbols-outlined">shopping_cart</span>
      AGREGAR AL CARRITO
    </button>
  );
};
