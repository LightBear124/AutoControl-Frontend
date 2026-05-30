import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import {
  getMockRequestsForUser,
} from '../mock/mockDatabase';
import { getMockSession } from '../mock/mockSession';

type RequestFilters = {
  status: string;
  dateFrom: string;
  dateTo: string;
};

function getStorageKey(login: string): string {
  return `autocontrol_mock_request_filters:${login}`;
}

function loadFilters(login: string): RequestFilters {
  try {
    const saved = localStorage.getItem(
      getStorageKey(login),
    );

    if (!saved) {
      return {
        status: '',
        dateFrom: '',
        dateTo: '',
      };
    }

    return JSON.parse(saved) as RequestFilters;
  } catch {
    return {
      status: '',
      dateFrom: '',
      dateTo: '',
    };
  }
}

function normalizeDate(value: string): string {
  const parts = value.split(' ')[0].split('.');

  if (parts.length !== 3) {
    return '';
  }

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
}

export default function MockRequestsPage() {
  const user = getMockSession();

  const [filters, setFilters] = useState<RequestFilters>(() =>
    loadFilters(user?.login ?? 'guest'),
  );

  if (!user) {
    return null;
  }

  const updateFilters = (
    patch: Partial<RequestFilters>,
  ) => {
    const nextFilters = {
      ...filters,
      ...patch,
    };

    setFilters(nextFilters);

    localStorage.setItem(
      getStorageKey(user.login),
      JSON.stringify(nextFilters),
    );
  };

  const requests = useMemo(() => {
    return getMockRequestsForUser(user).filter((request) => {
      const matchesStatus = filters.status
        ? request.status
            .toLowerCase()
            .includes(filters.status.toLowerCase())
        : true;

      const date = normalizeDate(
        request.formedAt ??
        request.createdAt,
      );

      const matchesDateFrom = filters.dateFrom
        ? date >= filters.dateFrom
        : true;

      const matchesDateTo = filters.dateTo
        ? date <= filters.dateTo
        : true;

      return (
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [filters, user]);

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>
            {user.role === 'moderator'
              ? 'Все заявки'
              : 'Мои заявки'}
          </h1>

          <div className="user-summary">
            <p>
              <strong>Пользователь:</strong>{' '}
              {user.fullName}
            </p>

            <p>
              <strong>Роль:</strong>{' '}
              {user.role}
            </p>

            <p>
              <strong>Источник данных:</strong>{' '}
              Mock-данные PWA
            </p>
          </div>

          <div className="filters-block">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                updateFilters({
                  dateFrom: event.target.value,
                })
              }
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                updateFilters({
                  dateTo: event.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Статус заявки"
              value={filters.status}
              onChange={(event) =>
                updateFilters({
                  status: event.target.value,
                })
              }
            />
          </div>

          {requests.length === 0 ? (
            <p>Список заявок пока пуст.</p>
          ) : (
            <div className="table-wrap">
              <table className="passengers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Статус</th>
                    <th>Создатель</th>
                    <th>Модератор</th>
                    <th>Терминал</th>
                    <th>Дата создания</th>
                    <th>Дата формирования</th>
                    <th>Пассажиров</th>
                    <th>Действия</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.status}</td>
                      <td>{request.creatorLogin}</td>
                      <td>
                        {request.moderatorLogin ?? '—'}
                      </td>
                      <td>{request.terminalName}</td>
                      <td>{request.createdAt}</td>
                      <td>{request.formedAt ?? '—'}</td>
                      <td>{request.passengers.length}</td>
                      <td>
                        <Link
                          to={`/requests/${request.id}`}
                          className="topbar-link"
                          style={{ color: '#0f4aa3' }}
                        >
                          Открыть
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}