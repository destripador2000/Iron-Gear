import React from 'react';
import styles from './QuantityControl.module.css';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
}) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        type="button"
      >
        -
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        className={styles.button}
        onClick={onIncrease}
        disabled={disabled}
        type="button"
      >
        +
      </button>
    </div>
  );
};
