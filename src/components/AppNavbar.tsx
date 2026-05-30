import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutThunk } from '../features/auth/authThunks';
import { loadFlightFiltersForUser } from '../features/flightFilters/flightFiltersSlice';
import { IS_MOCK_MODE } from '../config/runtime';
import {
  getMockSession,
  logoutMockUser,
} from '../mock/mockSession';

export default function AppNavbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const backendUser = useAppSelector(
    (state) => state.auth.user,
  );

  const backendRole = useAppSelector(
    (state) => state.auth.role,
  );

  const mockUser = IS_MOCK_MODE
    ? getMockSession()
    : null;

  const handleLogout = async () => {
    if (IS_MOCK_MODE) {
      logoutMockUser();

      dispatch(
        loadFlightFiltersForUser('guest'),
      );

      navigate('/login', {
        replace: true,
      });

      return;
    }

    await dispatch(logoutThunk());

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <nav className="topbar-nav">
          <Link
            to="/home"
            className="topbar-link"
          >
            Домой
          </Link>

          <Link
            to="/flights"
            className="topbar-link"
          >
            Рейсы
          </Link>

          {IS_MOCK_MODE && (
            <Link
              to="/requests"
              className="topbar-link"
            >
              Заявки
            </Link>
          )}

          {!IS_MOCK_MODE && (
            <>
              {backendRole === 'operator' && (
                <Link
                  to="/requests"
                  className="topbar-link"
                >
                  Заявки
                </Link>
              )}

              {backendRole === 'moderator' && (
                <>
                  <Link
                    to="/moderator/requests"
                    className="topbar-link"
                  >
                    Заявки
                  </Link>

                  <Link
                    to="/moderator/register-operator"
                    className="topbar-link"
                  >
                    Новый оператор
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className="topbar-link"
              >
                Профиль
              </Link>
            </>
          )}

          <button
            type="button"
            className="topbar-button"
            onClick={() => void handleLogout()}
          >
            Выход
          </button>
        </nav>

        <div className="topbar-user">
          {IS_MOCK_MODE
            ? mockUser
              ? `${mockUser.fullName} (${mockUser.role})`
              : 'Гость'
            : backendUser
              ? `${backendUser.fullName} (${backendUser.role})`
              : 'Гость'}
        </div>
      </div>
    </header>
  );
}