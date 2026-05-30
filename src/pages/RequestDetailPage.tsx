import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadRequestByIdThunk,
  loadRequestsThunk,
} from '../features/requests/requestsThunks';
import { removeRequest } from '../features/requests/requestsSlice';
import {
  allowPassengerThunk,
  denyPassengerThunk,
  removePassengerFromDraftThunk,
  completeDraftThunk,
  rejectDraftThunk,
  deleteDraftThunk,
} from '../features/requestDraft/requestDraftThunks';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedRequest = useAppSelector((state) => state.requests.selectedRequest);
  const draftPassengers = useAppSelector((state) => state.requestDraft.passengers);
  const requestsStatus = useAppSelector((state) => state.requests.status);
  const requestsError = useAppSelector((state) => state.requests.error);

  const requestId = Number(id);

  useEffect(() => {
    if (Number.isFinite(requestId) && requestId > 0) {
      void dispatch(loadRequestByIdThunk(requestId));
    }
  }, [dispatch, requestId]);

  const currentRequest = useMemo(() => selectedRequest, [selectedRequest]);
  const isDraft = currentRequest?.status === 'draft';

  const handleAllow = async (passengerId: number) => {
    try {
      await dispatch(allowPassengerThunk(passengerId));
    } catch {
      //
    }
  };

  const handleDeny = async (passengerId: number) => {
    try {
      await dispatch(denyPassengerThunk(passengerId));
    } catch {
      //
    }
  };

  const handleRemovePassenger = async (passengerId: number) => {
    try {
      await dispatch(removePassengerFromDraftThunk(passengerId));
    } catch {
      //
    }
  };

  const handleCompleteRequest = async () => {
    if (!currentRequest) {
      return;
    }

    try {
      await dispatch(completeDraftThunk(currentRequest.id));
      await dispatch(loadRequestsThunk());
      navigate('/requests');
    } catch {
      //
    }
  };

  const handleRejectRequest = async () => {
    if (!currentRequest) {
      return;
    }

    try {
      await dispatch(rejectDraftThunk(currentRequest.id));
      await dispatch(loadRequestsThunk());
      navigate('/requests');
    } catch {
      //
    }
  };

  const handleDeleteRequest = async () => {
    if (!currentRequest) {
      return;
    }

    try {
      await dispatch(deleteDraftThunk(currentRequest.id));
      dispatch(removeRequest(currentRequest.id));
      await dispatch(loadRequestsThunk());
      navigate('/requests');
    } catch {
      //
    }
  };

  return (
    <div className="app-page">
      <AppNavbar />

      <main className="page-shell">
        <section className="page-card">
          {requestsStatus === 'loading' && !currentRequest && (
            <LoadingSpinner text="Загрузка заявки..." />
            )}

          {requestsError && !currentRequest && (
            <p className="error-text">{requestsError}</p>
          )}

          {!currentRequest && requestsStatus !== 'loading' ? (
            <p>Заявка не найдена.</p>
          ) : (
            <>
              <div className="request-header">
                <div>
                  <h1>Заявка №{currentRequest?.id}</h1>
                  <p>
                    <strong>Статус:</strong> {currentRequest?.status}
                  </p>
                  <p>
                    <strong>Создатель:</strong>{' '}
                    {currentRequest?.creatorLogin ?? '—'}
                  </p>
                  <p>
                    <strong>Дата создания:</strong>{' '}
                    {currentRequest?.createdAt ?? '—'}
                  </p>
                  <p>
                    <strong>Дата формирования:</strong>{' '}
                    {currentRequest?.formedAt ?? '—'}
                  </p>
                </div>

                {isDraft && (
                  <div className="request-top-actions">
                    <button
                      type="button"
                      className="complete-button"
                      onClick={() => void handleCompleteRequest()}
                    >
                      Завершить выполнением
                    </button>
                    <button
                      type="button"
                      className="reject-button"
                      onClick={() => void handleRejectRequest()}
                    >
                      Завершить отказом
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => void handleDeleteRequest()}
                    >
                      Удалить заявку
                    </button>
                  </div>
                )}
              </div>

              <h2>Пассажиры в заявке</h2>

              {!draftPassengers.length ? (
                <p>В заявке пока нет пассажиров.</p>
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
                      {draftPassengers.map((passenger) => (
                        <tr key={passenger.id}>
                          <td>{passenger.id}</td>
                          <td>{passenger.fullName}</td>
                          <td>{passenger.citizenship}</td>
                          <td>{passenger.passportNumber}</td>
                          <td>{passenger.seatNumber}</td>
                          <td>{passenger.decision ?? 'pending'}</td>
                          <td>
                            {isDraft ? (
                              <div className="decision-actions">
                                <button
                                  type="button"
                                  className="allow-button"
                                  onClick={() => void handleAllow(passenger.id)}
                                >
                                  Пропустить
                                </button>
                                <button
                                  type="button"
                                  className="deny-button"
                                  onClick={() => void handleDeny(passenger.id)}
                                >
                                  Отказать
                                </button>
                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={() =>
                                    void handleRemovePassenger(passenger.id)
                                  }
                                >
                                  Удалить
                                </button>
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}