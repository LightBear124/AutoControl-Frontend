import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';

import {
  getMockRequestById,
  type MockRequestPassengerRecord,
} from '../mock/mockDatabase';

import { getMockSession } from '../mock/mockSession';

export default function MockRequestDetailPage() {
  const { id } = useParams();

  const user = getMockSession();
  const requestId = Number(id);

  const [
    selectedPassenger,
    setSelectedPassenger,
  ] =
    useState<MockRequestPassengerRecord | null>(
      null,
    );

  if (!user) {
    return null;
  }

  const request =
    getMockRequestById(requestId, user);

  if (!request) {
    return (
      <div className="app-page">
        <AppNavbar />

        <main className="page-shell">
          <section className="page-card">
            <p>Заявка не найдена.</p>
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
          <h1>
            Заявка №{request.id}
          </h1>

          <p>
            <strong>Статус:</strong>{' '}
            {request.status}
          </p>

          <p>
            <strong>Создатель:</strong>{' '}
            {request.creatorLogin}
          </p>

          <p>
            <strong>Модератор:</strong>{' '}
            {request.moderatorLogin ?? '—'}
          </p>

          <p>
            <strong>Терминал:</strong>{' '}
            {request.terminalName}
          </p>

          <p>
            <strong>Дата создания:</strong>{' '}
            {request.createdAt}
          </p>

          <p>
            <strong>
              Дата формирования:
            </strong>{' '}
            {request.formedAt ?? '—'}
          </p>

          <div className="page-back-link">
            <Link
              to="/requests"
              className="inline-page-link"
            >
              ← Назад к заявкам
            </Link>
          </div>

          <h2>
            Пассажиры в заявке
          </h2>

          {request.passengers.length === 0 ? (
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
                    <th>Решение</th>
                    <th>Действия</th>
                  </tr>
                </thead>

                <tbody>
                  {request.passengers.map(
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
                          {passenger.decision ??
                            'pending'}
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
                  <strong>Заявка:</strong>{' '}
                  №{request.id}
                </p>

                <p>
                  <strong>Решение:</strong>{' '}
                  {selectedPassenger.decision ??
                    'pending'}
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
                <h4>
                  Изображение документа
                </h4>

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