import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandInfo}>
          <div className={styles.logo}>IRON GEAR</div>
          <p className={styles.copyright}>
            © 2024 IRON GEAR PROFESSIONAL EQUIPMENT. ENGINEERED FOR PERFORMANCE.
          </p>
        </div>

        <div className={styles.links}>
          <a href="#">Rastrear Pedido</a>
          <a href="#">Soporte Técnico</a>
          <a href="#">Garantía</a>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
        </div>

        <div className={styles.social}>
          <button className={styles.socialBtn}>
            <span className="material-symbols-outlined">public</span>
          </button>
          <button className={styles.socialBtn}>
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
    </footer>
  );
};