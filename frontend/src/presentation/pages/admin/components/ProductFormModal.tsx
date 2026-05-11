import React, { useState } from 'react';
import type { Product } from '../../../../domain/product/types';
import styles from './ProductFormModal.module.css';

interface Props {
  title: string;
  product?: Product;
  onSubmit: (data: FormData) => Promise<{ error?: string } | null>;
  onClose: () => void;
}

export const ProductFormModal: React.FC<Props> = ({ title, product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    category: product?.category || '',
    distributor_id: product?.distributor_id?.toString() || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['mancuernas', 'barras', 'ropa', 'máquinas', 'suplementos', 'farmacología'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.price || !formData.category || !formData.distributor_id) {
      setError('Los campos Nombre, Precio, Categoría y Distribuidor son requeridos');
      return;
    }

    setIsSubmitting(true);

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name.trim());
    formDataObj.append('description', formData.description.trim() || '');
    formDataObj.append('price', formData.price);
    formDataObj.append('stock', formData.stock);
    formDataObj.append('category', formData.category);
    formDataObj.append('distributor_id', formData.distributor_id);
    
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    const result = await onSubmit(formDataObj);
    if (result?.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Imagen del producto</label>
            <div className={styles.imageUpload}>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción opcional del producto"
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Precio *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stock">Stock Inicial</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Categoría *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="distributor_id">ID Distribuidor *</label>
              <input
                id="distributor_id"
                name="distributor_id"
                type="number"
                min="1"
                value={formData.distributor_id}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Guardando...
                </>
              ) : (
                product ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};