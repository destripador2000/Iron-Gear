import React, { useEffect, useState, useCallback } from 'react';
import { reportsService } from '../../../../infrastructure/api/reportsService';
import type { SalesReport, TopProduct, TopClient, InventoryAlert } from '../../../../domain/reports/types';
import styles from './Overview.module.css';

interface OverviewData {
  sales: SalesReport | null;
  topProducts: TopProduct[] | null;
  topClients: TopClient[] | null;
  alerts: InventoryAlert[] | null;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewData>({
    sales: null,
    topProducts: null,
    topClients: null,
    alerts: null,
  });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [salesRes, topProductsRes, topClientsRes, alertsRes] = await Promise.all([
        reportsService.getSalesReport(),
        reportsService.getTopProducts(),
        reportsService.getTopClients(),
        reportsService.getInventoryAlerts(),
      ]);

      const hasError = salesRes.error || topProductsRes.error || topClientsRes.error || alertsRes.error;
      
      if (hasError) {
        setError(salesRes.error || topProductsRes.error || topClientsRes.error || alertsRes.error || 'Error al cargar datos');
      }

      setData({
        sales: salesRes.data,
        topProducts: topProductsRes.data,
        topClients: topClientsRes.data,
        alerts: alertsRes.data,
      });
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getMaxRevenue = (): number => {
    if (!data.topProducts || data.topProducts.length === 0) return 1;
    return Math.max(...data.topProducts.map(p => p.total_sold));
  };

  const getMaxSpent = (): number => {
    if (!data.topClients || data.topClients.length === 0) return 1;
    return Math.max(...data.topClients.map(c => c.order_count));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Resumen General</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.kpiSection}>
            <div className={styles.skeletonKpi} />
            <div className={styles.skeletonKpi} />
          </div>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Resumen General</h1>
        <div className={styles.errorBanner}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Resumen General</h1>

      <section className={styles.kpiSection}>
        <div className={`${styles.kpiCard} ${styles.highlight}`}>
          <div className={styles.kpiLabel}>Ventas Totales</div>
          <div className={styles.kpiValue}>
            {data.sales ? formatCurrency(data.sales.total_sales) : '$0'}
          </div>
          <div className={styles.kpiSubtext}>
            {data.sales ? `${data.sales.total_orders} pedidos en el período` : 'Sin datos'}
          </div>
        </div>

        <div className={`${styles.kpiCard} ${data.alerts && data.alerts.length > 0 ? styles.warning : ''}`}>
          <div className={styles.kpiLabel}>Productos en Alerta</div>
          <div className={styles.kpiValue}>
            {data.alerts ? data.alerts.length : 0}
          </div>
          <div className={styles.kpiSubtext}>
            {data.alerts && data.alerts.length > 0
              ? 'Stock mínimo alcanzado'
              : 'Sin alertas de inventario'}
          </div>
        </div>
      </section>

      <section className={styles.reportsSection}>
        <div className={styles.reportCard}>
          <h2 className={styles.reportCardTitle}>Top 5 Productos Más Vendidos</h2>
          {data.topProducts && data.topProducts.length > 0 ? (
            <div className={styles.topList}>
              {data.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.product_id} className={styles.topItem}>
                  <div className={styles.topRank}>{index + 1}</div>
                  <div className={styles.topInfo}>
                    <div className={styles.topName}>{product.name}</div>
                    <div className={styles.topBar}>
                      <div
                        className={styles.topBarFill}
                        style={{ width: `${(product.total_sold / getMaxRevenue()) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.topMeta}>
                    <span className={styles.topMetaValue}>{product.total_sold}</span>
                    <span className={styles.topMetaLabel}>vendidos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No hay datos de productos</div>
          )}
        </div>

        <div className={styles.reportCard}>
          <h2 className={styles.reportCardTitle}>Top 5 Clientes Frecuentes</h2>
          {data.topClients && data.topClients.length > 0 ? (
            <div className={styles.topList}>
              {data.topClients.slice(0, 5).map((client, index) => (
                <div key={client.user_id} className={styles.topItem}>
                  <div className={styles.topRank}>{index + 1}</div>
                  <div className={styles.topInfo}>
                    <div className={styles.topName}>{client.name}</div>
                    <div className={styles.topBar}>
                      <div
                        className={styles.topBarFill}
                        style={{ width: `${(client.order_count / getMaxSpent()) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.topMeta}>
                    <span className={styles.topMetaValue}>{client.order_count}</span>
                    <span className={styles.topMetaLabel}>pedidos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No hay datos de clientes</div>
          )}
        </div>
      </section>

      {data.alerts && data.alerts.length > 0 && (
        <section className={styles.alertsSection}>
          <h2 className={styles.alertsTitle}>Alertas de Stock Crítico</h2>
          <table className={styles.alertsTable}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.name}</td>
                  <td>{alert.stock}</td>
                  <td>10</td>
                  <td>
                    <span className={styles.stockBadge}>
                      Crítico
                      <span className={styles.stockValue}>({alert.stock})</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};