import React from 'react';
import styles from './AdminSidebar.module.css';
import { hasPermission, UserRoles, type Permission } from '../../../../domain/auth/roles';

interface AdminSidebarProps {
  currentSection: string;
  onNavigate: (section: 'summary' | 'products' | 'sales' | 'admin') => void;
  userRole: string;
}

interface NavItem {
  id: 'summary' | 'products' | 'sales' | 'admin';
  label: string;
  icon: string;
  permission: Permission;
  roles: readonly string[];
}

const navItems: NavItem[] = [
  { id: 'summary', label: 'Resumen', icon: 'dashboard', permission: 'canViewSummary', roles: [UserRoles.ADMIN] },
  { id: 'products', label: 'Productos', icon: 'inventory_2', permission: 'canViewProducts', roles: [UserRoles.ADMIN, UserRoles.SELLER] },
  { id: 'sales', label: 'Ventas', icon: 'receipt_long', permission: 'canViewSales', roles: [UserRoles.ADMIN, UserRoles.SELLER] },
  { id: 'admin', label: 'Administración', icon: 'admin_panel_settings', permission: 'canViewAdmin', roles: [UserRoles.ADMIN] },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onNavigate,
  userRole,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>IRON GEAR</div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Panel</span>
        {navItems.map((item) => {
          // Ocultar enlace si el rol no tiene permiso
          if (!hasPermission(userRole, item.permission)) {
            return null;
          }

          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${currentSection === item.id ? styles.active : ''}`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.navItem}
          onClick={() => window.location.href = '/'}
          type="button"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Volver al Sitio</span>
        </button>
      </div>
    </aside>
  );
};