import React from 'react';
import styles from './ShippingForm.module.css';
import { FormInput } from '../../../components/form/FormInput';
import type { ShippingData } from '../../../../domain/checkout/types';

interface ShippingFormProps {
  data: ShippingData;
  onChange: (field: keyof ShippingData, value: string) => void;
  error?: string;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ data, onChange, error }) => {
  const handleChange = (field: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={`material-symbols-outlined ${styles.icon}`}>local_shipping</span>
        <h2 className={styles.title}>Información de Envío</h2>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.halfWidth}>
          <FormInput
            label="Nombre"
            placeholder="Ej: Juan"
            value={data.firstName}
            onChange={handleChange('firstName')}
          />
        </div>

        <div className={styles.halfWidth}>
          <FormInput
            label="Apellidos"
            placeholder="Ej: Pérez"
            value={data.lastName}
            onChange={handleChange('lastName')}
          />
        </div>

        <div className={styles.fullWidth}>
          <FormInput
            label="Dirección de Entrega"
            placeholder="Calle, número, piso, puerta"
            value={data.address}
            onChange={handleChange('address')}
          />
        </div>

        <div className={styles.halfWidth}>
          <FormInput
            label="Ciudad"
            placeholder="Madrid"
            value={data.city}
            onChange={handleChange('city')}
          />
        </div>

        <div className={styles.halfWidth}>
          <FormInput
            label="Código Postal"
            placeholder="28001"
            value={data.postalCode}
            onChange={handleChange('postalCode')}
          />
        </div>
      </div>
    </section>
  );
};