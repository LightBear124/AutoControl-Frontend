import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  changeRequestStatusThunk,
  disableModerationPollingThunk,
  enableModerationPollingThunk,
  loadAllRequestsThunk,
  updateModerationFiltersThunk,
} from '../features/moderation/moderationThunks';

export default function ModeratorRequestsPage() {
  const dispatch = useAppDispatch();

  const { allRequests, filters, pollingEnabled, status, error } = useAppSelector(
    (state) => state.moderation,
  );

  useEffect(() => {
    void dispatch(loadAllRequestsThunk());
    dispatch(enableModerationPollingThunk());

    return () => {
      dispatch(disableModerationPollingThunk());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!pollingEnabled) {
      return;
    }

    const timer = window.setInterval(() => {
      void dispatch(loadAllRequestsThunk());
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [dispatch, pollingEnabled]);

  const filteredRequests = useMemo(() => {
    return allRequests.filter((item) => {
      const matchesStatus = filters.status
        ? item.status.toLowerCase().includes(filters.status.toLowerCase())
        : true;

      const matchesCreator = filters.creatorSearch
        ? (item.creatorLogin ?? '')
            .toLowerCase()
            .includes(filters.creatorSearch.toLowerCase())
        : true;

      const createdDate = item.createdAt ?? '';

      const matchesDateFrom = filters.dateFrom
        ? createdDate >= filters.dateFrom
        : true;

      const matchesDateTo = filters.dateTo
        ? createdDate <= filters.dateTo
        : true;

      return matchesStatus && matchesCreator && matchesDateFrom && matchesDateTo;
    });
  }, [allRequests, filters]);

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          <h1>Все заявки</h1>

          <div className="filters-block">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                dispatch(
                  updateModerationFiltersThunk({ dateFrom: event.target.value }),
                )
              }
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                dispatch(
                  updateModerationFiltersThunk({ dateTo: event.target.value }),
                )
              }
            />

            <input
              type="text"
              placeholder="Статус заявки"
              value={filters.status}
              onChange={(event) =>
                dispatch(
                  updateModerationFiltersThunk({ status: event.target.value }),
                )
              }
            />

            <input
              type="text"
              placeholder="Создатель заявки"
              value={filters.creatorSearch}
              onChange={(event) =>
                dispatch(
                  updateModerationFiltersThunk({
                    creatorSearch: event.target.value,
                  }),
                )
              }
            />
          </div>

          {status === 'loading' && <p>Загрузка списка заявок...</p>}
          {error && <p className="error-text">{error}</p>}

          {!filteredRequests.length && status !== 'loading' ? (
            <p>Список заявок пуст.</p>
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
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.status}</td>
                      <td>{request.creatorLogin ?? '—'}</td>
                      <td>{request.moderatorLogin ?? '—'}</td>
                      <td>{request.createdAt ?? '—'}</td>
                      <td>{request.formedAt ?? '—'}</td>
                      <td>{request.passengerCount ?? '—'}</td>
                      <td>
                        <div className="decision-actions">
                          <Link
                            to={`/requests/${request.id}`}
                            className="topbar-link"
                            style={{ color: '#0f4aa3' }}
                          >
                            Открыть
                          </Link>

                          <button
                            type="button"
                            className="complete-button"
                            onClick={() =>
                              void dispatch(
                                changeRequestStatusThunk(
                                  request.id,
                                  'completed',
                                ),
                              )
                            }
                          >
                            Выполнить
                          </button>

                          <button
                            type="button"
                            className="reject-button"
                            onClick={() =>
                              void dispatch(
                                changeRequestStatusThunk(
                                  request.id,
                                  'rejected',
                                ),
                              )
                            }
                          >
                            Отклонить
                          </button>
                        </div>
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