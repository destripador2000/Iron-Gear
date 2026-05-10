import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  isPassword,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        id={inputId}
        type={isPassword ? 'password' : props.type || 'text'}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
