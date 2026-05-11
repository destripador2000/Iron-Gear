import React from 'react';
import { AdminLayout } from './AdminLayout';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <AdminLayout />
    </div>
  );
};