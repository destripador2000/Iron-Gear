import React from 'react';
import styles from './PaymentSection.module.css';
import { FormInput } from '../../../components/form/FormInput';
import type { PaymentMethod, CardData } from '../../../../domain/checkout/types';

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  cardData: CardData;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCardDataChange: (field: keyof CardData, value: string) => void;
  error?: string;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  cardData,
  onPaymentMethodChange,
  onCardDataChange,
  error,
}) => {
  const handleCardChange = (field: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onCardDataChange(field, e.target.value);
  };

  const isCardSelected = paymentMethod === 'tarjeta';

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={`material-symbols-outlined ${styles.icon}`}>payments</span>
        <h2 className={styles.title}>Método de Pago</h2>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.options}>
        <label
          className={`${styles.option} ${isCardSelected ? styles.optionSelected : ''}`}
        >
          <input
            type="radio"
            name="payment"
            value="tarjeta"
            checked={isCardSelected}
            onChange={() => onPaymentMethodChange('tarjeta')}
            className={styles.radio}
          />
          <div className={styles.optionContent}>
            <div className={styles.optionHeader}>
              <span className={styles.optionTitle}>Tarjeta de Crédito / Débito</span>
              <span className={`material-symbols-outlined ${styles.optionIcon}`}>credit_card</span>
            </div>

            {isCardSelected && (
              <div className={styles.cardFields}>
                <div className={styles.cardFieldFull}>
                  <FormInput
                    label="Número de tarjeta"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={handleCardChange('number')}
                  />
                </div>
                <div className={styles.cardFieldHalf}>
                  <FormInput
                    label="MM/YY"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={handleCardChange('expiry')}
                  />
                </div>
                <div className={styles.cardFieldHalf}>
                  <FormInput
                    label="CVV"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCardChange('cvv')}
                  />
                </div>
              </div>
            )}
          </div>
        </label>

        <label
          className={`${styles.option} ${!isCardSelected ? styles.optionSelected : ''}`}
        >
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={!isCardSelected}
            onChange={() => onPaymentMethodChange('paypal')}
            className={styles.radio}
          />
          <div className={styles.paypalOption}>
            <span className={styles.paypalTitle}>PayPal</span>
            <span className={`material-symbols-outlined ${styles.optionIcon}`}>account_balance_wallet</span>
          </div>
        </label>
      </div>
    </section>
  );
};