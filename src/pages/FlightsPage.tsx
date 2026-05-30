import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';
import FlightFilters from '../components/FlightFilters';
import LoadingSpinner from '../components/LoadingSpinner';

import { mockFlights } from '../mock/data';
import type { MockFlight } from '../types';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

import {
  loadFlightFiltersForUser,
  setFlightDateFrom,
  setFlightDateTo,
  setFlightDirection,
  setFlightSearch,
  setFlightStatus,
} from '../features/flightFilters/flightFiltersSlice';

import { IS_MOCK_MODE } from '../config/runtime';
import { getMockSession } from '../mock/mockSession';

type ApiFlight = {
  id: number;
  flight_number: string;
  terminal_name: string;
  direction: string;
  route_name: string;
  flight_date: string;
  status: string;
};

type FlightView = {
  id: number;
  flightNumber: string;
  terminalName: string;
  direction: 'arrival' | 'departure';
  routeName: string;
  flightDate: string;
  status: string;
};

const API_BASE_URL = '/api';

function mapApiFlight(
  flight: ApiFlight,
): FlightView {
  return {
    id: flight.id,
    flightNumber: flight.flight_number,
    terminalName: flight.terminal_name,

    direction:
      flight.direction === 'arrival'
        ? 'arrival'
        : 'departure',

    routeName: flight.route_name,
    flightDate: flight.flight_date,
    status: flight.status,
  };
}

function mapMockFlight(
  flight: MockFlight,
): FlightView {
  return {
    id: flight.id,
    flightNumber: flight.flightNumber,
    terminalName: flight.terminalName,
    direction: flight.direction,
    routeName: flight.routeName,
    flightDate: flight.flightDate,
    status: flight.status,
  };
}

function normalizeDate(
  value: string,
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  const datePart = trimmed.split(' ')[0];
  const parts = datePart.split('.');

  if (parts.length === 3) {
    const [day, month, year] = parts;

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return trimmed.slice(0, 10);
}

function applyLocalFilters(
  flights: FlightView[],
  search: string,
  direction: string,
  status: string,
  dateFrom: string,
  dateTo: string,
): FlightView[] {
  let result = [...flights];

  if (search.trim()) {
    const query = search
      .trim()
      .toLowerCase();

    result = result.filter((flight) =>
      [
        flight.flightNumber,
        flight.terminalName,
        flight.routeName,
        flight.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }

  if (direction !== 'all') {
    result = result.filter(
      (flight) =>
        flight.direction === direction,
    );
  }

  if (status.trim()) {
    const query = status
      .trim()
      .toLowerCase();

    result = result.filter((flight) =>
      flight.status
        .toLowerCase()
        .includes(query),
    );
  }

  if (dateFrom) {
    result = result.filter(
      (flight) =>
        normalizeDate(flight.flightDate) >=
        dateFrom,
    );
  }

  if (dateTo) {
    result = result.filter(
      (flight) =>
        normalizeDate(flight.flightDate) <=
        dateTo,
    );
  }

  return result;
}

export default function FlightsPage() {
  const dispatch = useAppDispatch();

  const backendUser = useAppSelector(
    (state) => state.auth.user,
  );

  const backendRole = useAppSelector(
    (state) => state.auth.role,
  );

  /*
    Важно:
    читаем mock-сессию один раз при открытии страницы.
    Иначе getMockSession() создаёт новый объект
    при каждом рендере и запускает бесконечный useEffect.
  */
  const mockUser = useMemo(
    () =>
      IS_MOCK_MODE
        ? getMockSession()
        : null,
    [],
  );

  const activeUser = IS_MOCK_MODE
    ? mockUser
    : backendUser;

  /*
    Используем примитивные значения.
    Их безопасно добавлять в зависимости useEffect.
  */
  const activeLogin =
    activeUser?.login ?? 'guest';

  const activeRole =
    activeUser?.role ?? 'guest';

  const activeTerminalName =
    activeUser?.terminalName ?? null;

  const activeTerminalId =
    activeUser?.terminalId ?? null;

  const {
    search,
    direction,
    status: statusFilter,
    dateFrom,
    dateTo,
  } = useAppSelector(
    (state) => state.flightFilters,
  );

  const [flights, setFlights] =
    useState<FlightView[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [source, setSource] =
    useState<'api' | 'mock'>(
      IS_MOCK_MODE
        ? 'mock'
        : 'api',
    );

  const [
    backendUnavailable,
    setBackendUnavailable,
  ] = useState(false);

  /*
    При входе другого mock-пользователя
    подтягиваются именно его сохранённые фильтры.
  */
  useEffect(() => {
    dispatch(
      loadFlightFiltersForUser(activeLogin),
    );
  }, [
    dispatch,
    activeLogin,
  ]);

  useEffect(() => {
    let cancelled = false;

    const getFilteredMockFlights = () => {
      let fallback =
        mockFlights.map(mapMockFlight);

      if (
        activeRole === 'operator' &&
        activeTerminalName
      ) {
        fallback = fallback.filter(
          (flight) =>
            flight.terminalName ===
            activeTerminalName,
        );
      }

      return applyLocalFilters(
        fallback,
        search,
        direction,
        statusFilter,
        dateFrom,
        dateTo,
      );
    };

    const loadFlights = async () => {
      setLoading(true);
      setBackendUnavailable(false);

      if (IS_MOCK_MODE) {
        if (!cancelled) {
          setFlights(
            getFilteredMockFlights(),
          );

          setSource('mock');
          setLoading(false);
        }

        return;
      }

      const params =
        new URLSearchParams();

      if (search.trim()) {
        params.set(
          'search',
          search.trim(),
        );
      }

      if (direction !== 'all') {
        params.set(
          'direction',
          direction,
        );
      }

      if (statusFilter.trim()) {
        params.set(
          'status',
          statusFilter.trim(),
        );
      }

      if (dateFrom) {
        params.set(
          'date_from',
          dateFrom,
        );
      }

      if (dateTo) {
        params.set(
          'date_to',
          dateTo,
        );
      }

      try {
        const query =
          params.toString();

        const response = await fetch(
          `${API_BASE_URL}/flights${
            query
              ? `?${query}`
              : ''
          }`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error(
            'API unavailable',
          );
        }

        const data =
          (await response.json()) as ApiFlight[];

        if (!cancelled) {
          setFlights(
            data.map(mapApiFlight),
          );

          setSource('api');
        }
      } catch {
        if (!cancelled) {
          setFlights(
            getFilteredMockFlights(),
          );

          setSource('mock');
          setBackendUnavailable(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFlights();

    return () => {
      cancelled = true;
    };
  }, [
    activeRole,
    activeTerminalName,
    search,
    direction,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  const terminalLabel =
    useMemo(() => {
      if (activeRole === 'moderator') {
        return 'Все терминалы';
      }

      if (activeTerminalName) {
        return activeTerminalName;
      }

      if (activeTerminalId !== null) {
        return `ID ${activeTerminalId}`;
      }

      return 'Не указан';
    }, [
      activeRole,
      activeTerminalName,
      activeTerminalId,
    ]);

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>Рейсы</h1>

          <div className="user-summary">
            <p>
              <strong>
                Пользователь:
              </strong>{' '}
              {activeUser?.fullName ??
                'Не определён'}
            </p>

            <p>
              <strong>
                Роль:
              </strong>{' '}
              {activeUser?.role ??
                (
                  backendRole !== 'guest'
                    ? backendRole
                    : 'Не определена'
                )}
            </p>

            <p>
              <strong>
                Терминал:
              </strong>{' '}
              {terminalLabel}
            </p>

            <p>
              <strong>
                Источник данных:
              </strong>{' '}
              {source === 'api'
                ? 'Backend API'
                : 'Mock-данные'}
            </p>
          </div>

          {backendUnavailable &&
            !IS_MOCK_MODE && (
              <p className="error-text">
                Backend недоступен,
                показаны mock-данные.
              </p>
            )}

          <div className="filters-block">
            <FlightFilters
              search={search}
              setSearch={(value) =>
                dispatch(
                  setFlightSearch(value),
                )
              }
              direction={direction}
              setDirection={(value) =>
                dispatch(
                  setFlightDirection(value),
                )
              }
            />

            <input
              type="text"
              placeholder="Статус рейса"
              value={statusFilter}
              onChange={(event) =>
                dispatch(
                  setFlightStatus(
                    event.target.value,
                  ),
                )
              }
            />

            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                dispatch(
                  setFlightDateFrom(
                    event.target.value,
                  ),
                )
              }
            />

            <input
              type="date"
              value={dateTo}
              onChange={(event) =>
                dispatch(
                  setFlightDateTo(
                    event.target.value,
                  ),
                )
              }
            />
          </div>

          {loading ? (
            <LoadingSpinner
              text="Загрузка рейсов..."
            />
          ) : flights.length === 0 ? (
            <p>
              Рейсы не найдены.
            </p>
          ) : (
            <div className="flights-grid">
              {flights.map((flight) => (
                <Link
                  key={flight.id}
                  to={`/flights/${flight.id}`}
                  className="flight-card"
                >
                  <div className="flight-card-top">
                    <h3>
                      {flight.flightNumber}
                    </h3>

                    <span className="status-chip">
                      {flight.status}
                    </span>
                  </div>

                  <p>
                    <strong>
                      Терминал:
                    </strong>{' '}
                    {flight.terminalName}
                  </p>

                  <p>
                    <strong>
                      Направление:
                    </strong>{' '}
                    {flight.direction ===
                    'arrival'
                      ? 'Прилёт'
                      : 'Вылет'}
                  </p>

                  <p>
                    <strong>
                      Маршрут:
                    </strong>{' '}
                    {flight.routeName}
                  </p>

                  <p>
                    <strong>
                      Дата:
                    </strong>{' '}
                    {flight.flightDate}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}