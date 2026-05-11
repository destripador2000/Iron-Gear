import React, { useState, useEffect } from 'react';
import styles from './RegisterPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout') => void;
}

const benefits = [
  { icon: 'verified', text: 'Equipamiento Pro-Grade' },
  { icon: 'local_shipping', text: 'Envíos Globales' },
];

export const RegisterPage: React.FC<Props> = ({ currentPage = 'register', onNavigate }) => {
  const { register, loading, error, clearError, isAuthenticated } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setPasswordError(null);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (!termsAccepted) {
      return;
    }

    const success = await register({
      name: fullName,
      email,
      password,
      role: 'cliente',
    });

    if (success) {
      setShowSuccess(true);
    }
  };

  const handleLoginClick = () => {
    clearError();
    setShowSuccess(false);
    onNavigate?.('account');
  };

  if (showSuccess) {
    return (
      <div className={styles.layout}>
        <Header currentPage={currentPage} onNavigate={onNavigate} />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h2 className={styles.successTitle}>¡Cuenta creada exitosamente!</h2>
              <p className={styles.successText}>
                Te hemos enviado un correo de confirmación. Ahora puedes iniciar sesión con tus credenciales.
              </p>
              <button className={styles.submitButton} onClick={handleLoginClick}>
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className={styles.main}>
        <div className={styles.decorCircleTop} />
        <div className={styles.decorCircleBottom} />

        <div className={styles.card}>
          <div className={styles.brandPanel}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY2O5UbaVvOS2G9ajsvYoIzio8-ItTc2S1yzzuWfEk1UffVA0mox8r75RCN7HWKwa7L2OnCZDOoqWUUjiSLEzZpc0beToDIPStGYmAw4xK4UEspZNy5FnBWLqeVHC2rjEtH-tu98bm1jEmBPpdhl6iEMNB2G9YpJ6E9faahXTvx0gRWIFIfinaC6wDrsUYjg-PPWWylAUqVZx5Iomg3Vo8BM9UQsSi-bkbNEzBPeHNGMV7FwxkSkkJ6Wo4TUVQGWZFXmbCS89yFuJq"
              alt=""
              className={styles.brandImage}
            />
            <div className={styles.brandContent}>
              <div className={styles.brandTitle}>Hierro & Honor</div>
              <p className={styles.brandDescription}>
                Únete a la comunidad de atletas que no aceptan menos que la excelencia técnica.
              </p>
              <div className={styles.benefits}>
                {benefits.map((benefit) => (
                  <div key={benefit.icon} className={styles.benefit}>
                    <span
                      className={`material-symbols-outlined ${styles.benefitIcon}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {benefit.icon}
                    </span>
                    <span className={styles.benefitText}>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>Crear Cuenta</h1>
              <p className={styles.subtitle}>Ingresa tus datos para comenzar tu equipamiento profesional.</p>
            </div>

            {(error || passwordError) && (
              <div className={styles.errorBanner}>
                <span className="material-symbols-outlined">error</span>
                <span>{error || passwordError}</span>
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <label className={styles.label} htmlFor="fullName">
                    Nombre Completo
                  </label>
                  <input
                    id="fullName"
                    className={styles.input}
                    type="text"
                    placeholder="Ej. Carlos Rodríguez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className={styles.fullWidth}>
                  <label className={styles.label} htmlFor="email">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    className={styles.input}
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={styles.label} htmlFor="password">
                    Contraseña
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      className={styles.input}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
                      required
                      disabled={loading}
                    />
                    <span className={`material-symbols-outlined ${styles.visibilityIcon}`}>visibility</span>
                  </div>
                </div>

                <div>
                  <label className={styles.label} htmlFor="confirmPassword">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    className={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={styles.label} htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    className={styles.input}
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={styles.label} htmlFor="birthDate">
                    Fecha de Nacimiento
                  </label>
                  <input
                    id="birthDate"
                    className={styles.input}
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.terms}>
                <input
                  type="checkbox"
                  id="terms"
                  className={styles.checkbox}
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="terms" className={styles.termsLabel}>
                  Al crear una cuenta, acepto los{' '}
                  <a href="#" className={styles.termsLink}>
                    Términos de Servicio
                  </a>{' '}
                  y la{' '}
                  <a href="#" className={styles.termsLink}>
                    Política de Privacidad
                  </a>{' '}
                  de Iron Gear.
                </label>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading || !termsAccepted}>
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <span className="material-symbols-outlined">trending_flat</span>
                  </>
                )}
              </button>

              <div className={styles.footer}>
                <p className={styles.footerText}>
                  ¿Ya tienes una cuenta?
                  <a
                    href="#"
                    className={styles.footerLink}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLoginClick();
                    }}
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
