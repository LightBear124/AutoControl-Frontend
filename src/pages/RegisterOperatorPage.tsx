import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerOperatorThunk } from '../features/moderation/registerOperatorThunk';

export default function RegisterOperatorPage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const moderationError = useAppSelector((state) => state.moderation.error);
  const moderationStatus = useAppSelector((state) => state.moderation.status);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [terminalId, setTerminalId] = useState('1');
  const [successMessage, setSuccessMessage] = useState('');

  if (role !== 'moderator') {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    try {
      await dispatch(
        registerOperatorThunk({
          login,
          password,
          fullName,
          terminalId: Number(terminalId),
        }),
      );

      setSuccessMessage('Оператор успешно зарегистрирован.');
      setLogin('');
      setPassword('');
      setFullName('');
      setTerminalId('1');
    } catch {
      // ошибка уже записана в moderation.error
    }
  };

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>Регистрация оператора</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="operator-full-name">ФИО</label>
              <input
                id="operator-full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Введите ФИО оператора"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="operator-login">Логин</label>
              <input
                id="operator-login"
                type="text"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                placeholder="Введите логин"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="operator-password">Пароль</label>
              <input
                id="operator-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введите пароль"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="operator-terminal">Терминал</label>
              <select
                id="operator-terminal"
                value={terminalId}
                onChange={(event) => setTerminalId(event.target.value)}
              >
                <option value="1">Терминал A</option>
                <option value="2">Терминал B</option>
              </select>
            </div>

            {moderationError && <div className="auth-error">{moderationError}</div>}
            {successMessage && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#e8f7ec',
                  color: '#157347',
                  fontWeight: 600,
                }}
              >
                {successMessage}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={moderationStatus === 'loading'}
            >
              {moderationStatus === 'loading'
                ? 'Регистрация...'
                : 'Зарегистрировать оператора'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}