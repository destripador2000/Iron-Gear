import React, { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../../../infrastructure/api/orderService';
import type { Order, OrderStatus } from '../../../../domain/orders/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '../../../../domain/orders/types';
import styles from './SalesView.module.css';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'pendiente': return styles.statusPending;
    case 'enviado': return styles.statusShipped;
    case 'entregado': return styles.statusDelivered;
    default: return styles.statusPending;
  }
};

export const SalesView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await orderService.getOrders();
    if (res.data) {
      setOrders(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const res = await orderService.updateOrderStatus(orderId, newStatus);
    if (!res.error) {
      fetchOrders();
    } else {
      setError(res.error);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    const blob = await orderService.downloadInvoice(orderId);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ventas y Pedidos</h1>
        <button className={styles.refreshBtn} onClick={fetchOrders}>
          Actualizar
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>No hay pedidos</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className={styles.clientInfo}>
                      <span className={styles.clientName}>
                        {order.user?.name || 'Cliente'}
                      </span>
                      <span className={styles.clientEmail}>
                        {order.user?.email || '-'}
                      </span>
                    </div>
                  </td>
                  <td className={styles.date}>
                    {formatDate(order.created_at)}
                  </td>
                  <td className={styles.total}>
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.downloadBtn}`}
                        onClick={() => handleDownloadInvoice(order.id)}
                      >
                        Factura
                      </button>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detalles del Pedido #{selectedOrder.id}</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                &times;
              </button>
            </div>

            <div className={styles.orderDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Cliente</span>
                <span className={styles.detailValue}>
                  {selectedOrder.user?.name || 'Cliente'} ({selectedOrder.user?.email})
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha</span>
                <span className={styles.detailValue}>
                  {formatDate(selectedOrder.created_at)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Estado</span>
                <span className={styles.detailValue}>
                  {ORDER_STATUS_LABELS[selectedOrder.status as OrderStatus]}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Total</span>
                <span className={styles.detailValue}>
                  {formatCurrency(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

            <h3 className={styles.itemsTitle}>Artículos</h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map(item => (
                  <tr key={item.id}>
                    <td className={styles.itemProduct}>
                      {item.product?.name || `Producto #${item.product_id}`}
                    </td>
                    <td>{item.quantity}</td>
                    <td className={styles.itemPrice}>
                      {formatCurrency(item.frozen_price)}
                    </td>
                    <td className={styles.itemSubtotal}>
                      {formatCurrency(item.frozen_price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.modalFooter}>
              <button
                className={`${styles.modalBtn} ${styles.btnSecondary}`}
                onClick={() => handleDownloadInvoice(selectedOrder.id)}
              >
                Descargar Factura
              </button>
              <button
                className={`${styles.modalBtn} ${styles.btnPrimary}`}
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};