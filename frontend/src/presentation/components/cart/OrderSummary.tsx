import React, { useState } from 'react';
import styles from './OrderSummary.module.css';
import type { CartSummary as CartSummaryType } from '../../../domain/cart/types';

interface OrderSummaryProps {
  summary: CartSummaryType;
  onCheckout: () => void;
  disabled?: boolean;
}

const paymentIcons = ['credit_card', 'account_balance', 'contactless'];

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  summary,
  onCheckout,
  disabled = false,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode);
      setPromoCode('');
    }
  };

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Resumen de Pedido</h2>

      <div className={styles.lines}>
        <div className={styles.line}>
          <span>Subtotal</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.line}>
          <span>Envío</span>
          <span>${summary.shipping.toFixed(2)}</span>
        </div>
        <div className={styles.line}>
          <span>Impuestos (Estimados)</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>${summary.total.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.checkoutBtn}
          onClick={onCheckout}
          disabled={disabled}
          type="button"
        >
          <span>Proceder al Pago</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <div className={styles.promoSection}>
          <p className={styles.promoLabel}>Código Promocional</p>
          <div className={styles.promoRow}>
            <input
              type="text"
              className={styles.promoInput}
              placeholder="INTRODUCE CÓDIGO"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={disabled || appliedPromo !== null}
            />
            <button
              className={styles.promoBtn}
              onClick={handleApplyPromo}
              disabled={disabled || appliedPromo !== null}
              type="button"
            >
              APLICAR
            </button>
          </div>
          {appliedPromo && (
            <p className={styles.promoApplied}>Código {appliedPromo} aplicado</p>
          )}
        </div>
      </div>

      <div className={styles.paymentIcons}>
        {paymentIcons.map((icon) => (
          <span key={icon} className={`material-symbols-outlined ${styles.paymentIcon}`}>
            {icon}
          </span>
        ))}
      </div>
    </aside>
  );
};
