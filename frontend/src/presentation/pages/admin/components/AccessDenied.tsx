import React from 'react';
import styles from './AccessDenied.module.css';

export const AccessDenied: React.FC = () => {
  return (
    <div className={styles.container}>
      <span className="material-symbols-outlined">lock</span>
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
      <p className={styles.contact}>Contacta al administrador si necesitas acceso.</p>
    </div>
  );
};