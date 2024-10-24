import React from 'react';
import { useAuthForm } from '../hooks/useAuthForm';
import styles from './authForm.module.css';
import { Navigate } from 'react-router-dom';

interface AuthFormProps {
  title: string;
  errorMessage: string | null;
  isSignUp?: boolean;
  authUrl: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, errorMessage, isSignUp = false, authUrl }) => {
  const { auth, register, handleSubmit, typedErrors, onSubmit } = useAuthForm(isSignUp, authUrl);

  if (auth) return <Navigate to="/" />;

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {isSignUp && (
          <>
            <label htmlFor="name" className={styles.label}>
              ユーザ名
            </label>
            <input type="text" id="name" {...register('name')} className={styles.input} />
            {typedErrors.name && <p className={styles.errorMessage}>{typedErrors.name.message}</p>}
          </>
        )}
        <label htmlFor="email" className={styles.label}>
          メールアドレス
        </label>
        <input type="email" id="email" {...register('email')} className={styles.input} />
        {typedErrors.email && <p className={styles.errorMessage}>{typedErrors.email.message}</p>}

        <label htmlFor="password" className={styles.label}>
          パスワード
        </label>
        <input type="password" id="password" {...register('password')} className={styles.input} />
        {typedErrors.password && <p className={styles.errorMessage}>{typedErrors.password.message}</p>}

        {isSignUp && (
          <>
            <label htmlFor="confirm" className={styles.label}>
              パスワード（確認）
            </label>
            <input type="password" id="confirm" {...register('confirm')} className={styles.input} />
            {typedErrors.confirm && <p className={styles.errorMessage}>{typedErrors.confirm.message}</p>}
          </>
        )}

        <button type="submit" className={styles.submitButton}>
          {isSignUp ? '新規作成' : 'ログイン'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
