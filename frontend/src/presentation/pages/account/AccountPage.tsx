import React from 'react';
import styles from './AccountPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { FormInput } from '../../components/form/FormInput';
import { TrustBadge } from '../../components/trustBadge/TrustBadge';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account') => void;
}

const trustBadges = [
  { icon: 'verified_user', text: 'Pago Seguro' },
  { icon: 'local_shipping', text: 'Envío Pro' },
];

export const AccountPage: React.FC<Props> = ({ currentPage = 'account', onNavigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.layout}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className={styles.main}>
        <div className={styles.backgroundDecor}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANWquyYny8Axs9MC50_q3AtlznnAvYtCclCl7C5loebS7ZVgIhm9BVmGzROt7nBKNasm2LeTMBFEOUoQVlAoZuZNO4H-awn7p-fpgGhUncnzNeYqXb85OlvL4O-dKc-vZKRDGw6iXFQUT8SzJiHhCpZtQgarxQ6J081FRTEO5xsAkxheQ7wkZ1qTcrjGva_tMwYb4hWXzfAUv7ciAY3LXraAbZew_SdJhJAXxlI_6-oC44Q33ZtYErwlUhMU3BZaqEcAicZ8R0A-66"
            alt=""
            className={styles.backgroundImage}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Bienvenido de nuevo</h1>
            <p className={styles.subtitle}>Accede a tu cuenta de alto rendimiento</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <FormInput
              label="Correo electrónico"
              name="email"
              placeholder="ejemplo@irongear.com"
              type="email"
              required
            />

            <div className={styles.passwordRow}>
              <FormInput
                label="Contraseña"
                name="password"
                placeholder="••••••••"
                isPassword
                required
              />
              <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </div>

            <div className={styles.checkboxRow}>
              <input type="checkbox" id="remember" className={styles.checkbox} />
              <label htmlFor="remember" className={styles.checkboxLabel}>Recordarme</label>
            </div>

            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Nuevo en Iron Gear?
              <a href="#" className={styles.link}>Crea una cuenta</a>
            </p>
          </div>
        </div>

        <div className={styles.badges}>
          {trustBadges.map((badge) => (
            <TrustBadge key={badge.icon} icon={badge.icon} text={badge.text} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
