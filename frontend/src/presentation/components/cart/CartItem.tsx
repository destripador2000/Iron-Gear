import React from 'react';
import styles from './CartItem.module.css';
import { QuantityControl } from './QuantityControl';
import type { CartItem as CartItemType } from '../../../domain/cart/types';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  disabled?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  disabled = false,
}) => {
  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const formatDetails = () => {
    const parts = [item.category];
    if (item.description) {
      parts.push(item.description);
    }
    return parts.join(' | ');
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.info}>
            <h3 className={styles.name}>{item.name}</h3>
            <p className={styles.details}>{formatDetails()}</p>
          </div>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            disabled={disabled}
          />
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            type="button"
          >
            <span className="material-symbols-outlined">delete</span>
            <span>ELIMINAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
