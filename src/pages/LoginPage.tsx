import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthError } from '../features/auth/authSlice';
import { loginThunk } from '../features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, status, error, role } = useAppSelector(
    (state) => state.auth,
  );

  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'moderator') {
        navigate('/home', { replace: true });
        return;
      }

      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate, role]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(loginThunk(loginValue, passwordValue));
    } catch {
      // ошибка уже записана в redux
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-shell">
        <div className="auth-panel">
          <div className="auth-badge">
            Система автоматического паспортного контроля
          </div>

          <h1 className="auth-title">Вход в систему</h1>

          <p className="auth-subtitle">
            Авторизуйтесь для работы с терминалом, рейсами и заявками.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login">Логин</label>
              <input
                id="login"
                type="text"
                value={loginValue}
                onChange={(event) => setLoginValue(event.target.value)}
                placeholder="Введите логин"
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                value={passwordValue}
                onChange={(event) => setPasswordValue(event.target.value)}
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
            </div>

            <button className="auth-submit" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}