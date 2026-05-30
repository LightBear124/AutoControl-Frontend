import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  getMockSession,
  loginMockUser,
} from '../mock/mockSession';

export default function MockLoginPage() {
  const navigate = useNavigate();

  const existingSession = getMockSession();

  const [login, setLogin] = useState('operator1');
  const [password, setPassword] = useState('password1');
  const [error, setError] = useState('');

  if (existingSession) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setError('');

      loginMockUser(login, password);

      navigate('/home', {
        replace: true,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Ошибка авторизации',
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-topbar" />

      <main className="login-shell">
        <section className="login-card">
          <span className="login-badge">
            Mock PWA · Паспортный контроль
          </span>

          <h1>Вход в систему</h1>

          <p className="login-description">
            Авторизуйтесь для просмотра терминала, рейсов и
            пассажиров.
          </p>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="mock-login">
              Логин
            </label>

            <input
              id="mock-login"
              type="text"
              value={login}
              onChange={(event) =>
                setLogin(event.target.value)
              }
            />

            <label htmlFor="mock-password">
              Пароль
            </label>

            <input
              id="mock-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            <button
              type="submit"
              className="login-submit-button"
            >
              Войти
            </button>
          </form>

          <div className="mock-login-hint">
            <p>
              <strong>Оператор терминала A:</strong>{' '}
              operator1 / password1
            </p>

            <p>
              <strong>Оператор терминала B:</strong>{' '}
              operator2 / password2
            </p>

            <p>
              <strong>Модератор:</strong>{' '}
              moderator1 / password3
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}