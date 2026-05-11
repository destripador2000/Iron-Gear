import React, { useState, useEffect } from 'react';
import styles from './AccountPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { FormInput } from '../../components/form/FormInput';
import { TrustBadge } from '../../components/trustBadge/TrustBadge';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register') => void;
}

const trustBadges = [
  { icon: 'verified_user', text: 'Pago Seguro' },
  { icon: 'local_shipping', text: 'Envío Pro' },
];

export const AccountPage: React.FC<Props> = ({ currentPage = 'account', onNavigate }) => {
  const { login, loading, error, clearError, isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Si ya está autenticado, redirigir al inicio
  useEffect(() => {
    if (isAuthenticated) {
      onNavigate?.('home');
    }
  }, [isAuthenticated, onNavigate]);

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      onNavigate?.('home');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) clearError();
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

          {error && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <FormInput
              label="Correo electrónico"
              name="email"
              placeholder="ejemplo@irongear.com"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
            />

            <div className={styles.passwordRow}>
              <FormInput
                label="Contraseña"
                name="password"
                placeholder="••••••••"
                isPassword
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
              <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </div>

            <div className={styles.checkboxRow}>
              <input type="checkbox" id="remember" className={styles.checkbox} disabled={loading} />
              <label htmlFor="remember" className={styles.checkboxLabel}>Recordarme</label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Nuevo en Iron Gear?
              <a
                href="#"
                className={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('register');
                }}
              >
                Crea una cuenta
              </a>
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
