import axios from 'axios';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn } from '../authSlice';
import { Header } from '../components/Header';
import { url } from '../const';
import styles from './signUp.module.css';

export const SignUp = () => {
  const navigation = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [cookies, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignUp = () => {
    const data = {
      email: email,
      name: name,
      password: password,
    };

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token;
        dispatch(signIn());
        setCookie('token', token);
        navigation('/');
      })
      .catch((err) => {
        setErrorMessage(`サインアップに失敗しました。 ${err}`);
      });

    if (auth) return <Navigate to="/" />;
  };
  return (
    <div>
      <Header />
      <main className={styles.signUp}>
        <h1 className={styles.signUpTitle}>新規作成</h1>
        <p className={styles.errorMessage}>{errorMessage}</p>
        <form className={styles.signUpForm}>
          <label className={styles.emailLabel}>
            メールアドレス
            <input type="email" onChange={handleEmailChange} className={styles.emailInput} />
          </label>

          <label className={styles.nameInputLabel}>
            ユーザ名
            <input type="text" onChange={handleNameChange} className={styles.nameInput} />
          </label>

          <label className={styles.passwordInputLabel}>
            パスワード
            <input
              type="password"
              onChange={handlePasswordChange}
              className={styles.passwordInput}
            />
          </label>

          <button type="button" onClick={onSignUp} className={styles.signUpButton}>
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
