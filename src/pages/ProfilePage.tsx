import { useState, type FormEvent } from 'react';
import AppNavbar from '../components/AppNavbar';
import { useAppSelector } from '../app/hooks';

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const terminalLabel =
    user?.role === 'moderator'
      ? 'Все терминалы'
      : user?.terminalName ??
        (user?.terminalId !== null && user?.terminalId !== undefined
          ? `ID ${user.terminalId}`
          : 'Не указан');

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Данные профиля подготовлены к сохранению.');
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oldPassword || !newPassword) {
      setMessage('Введите старый и новый пароль.');
      return;
    }

    setMessage('Запрос на смену пароля подготовлен.');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>Личный кабинет</h1>

          <div className="user-summary">
            <p>
              <strong>Пользователь:</strong> {user?.fullName ?? 'Не определён'}
            </p>
            <p>
              <strong>Логин:</strong> {user?.login ?? 'Не определён'}
            </p>
            <p>
              <strong>Роль:</strong>{' '}
              {user?.role ?? (role !== 'guest' ? role : 'Не определена')}
            </p>
            <p>
              <strong>Терминал:</strong> {terminalLabel}
            </p>
          </div>

          {message && <p className="success-text">{message}</p>}

          <div className="profile-grid">
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <h2>Данные пользователя</h2>

              <label htmlFor="profile-full-name">ФИО</label>
              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />

              <label htmlFor="profile-login">Логин</label>
              <input
                id="profile-login"
                type="text"
                value={user?.login ?? ''}
                disabled
              />

              <button type="submit" className="complete-button">
                Сохранить изменения
              </button>
            </form>

            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              <h2>Сброс пароля</h2>

              <label htmlFor="old-password">Текущий пароль</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />

              <label htmlFor="new-password">Новый пароль</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />

              <button type="submit" className="complete-button">
                Изменить пароль
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}