import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';

import { mockFlights } from '../mock/data';

import {
  getMockPassengersByFlightId,
  type MockPassengerRecord,
} from '../mock/mockDatabase';

import { getMockSession } from '../mock/mockSession';

export default function MockFlightDetailPage() {
  const { id } = useParams();

  const user = getMockSession();
  const flightId = Number(id);

  const [
    selectedPassenger,
    setSelectedPassenger,
  ] = useState<MockPassengerRecord | null>(
    null,
  );

  const flight = mockFlights.find(
    (item) => item.id === flightId,
  );

  if (!user) {
    return null;
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

  const hasAccess =
    user.role === 'moderator' ||
    flight.terminalName === user.terminalName;

  if (!hasAccess) {
    return (
      <div className="app-page">
        <AppNavbar />

        <main className="page-shell">
          <section className="page-card">
            <p className="error-text">
              У текущего оператора нет доступа к
              рейсам другого терминала.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const passengers =
    getMockPassengersByFlightId(flightId);

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <div className="flight-header">
            <div>
              <h1>
                Рейс {flight.flightNumber}
              </h1>

              <p>
                <strong>Терминал:</strong>{' '}
                {flight.terminalName}
              </p>

              <p>
                <strong>Направление:</strong>{' '}
                {flight.direction === 'arrival'
                  ? 'Прилёт'
                  : 'Вылет'}
              </p>

              <p>
                <strong>Маршрут:</strong>{' '}
                {flight.routeName}
              </p>

              <p>
                <strong>Дата:</strong>{' '}
                {flight.flightDate}
              </p>

              <p>
                <strong>
                  Источник данных:
                </strong>{' '}
                Mock-данные PWA
              </p>
            </div>
          </div>

          <div className="page-back-link">
            <Link
              to="/flights"
              className="inline-page-link"
            >
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
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Гражданство</th>
                    <th>Паспорт</th>
                    <th>Место</th>
                    <th>Поездок</th>
                    <th>Действия</th>
                  </tr>
                </thead>

                <tbody>
                  {passengers.map(
                    (passenger) => (
                      <tr key={passenger.id}>
                        <td>{passenger.id}</td>

                        <td>
                          {passenger.fullName}
                        </td>

                        <td>
                          {passenger.citizenship}
                        </td>

                        <td>
                          {passenger.passportNumber}
                        </td>

                        <td>
                          {passenger.seatNumber}
                        </td>

                        <td>
                          {
                            passenger.previousTripsCount
                          }
                        </td>

                        <td>
                          <button
                            type="button"
                            className="open-modal-button"
                            onClick={() =>
                              setSelectedPassenger(
                                passenger,
                              )
                            }
                          >
                            Открыть
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedPassenger && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedPassenger(null)
          }
        >
          <div
            className="modal-window"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={() =>
                setSelectedPassenger(null)
              }
            >
              ×
            </button>

            <div className="modal-card">
              <div className="modal-header">
                <h3>
                  {selectedPassenger.fullName}
                </h3>

                <p>
                  <strong>Рейс:</strong>{' '}
                  {flight.flightNumber}
                </p>

                <p>
                  <strong>Терминал:</strong>{' '}
                  {flight.terminalName}
                </p>
              </div>

              <div className="modal-section">
                <h4>Основные данные</h4>

                <p>
                  <strong>
                    Гражданство:
                  </strong>{' '}
                  {
                    selectedPassenger.citizenship
                  }
                </p>

                <p>
                  <strong>
                    Номер паспорта:
                  </strong>{' '}
                  {
                    selectedPassenger.passportNumber
                  }
                </p>

                <p>
                  <strong>Место:</strong>{' '}
                  {selectedPassenger.seatNumber}
                </p>

                <p>
                  <strong>
                    Дата рождения:
                  </strong>{' '}
                  {selectedPassenger.birthDate}
                </p>

                <p>
                  <strong>Пол:</strong>{' '}
                  {selectedPassenger.gender}
                </p>

                <p>
                  <strong>
                    Срок действия паспорта:
                  </strong>{' '}
                  {
                    selectedPassenger.passportExpiryDate
                  }
                </p>

                <p>
                  <strong>
                    Предыдущих поездок:
                  </strong>{' '}
                  {
                    selectedPassenger.previousTripsCount
                  }
                </p>
              </div>

              <div className="modal-section">
                <h4>Примечание</h4>

                <p>
                  {
                    selectedPassenger.description
                  }
                </p>
              </div>

              <div className="modal-section">
                <h4>Изображение документа</h4>

                <img
                  src={selectedPassenger.imageUrl}
                  alt={`Документ пассажира ${selectedPassenger.fullName}`}
                  className="modal-passport-image"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}