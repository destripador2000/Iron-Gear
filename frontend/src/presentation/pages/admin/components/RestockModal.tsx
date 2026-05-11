import React, { useState } from 'react';
import styles from './RestockModal.module.css';

interface Props {
  productName: string;
  currentStock: number;
  onSubmit: (quantity: number) => Promise<{ error?: string } | null>;
  onClose: () => void;
}

export const RestockModal: React.FC<Props> = ({ productName, currentStock, onSubmit, onClose }) => {
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Ingresa una cantidad válida mayor a 0');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(qty);
    if (result?.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Reabastecer Stock</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.productInfo}>
            <span className="material-symbols-outlined">inventory_2</span>
            <div>
              <p className={styles.productName}>{productName}</p>
              <p className={styles.currentStock}>Stock actual: <strong>{currentStock}</strong></p>
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="quantity">Cantidad a agregar</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ej: 50"
              required
              autoFocus
            />
          </div>

          <div className={styles.preview}>
            Nuevo stock: <strong>{currentStock + (parseInt(quantity) || 0)}</strong>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Agregando...
                </>
              ) : (
                'Reabastecer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};