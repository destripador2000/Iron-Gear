import React from 'react';
import styles from './CheckoutOrderSummary.module.css';
import type { CartItem, CartSummary } from '../../../../domain/cart/types';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  summary: CartSummary;
  onCheckout: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  items,
  summary,
  onCheckout,
  disabled = false,
  isProcessing = false,
}) => {
  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Resumen del Pedido</h2>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <img
              src={item.imageUrl || 'https://via.placeholder.com/80'}
              alt={item.imageAlt || item.name}
              className={styles.itemImage}
            />
            <div className={styles.itemInfo}>
              <h4 className={styles.itemTitle}>{item.name}</h4>
              <p className={styles.itemQuantity}>Cantidad: {item.quantity}</p>
              <p className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totals}>
        <div className={styles.line}>
          <span>Subtotal</span>
          <span>{summary.subtotal.toFixed(2)} €</span>
        </div>
        <div className={styles.line}>
          <span>Envío</span>
          <span className={styles.freeShipping}>
            {summary.shipping === 0 ? 'Gratis' : `${summary.shipping.toFixed(2)} €`}
          </span>
        </div>
        <div className={styles.line}>
          <span>IVA (21%)</span>
          <span>{summary.tax.toFixed(2)} €</span>
        </div>
        <div className={styles.totalLine}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{summary.total.toFixed(2)} €</span>
        </div>
      </div>

      <button
        className={`${styles.checkoutBtn} ${isProcessing ? styles.processing : ''}`}
        onClick={onCheckout}
        disabled={disabled || isProcessing}
        type="button"
      >
        {isProcessing ? (
          <>
            <span className={styles.spinner}></span>
            Procesando...
          </>
        ) : (
          'Finalizar Compra'
        )}
      </button>

      <div className={styles.trustBadge}>
        <span className="material-symbols-outlined">verified_user</span>
        <span>Pago 100% Seguro</span>
      </div>
    </aside>
  );
};