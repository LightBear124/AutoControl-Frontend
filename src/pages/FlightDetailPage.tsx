import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { canAccessTerminal } from '../mock/auth';
import { mockFlights, mockPassengers } from '../mock/data';
import type { MockPassenger } from '../types';
import {
  findSimilarFlights,
  type SimilarFlightItem,
} from '../utils/similarFlights';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  addPassengerToDraftThunk,
  loadDraftThunk,
} from '../features/requestDraft/requestDraftThunks';
import LoadingSpinner from '../components/LoadingSpinner';
import { IS_MOCK_MODE } from '../config/runtime';

type ApiPassenger = {
  id: number;
  full_name: string;
  seat_number: string;
  citizenship: string;
  passport_number: string;
  birth_date?: string;
  expiry_date?: string;
  description?: string;
  previous_trips_count?: number;
  image_url?: string;
};

type ApiFlightDetail = {
  id: number;
  flight_number: string;
  status: string;
  terminal_name: string;
  direction: string;
  route_name: string;
  flight_date: string;
  passengers: ApiPassenger[];
};

type ApiFlight = {
  id: number;
  flight_number: string;
  status: string;
  terminal_name: string;
  direction: string;
  route_name: string;
  flight_date: string;
};

type PassengerView = {
  id: number;
  fullName: string;
  citizenship: string;
  passportNumber: string;
  seatNumber: string;
  birthDate?: string;
  expiryDate?: string;
  description?: string;
  previousTripsCount?: number;
  imageUrl?: string;
};

type FlightView = SimilarFlightItem;

const API_BASE_URL = '/api';

function mapApiFlight(flight: ApiFlight): FlightView {
  return {
    id: flight.id,
    flightNumber: flight.flight_number,
    terminalName: flight.terminal_name,
    direction: flight.direction === 'arrival' ? 'arrival' : 'departure',
    routeName: flight.route_name,
    flightDate: flight.flight_date,
    status: flight.status,
  };
}

export default function FlightDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const draft = useAppSelector((state) => state.requestDraft.draft);
  const draftPassengers = useAppSelector((state) => state.requestDraft.passengers);

  const flightId = Number(id);

  const [apiFlight, setApiFlight] = useState<FlightView | null>(null);
  const [apiPassengers, setApiPassengers] = useState<PassengerView[] | null>(null);
  const [allFlights, setAllFlights] = useState<FlightView[]>([]);
  const [similarFlights, setSimilarFlights] = useState<FlightView[]>([]);

  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(
    null,
  );

  const hasActiveDraft = Boolean(draft?.id && draft.status === 'draft');

  useEffect(() => {
    if (!IS_MOCK_MODE) {
      void dispatch(loadDraftThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    const loadFlight = async () => {
      setLoading(true);
      setErrorText('');

      try {
        const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Не выполнена авторизация');
        }

        if (response.status === 403) {
          throw new Error('Нет доступа к этому терминалу');
        }

        if (!response.ok) {
          throw new Error('API detail unavailable');
        }

        const data = (await response.json()) as ApiFlightDetail;

        if (cancelled) {
          return;
        }

        setApiFlight({
          id: data.id,
          flightNumber: data.flight_number,
          terminalName: data.terminal_name,
          direction: data.direction === 'arrival' ? 'arrival' : 'departure',
          routeName: data.route_name,
          flightDate: data.flight_date,
          status: data.status,
        });

        setApiPassengers(
          data.passengers.map((item) => ({
            id: item.id,
            fullName: item.full_name,
            citizenship: item.citizenship,
            passportNumber: item.passport_number,
            seatNumber: item.seat_number,
            birthDate: item.birth_date,
            expiryDate: item.expiry_date,
            description: item.description,
            previousTripsCount: item.previous_trips_count,
            imageUrl: item.image_url,
          })),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setApiFlight(null);
        setApiPassengers(null);

        if (error instanceof Error && error.message !== 'API detail unavailable') {
          setErrorText(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (Number.isFinite(flightId) && flightId > 0) {
      void loadFlight();
    } else {
      setLoading(false);
      setErrorText('Некорректный идентификатор рейса');
    }

    return () => {
      cancelled = true;
    };
  }, [flightId]);

  useEffect(() => {
    let cancelled = false;

    const loadAllFlights = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/flights`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('API flights unavailable');
        }

        const data = (await response.json()) as ApiFlight[];

        if (!cancelled) {
          setAllFlights(data.map(mapApiFlight));
        }
      } catch {
        if (!cancelled) {
          let fallback = mockFlights;

          if (user?.role === 'operator' && user.terminalName) {
            fallback = fallback.filter(
              (flight) => flight.terminalName === user.terminalName,
            );
          }

          setAllFlights(
            fallback.map((flight) => ({
              id: flight.id,
              flightNumber: flight.flightNumber,
              terminalName: flight.terminalName,
              direction: flight.direction,
              routeName: flight.routeName,
              flightDate: flight.flightDate,
              status: flight.status,
            })),
          );
        }
      }
    };

    void loadAllFlights();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const mockFlight = useMemo(() => {
    if (apiFlight) {
      return null;
    }

    return mockFlights.find((flight) => flight.id === flightId) ?? null;
  }, [apiFlight, flightId]);

  const mockPassengersForFlight = useMemo(() => {
    if (apiPassengers) {
      return null;
    }

    return mockPassengers
      .filter((passenger) => passenger.flightId === flightId)
      .map(
        (passenger: MockPassenger): PassengerView => ({
          id: passenger.id,
          fullName: passenger.fullName,
          citizenship: passenger.citizenship,
          passportNumber: passenger.passportNumber,
          seatNumber: passenger.seatNumber,
        }),
      );
  }, [apiPassengers, flightId]);

  const flight: FlightView | null = useMemo(() => {
    if (apiFlight) {
      return apiFlight;
    }

    if (!mockFlight) {
      return null;
    }

    return {
      id: mockFlight.id,
      flightNumber: mockFlight.flightNumber,
      terminalName: mockFlight.terminalName,
      direction: mockFlight.direction,
      routeName: mockFlight.routeName,
      flightDate: mockFlight.flightDate,
      status: mockFlight.status,
    };
  }, [apiFlight, mockFlight]);

  const passengers = apiPassengers ?? mockPassengersForFlight ?? [];

  const hasMockAccess = useMemo(() => {
    if (apiFlight) {
      return true;
    }

    if (!mockFlight || !user) {
      return false;
    }

    return canAccessTerminal(user, mockFlight.terminalName);
  }, [apiFlight, user, mockFlight]);

  useEffect(() => {
    let cancelled = false;

    const loadSimilar = async () => {
      if (!flight || allFlights.length === 0) {
        if (!cancelled) {
          setSimilarFlights([]);
        }
        return;
      }

      setSimilarLoading(true);

      try {
        const result = await findSimilarFlights(flight, allFlights, 3);

        if (!cancelled) {
          setSimilarFlights(result);
        }
      } catch {
        if (!cancelled) {
          setSimilarFlights([]);
        }
      } finally {
        if (!cancelled) {
          setSimilarLoading(false);
        }
      }
    };

    void loadSimilar();

    return () => {
      cancelled = true;
    };
  }, [flight, allFlights]);

  const selectedPassenger = passengers.find(
    (passenger) => passenger.id === selectedPassengerId,
  );

  const handleAddToDraft = async (passenger: PassengerView) => {
    try {
      await dispatch(
        addPassengerToDraftThunk({
          id: passenger.id,
          fullName: passenger.fullName,
          citizenship: passenger.citizenship,
          passportNumber: passenger.passportNumber,
          seatNumber: passenger.seatNumber,
          decision: null,
        }),
      );

      await dispatch(loadDraftThunk());
    } catch {
      //
    }
  };

  const isPassengerAlreadyInDraft = (passengerId: number) =>
    hasActiveDraft && draftPassengers.some((item) => item.id === passengerId);

  if (!user && !IS_MOCK_MODE) {
    return null;
  }

  if (loading) {
    return (
      <div className="app-page">
        <AppNavbar />
        <main className="page-shell">
          <section className="page-card">
            <LoadingSpinner text="Загрузка рейса..." />
          </section>
        </main>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="app-page">
        <AppNavbar />
        <main className="page-shell">
          <section className="page-card">
            <p className="error-text">{errorText}</p>
            <button
              type="button"
              className="open-modal-button"
              onClick={() => navigate('/flights')}
            >
              Назад к рейсам
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="app-page">
        <AppNavbar />
        <main className="page-shell">
          <section className="page-card">
            <p>Рейс не найден.</p>
          </section>
        </main>
      </div>
    );
  }

  if (!hasMockAccess) {
    return (
      <div className="app-page">
        <AppNavbar />
        <main className="page-shell">
          <section className="page-card">
            <p className="error-text">
              У текущего пользователя нет доступа к просмотру рейсов другого терминала.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <div className="flight-header">
            <div>
              <h1>Рейс {flight.flightNumber}</h1>
              <p>
                <strong>Терминал:</strong> {flight.terminalName}
              </p>
              <p>
                <strong>Направление:</strong>{' '}
                {flight.direction === 'arrival' ? 'Прилёт' : 'Вылет'}
              </p>
              <p>
                <strong>Маршрут:</strong> {flight.routeName}
              </p>
              <p>
                <strong>Дата:</strong> {flight.flightDate}
              </p>
              <p>
                <strong>Источник данных:</strong>{' '}
                {apiFlight ? 'Backend API' : 'Mock-данные'}
              </p>
            </div>

            {!IS_MOCK_MODE && (
            <div className="request-top-actions">
              <button
                type="button"
                className={hasActiveDraft ? 'complete-button' : 'reject-button'}
                disabled={!hasActiveDraft}
                onClick={() => {
                  if (hasActiveDraft && draft?.id) {
                    navigate(`/requests/${draft.id}`);
                  }
                }}
              >
                {hasActiveDraft
                  ? 'Открыть черновик заявки'
                  : 'Черновик отсутствует'}
              </button>
            </div>
            )}
          </div>
          
          <div style={{ marginBottom: '18px' }}>
            <Link to="/flights" className="topbar-link" style={{ color: '#0f4aa3' }}>
              ← Назад к списку рейсов
            </Link>
          </div>

          <h2>Пассажиры рейса</h2>

          {passengers.length === 0 ? (
            <p>Пассажиры не найдены.</p>
          ) : (
            <div className="table-wrap">
              <table className="passengers-table">
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Гражданство</th>
                    <th>Паспорт</th>
                    <th>Место</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td>{passenger.fullName}</td>
                      <td>{passenger.citizenship}</td>
                      <td>{passenger.passportNumber}</td>
                      <td>{passenger.seatNumber}</td>
                      <td>
                        <div className="decision-actions">
                          <button
                            type="button"
                            className="open-modal-button"
                            onClick={() => setSelectedPassengerId(passenger.id)}
                          >
                            Открыть
                          </button>

                          {!IS_MOCK_MODE && (
                          <button
                            type="button"
                            className="allow-button"
                            disabled={isPassengerAlreadyInDraft(passenger.id)}
                            onClick={() => void handleAddToDraft(passenger)}
                          >
                            {isPassengerAlreadyInDraft(passenger.id)
                              ? 'Уже в заявке'
                              : 'Добавить'}
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '32px' }}>
            <h2>Похожие рейсы</h2>

            {similarLoading && similarFlights.length === 0 ? (
              <p>Подбор похожих рейсов...</p>
            ) : similarFlights.length === 0 ? (
              <p>Похожие рейсы не найдены.</p>
            ) : (
              <div className="flights-grid">
                {similarFlights.map((item) => (
                  <Link
                    key={item.id}
                    to={`/flights/${item.id}`}
                    className="flight-card"
                  >
                    <div className="flight-card-top">
                      <h3>{item.flightNumber}</h3>
                      <span className="status-chip">{item.status}</span>
                    </div>

                    <p>
                      <strong>Терминал:</strong> {item.terminalName}
                    </p>
                    <p>
                      <strong>Направление:</strong>{' '}
                      {item.direction === 'arrival' ? 'Прилёт' : 'Вылет'}
                    </p>
                    <p>
                      <strong>Маршрут:</strong> {item.routeName}
                    </p>
                    <p>
                      <strong>Дата:</strong> {item.flightDate}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedPassenger && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPassengerId(null)}
        >
          <div
            className="modal-window"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setSelectedPassengerId(null)}
            >
              ×
            </button>

            <div className="modal-card">
              <div className="modal-header">
                <h3>{selectedPassenger.fullName}</h3>
                <p>
                  <strong>Рейс:</strong> {flight.flightNumber}
                </p>
                <p>
                  <strong>Терминал:</strong> {flight.terminalName}
                </p>
              </div>

              <div className="modal-section">
                <h4>Основные данные</h4>
                <p>
                  <strong>Гражданство:</strong> {selectedPassenger.citizenship}
                </p>
                <p>
                  <strong>Номер паспорта:</strong> {selectedPassenger.passportNumber}
                </p>
                <p>
                  <strong>Место:</strong> {selectedPassenger.seatNumber}
                </p>

                {selectedPassenger.birthDate && (
                  <p>
                    <strong>Дата рождения:</strong> {selectedPassenger.birthDate}
                  </p>
                )}

                {selectedPassenger.expiryDate && (
                  <p>
                    <strong>Срок действия:</strong> {selectedPassenger.expiryDate}
                  </p>
                )}

                {selectedPassenger.previousTripsCount !== undefined && (
                  <p>
                    <strong>Количество прошлых поездок:</strong>{' '}
                    {selectedPassenger.previousTripsCount}
                  </p>
                )}

                {selectedPassenger.description && <p>{selectedPassenger.description}</p>}

                {selectedPassenger.imageUrl && (
                  <img
                    src={selectedPassenger.imageUrl}
                    alt={selectedPassenger.fullName}
                    className="modal-passport-image"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}