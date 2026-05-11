import React, { useState, useEffect } from 'react';
import { productAdminService } from '../../../../infrastructure/api/productAdminService';
import type { Product } from '../../../../domain/product/types';
import { ProductFormModal } from './ProductFormModal';
import { RestockModal } from './RestockModal';
import styles from './ProductsView.module.css';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const result = await productAdminService.getProducts();
    if (result.error || !result.data) {
      setError(result.error || 'Error al cargar productos');
    } else {
      setProducts(result.data);
    }
    setLoading(false);
  };

  // Eliminar producto
  const handleDelete = async (product: Product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    const result = await productAdminService.deleteProduct(product.id);
    if (result.error) {
      setError(result.error);
    } else {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  // Abrir modal de editar
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Abrir modal de reabastecer
  const handleRestock = (product: Product) => {
    setSelectedProduct(product);
    setShowRestockModal(true);
  };

  // Crear producto
  const handleCreate = async (formData: FormData) => {
    const result = await productAdminService.createProduct(formData);
    if (result.error || !result.data) {
      return { error: result.error || 'Error al crear' };
    }
    setProducts(prev => [...prev, result.data!]);
    setShowCreateModal(false);
    return null;
  };

  // Actualizar producto
  const handleUpdate = async (formData: FormData) => {
    if (!selectedProduct) return { error: 'No hay producto seleccionado' };
    const result = await productAdminService.updateProduct(selectedProduct.id, formData);
    if (result.error || !result.data) {
      return { error: result.error || 'Error al actualizar' };
    }
    setProducts(prev => prev.map(p => p.id === result.data!.id ? result.data! : p));
    setShowEditModal(false);
    setSelectedProduct(null);
    return null;
  };

  // Reabastecer producto
  const handleRestockSubmit = async (quantity: number) => {
    if (!selectedProduct) return { error: 'No hay producto seleccionado' };
    const result = await productAdminService.restockProduct(
      selectedProduct.id,
      selectedProduct.distributor_id,
      quantity
    );
    if (result.error || !result.data) {
      return { error: result.error || 'Error al reabastecer' };
    }
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: result.data!.new_stock } : p
    ));
    setShowRestockModal(false);
    setSelectedProduct(null);
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
          <button onClick={loadProducts}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gestión de Productos</h2>
        <button className={styles.addButton} onClick={() => setShowCreateModal(true)}>
          <span className="material-symbols-outlined">add</span>
          Añadir Producto
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img
                    src={(product as unknown as { image_url?: string }).image_url || 'https://placehold.co/80x80/e5e7eb/9ca3af?text=Sin+imagen'}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/e5e7eb/9ca3af?text=Sin+imagen';
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  <span className={styles.categoryBadge}>{product.category}</span>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`${styles.stock} ${product.stock <= 5 ? styles.low : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleRestock(product)}
                      title="Reabastecer"
                    >
                      <span className="material-symbols-outlined">inventory</span>
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleEdit(product)}
                      title="Editar"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(product)}
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className={styles.empty}>
            <span className="material-symbols-outlined">inventory_2</span>
            <p>No hay productos registrados</p>
            <button onClick={() => setShowCreateModal(true)}>Añadir el primero</button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <ProductFormModal
          title="Añadir Producto"
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selectedProduct && (
        <ProductFormModal
          title="Editar Producto"
          product={selectedProduct}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showRestockModal && selectedProduct && (
        <RestockModal
          productName={selectedProduct.name}
          currentStock={selectedProduct.stock}
          onSubmit={handleRestockSubmit}
          onClose={() => {
            setShowRestockModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};