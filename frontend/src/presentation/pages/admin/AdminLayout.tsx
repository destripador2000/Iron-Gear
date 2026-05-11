import React, { useState } from 'react';
import styles from './AdminLayout.module.css';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';
import { hasPermission, UserRoles } from '../../../domain/auth/roles';
import { AdminSidebar } from './components/AdminSidebar';
import { AccessDenied } from './components/AccessDenied';
import { ProductsView } from './components/ProductsView';
import { Overview } from './components/Overview';

interface AdminLayoutProps {
  currentSection?: 'summary' | 'products' | 'sales' | 'admin';
  onNavigate?: (section: 'summary' | 'products' | 'sales' | 'admin') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentSection = 'products', onNavigate }) => {
  const { user } = useAuthContext();
  const [internalSection, setInternalSection] = useState<'summary' | 'products' | 'sales' | 'admin'>(currentSection);

  const activeSection = onNavigate ? currentSection : internalSection;

  const handleNavigate = (section: 'summary' | 'products' | 'sales' | 'admin') => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      setInternalSection(section);
    }
  };

  // Verificar permisos y renderizar sección
  const renderSection = (section: 'summary' | 'products' | 'sales' | 'admin') => {
    const permissionMap: Record<string, 'canViewSummary' | 'canViewProducts' | 'canViewSales' | 'canViewAdmin'> = {
      summary: 'canViewSummary',
      products: 'canViewProducts',
      sales: 'canViewSales',
      admin: 'canViewAdmin',
    };

    const requiredPermission = permissionMap[section];

    if (user && !hasPermission(user.role, requiredPermission)) {
      return <AccessDenied />;
    }

    switch (section) {
      case 'summary':
        return <SummaryView />;
      case 'products':
        return <ProductsView />;
      case 'sales':
        return <SalesView />;
      case 'admin':
        return <AdminSectionView />;
      default:
        return <ProductsView />;
    }
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar
        currentSection={activeSection}
        onNavigate={handleNavigate}
        userRole={user?.role || UserRoles.CLIENT}
      />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              {activeSection === 'summary' && 'Resumen'}
              {activeSection === 'products' && 'Productos'}
              {activeSection === 'sales' && 'Ventas'}
              {activeSection === 'admin' && 'Administración'}
            </h1>
            {user && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
            )}
          </div>
        </header>
        <div className={styles.content}>
          {renderSection(activeSection)}
        </div>
      </main>
    </div>
  );
};

const SummaryView: React.FC = () => <Overview />;

const SalesView: React.FC = () => (
  <div className={styles.dummyView}>
    <h2>Historial de Ventas</h2>
    <p>Ver todas las órdenes, estado de envíos y transacciones.</p>
  </div>
);

const AdminSectionView: React.FC = () => (
  <div className={styles.dummyView}>
    <h2>Administración</h2>
    <p>CRUD de usuarios, proveedores y configuración del sistema.</p>
  </div>
);