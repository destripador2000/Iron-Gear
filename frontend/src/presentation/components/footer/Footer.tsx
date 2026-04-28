import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandInfo}>
          <div className={styles.logo}>IRON GEAR</div>
          <p className={styles.description}>
            INGENIERÍA PARA EL RENDIMIENTO. Creamos equipamiento para los atletas más exigentes del mundo.
          </p>
        </div>

        <div className={styles.linksGroup}>
          <h4>Servicio</h4>
          <a href="#">Rastrear Pedido</a>
          <a href="#">Soporte Técnico</a>
        </div>

        <div className={styles.linksGroup}>
          <h4>Compañía</h4>
          <a href="#">Garantía</a>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
        </div>

        <div className={styles.newsletter}>
          <h4>Newsletter</h4>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              className={styles.newsletterInput}
              placeholder="Email para ofertas VIP"
            />
            <button type="submit" className={styles.newsletterBtn}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © 2024 IRON GEAR PROFESSIONAL EQUIPMENT. ENGINEERED FOR PERFORMANCE.
        </p>
        <div className={styles.social}>
          <button className={styles.socialBtn}>
            <span className="material-symbols-outlined">thumb_up</span>
          </button>
          <button className={styles.socialBtn}>
            <span className="material-symbols-outlined">photo_camera</span>
          </button>
          <button className={styles.socialBtn}>
            <span className="material-symbols-outlined">play_circle</span>
          </button>
        </div>
      </div>
    </footer>
  );
};