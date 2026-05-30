import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadRequestsThunk,
  updateRequestsFiltersThunk,
} from '../features/requests/requestsThunks';

function normalizeDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

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
    const [dd, mm, yyyy] = parts;

    if (dd && mm && yyyy) {
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  return trimmed.slice(0, 10);
}

export default function RequestsPage() {
  const dispatch = useAppDispatch();

  const { items, filters, status, error } = useAppSelector(
    (state) => state.requests,
  );

  const draft = useAppSelector((state) => state.requestDraft.draft);
  const draftPassengers = useAppSelector((state) => state.requestDraft.passengers);
  const role = useAppSelector((state) => state.auth.role);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    void dispatch(loadRequestsThunk());
  }, [dispatch, filters.dateFrom, filters.dateTo, filters.status]);

  const visibleItems = useMemo(() => {
    const list = [...items];

    if (draft && draft.status === 'draft') {
      const exists = list.some((item) => item.id === draft.id);

      if (!exists) {
        list.unshift({
          id: draft.id,
          status: draft.status,
          creatorLogin: user?.login ?? 'operator1',
          moderatorLogin: null,
          createdAt: draft.createdAt,
          formedAt: draft.formedAt ?? null,
          completedAt: null,
          passengerCount: draftPassengers.length,
        });
      }
    }

    return list.filter((request) => {
      const matchesStatus = filters.status
        ? request.status.toLowerCase().includes(filters.status.toLowerCase())
        : true;

      if (request.status === 'draft') {
        return matchesStatus;
      }

      const dateSource = request.formedAt ?? request.createdAt ?? '';
      const normalizedDate = normalizeDate(dateSource);

      const matchesDateFrom = filters.dateFrom
        ? normalizedDate >= filters.dateFrom
        : true;

      const matchesDateTo = filters.dateTo
        ? normalizedDate <= filters.dateTo
        : true;

      return matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [
    items,
    draft,
    draftPassengers.length,
    user?.login,
    filters.dateFrom,
    filters.dateTo,
    filters.status,
  ]);

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>{role === 'moderator' ? 'Все заявки' : 'Мои заявки'}</h1>

          <div className="user-summary">
            <p>
              <strong>Диапазон даты формирования:</strong>{' '}
              {filters.dateFrom || '—'} — {filters.dateTo || '—'}
            </p>
          </div>

          <div className="filters-block">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                dispatch(
                  updateRequestsFiltersThunk({ dateFrom: event.target.value }),
                )
              }
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                dispatch(
                  updateRequestsFiltersThunk({ dateTo: event.target.value }),
                )
              }
            />

            <input
              type="text"
              placeholder="Статус заявки"
              value={filters.status}
              onChange={(event) =>
                dispatch(
                  updateRequestsFiltersThunk({ status: event.target.value }),
                )
              }
            />
          </div>

          {status === 'loading' && (
            <LoadingSpinner text="Загрузка заявок..." />
          )}

          {error && <p className="error-text">{error}</p>}

          {!visibleItems.length && status !== 'loading' ? (
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
                    <th>Дата создания</th>
                    <th>Дата формирования</th>
                    <th>Пассажиров</th>
                    <th>Действия</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleItems.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.status}</td>
                      <td>{request.creatorLogin ?? '—'}</td>
                      <td>{request.moderatorLogin ?? '—'}</td>
                      <td>{request.createdAt ?? '—'}</td>
                      <td>{request.formedAt ?? '—'}</td>
                      <td>{request.passengerCount ?? '—'}</td>
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