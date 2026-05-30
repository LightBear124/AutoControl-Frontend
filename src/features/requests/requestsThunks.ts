import type { AppDispatch } from '../../app/store';
import { crossingsApi } from '../../lib/openapi';
import {
  requestsFailure,
  requestsStart,
  setRequests,
  setSelectedRequest,
  setRequestsFilters,
  type RequestListItem,
} from './requestsSlice';
import { setDraft, setDraftPassengers } from '../requestDraft/requestDraftSlice';

type RequestsFilterPayload = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
};

type ApiCrossingItem = {
  id: number;
  status: string;

  creator_login?: string;
  moderator_login?: string | null;

  created_at?: string;
  formed_at?: string | null;
  completed_at?: string | null;

  createdAt?: string;
  formedAt?: string | null;
  completedAt?: string | null;

  creation_date?: string;
  formation_date?: string | null;
  completion_date?: string | null;

  created_date?: string;
  formed_date?: string | null;
  completed_date?: string | null;

  passenger_count?: number;
  passengers_count?: number;
};

type ApiCrossingDetail = {
  id: number;
  status: string;

  creator_login?: string;
  moderator_login?: string | null;

  created_at?: string;
  formed_at?: string | null;
  completed_at?: string | null;

  createdAt?: string;
  formedAt?: string | null;
  completedAt?: string | null;

  creation_date?: string;
  formation_date?: string | null;
  completion_date?: string | null;

  created_date?: string;
  formed_date?: string | null;
  completed_date?: string | null;

  flight_number?: string;
  terminal_name?: string;
  inspection_result?: string;
  approved_count?: number;
  passengers?: ApiCrossingPassenger[];
};

type ApiNestedPassenger = {
  id?: number;
  full_name?: string;
  citizenship?: string;
  passport_number?: string;
  seat_number?: string;
};

type ApiCrossingPassenger = {
  id?: number;

  full_name?: string;
  citizenship?: string;
  passport_number?: string;
  seat_number?: string;

  decision?: string | null;

  passenger_id?: number;
  passenger?: ApiNestedPassenger;

  order_number?: number;
  is_primary?: boolean;
};

function pickCreatedAt(item: ApiCrossingItem | ApiCrossingDetail): string | undefined {
  return (
    item.created_at ??
    item.createdAt ??
    item.creation_date ??
    item.created_date ??
    undefined
  );
}

function pickFormedAt(item: ApiCrossingItem | ApiCrossingDetail): string | null {
  return (
    item.formed_at ??
    item.formedAt ??
    item.formation_date ??
    item.formed_date ??
    null
  );
}

function pickCompletedAt(item: ApiCrossingItem | ApiCrossingDetail): string | null {
  return (
    item.completed_at ??
    item.completedAt ??
    item.completion_date ??
    item.completed_date ??
    null
  );
}

function mapCrossingToRequestItem(item: ApiCrossingItem): RequestListItem {
  return {
    id: item.id,
    status: item.status,
    creatorLogin: item.creator_login ?? undefined,
    moderatorLogin: item.moderator_login ?? null,
    createdAt: pickCreatedAt(item),
    formedAt: pickFormedAt(item),
    completedAt: pickCompletedAt(item),
    passengerCount: item.passenger_count ?? item.passengers_count ?? 0,
  };
}

function mapCrossingPassengerToDraftPassenger(
  passenger: ApiCrossingPassenger,
  index: number,
) {
  const nested = passenger.passenger;

  const rowId =
    passenger.id ??
    passenger.passenger_id ??
    nested?.id ??
    index + 1;

  const decision: 'allow' | 'deny' | null =
    passenger.decision === 'allow'
      ? 'allow'
      : passenger.decision === 'deny'
        ? 'deny'
        : null;

  return {
    id: rowId,
    fullName:
      passenger.full_name ??
      nested?.full_name ??
      'Неизвестный пассажир',
    citizenship:
      passenger.citizenship ??
      nested?.citizenship ??
      '—',
    passportNumber:
      passenger.passport_number ??
      nested?.passport_number ??
      '—',
    seatNumber:
      passenger.seat_number ??
      nested?.seat_number ??
      '—',
    decision,
  };
}

export const loadRequestsThunk =
  () => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestsStart());

      const response = await crossingsApi.apiCrossingsGet();

      const data = Array.isArray(response.data) ? response.data : [];

      const items = (data as ApiCrossingItem[]).map(mapCrossingToRequestItem);

      dispatch(setRequests(items));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки списка заявок';

      dispatch(requestsFailure(message));
    }
  };

export const loadRequestByIdThunk =
  (requestId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestsStart());

      const response = await crossingsApi.apiCrossingsIdGet({
        id: requestId,
      } as never);

      const data = response.data as ApiCrossingDetail | null;

      if (!data) {
        dispatch(setSelectedRequest(null));
        dispatch(setDraft(null));
        dispatch(setDraftPassengers([]));
        return;
      }

      const createdAt = pickCreatedAt(data);
      const formedAt = pickFormedAt(data);
      const completedAt = pickCompletedAt(data);

      dispatch(
        setSelectedRequest({
          id: data.id,
          status: data.status,
          creatorLogin: data.creator_login ?? undefined,
          moderatorLogin: data.moderator_login ?? null,
          createdAt,
          formedAt,
          completedAt,
          passengerCount: data.passengers?.length ?? 0,
        }),
      );

      dispatch(
        setDraft({
          id: data.id,
          status: data.status,
          createdAt,
          formedAt,
        }),
      );

      dispatch(
        setDraftPassengers(
          (data.passengers ?? []).map(mapCrossingPassengerToDraftPassenger),
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки заявки';

      dispatch(requestsFailure(message));
    }
  };

export const updateRequestsFiltersThunk =
  (filters: RequestsFilterPayload) => (dispatch: AppDispatch) => {
    dispatch(setRequestsFilters(filters));
  };