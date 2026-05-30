import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAppSelector } from '../app/hooks';
import { IS_MOCK_MODE } from '../config/runtime';
import { getMockSession } from '../mock/mockSession';

export default function HomePage() {
  const navigate = useNavigate();

  const backendUser = useAppSelector(
    (state) => state.auth.user,
  );

  const backendRole = useAppSelector(
    (state) => state.auth.role,
  );

  const mockUser = IS_MOCK_MODE
    ? getMockSession()
    : null;

  const activeUser = IS_MOCK_MODE
    ? mockUser
    : backendUser;

  const terminalLabel =
    activeUser?.role === 'moderator'
      ? 'Все терминалы'
      : activeUser?.terminalName ??
        (
          activeUser?.terminalId !== null &&
          activeUser?.terminalId !== undefined
            ? `ID ${activeUser.terminalId}`
            : 'Не указан'
        );

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="home-page">
        <section className="hero-block">
          <div className="hero-text">
            <span className="hero-badge">
              Пограничный контроль
            </span>

            <h1>
              Система автоматического паспортного контроля
            </h1>

            <p>
              Система предназначена для работы операторов
              терминалов и модератора. После авторизации
              пользователь получает доступ к своему терминалу,
              рейсам и пассажирам.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate('/flights')}
              >
                Открыть терминал и рейсы
              </button>
            </div>
          </div>

          <aside className="hero-user-card">
            <p>
              <strong>Пользователь:</strong>{' '}
              {activeUser?.fullName ?? 'Не определён'}
            </p>

            <p>
              <strong>Роль:</strong>{' '}
              {activeUser?.role ??
                (
                  backendRole !== 'guest'
                    ? backendRole
                    : 'Не определена'
                )}
            </p>

            <p>
              <strong>Терминал:</strong>{' '}
              {terminalLabel}
            </p>

            {IS_MOCK_MODE && (
              <p>
                <strong>Источник данных:</strong>{' '}
                Mock-данные PWA
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}