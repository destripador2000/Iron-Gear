import React from 'react';
import styles from './TrustBadge.module.css';

interface TrustBadgeProps {
  icon: string;
  text: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ icon, text }) => {
  return (
    <div className={styles.badge}>
      <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};
