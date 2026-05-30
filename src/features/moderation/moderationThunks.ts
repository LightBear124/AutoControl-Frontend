import type { AppDispatch } from '../../app/store';
import { crossingsApi } from '../../lib/openapi';
import {
  clearModerationState,
  moderationFailure,
  moderationStart,
  setModerationFilters,
  setModerationRequests,
  setPollingEnabled,
  updateModerationRequestStatus,
  type ModerationRequestItem,
} from './moderationSlice';

type ModerationFilterPayload = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  creatorSearch?: string;
};

type ApiCrossingItem = {
  id: number;
  status: string;
  creator_login?: string;
  moderator_login?: string | null;
  created_at?: string;
  formed_at?: string | null;
  completed_at?: string | null;
  passenger_count?: number;
};

function mapCrossingToModerationItem(
  item: ApiCrossingItem,
): ModerationRequestItem {
  return {
    id: item.id,
    status: item.status,
    creatorLogin: item.creator_login ?? undefined,
    moderatorLogin: item.moderator_login ?? null,
    createdAt: item.created_at ?? undefined,
    formedAt: item.formed_at ?? null,
    completedAt: item.completed_at ?? null,
    passengerCount: item.passenger_count ?? 0,
  };
}

export const loadAllRequestsThunk =
  () => async (dispatch: AppDispatch) => {
    try {
      dispatch(moderationStart());

      const response = await crossingsApi.apiCrossingsGet();
      const data = Array.isArray(response.data) ? response.data : [];

      dispatch(
        setModerationRequests(
          (data as ApiCrossingItem[]).map(mapCrossingToModerationItem),
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки списка заявок модератора';
      dispatch(moderationFailure(message));
    }
  };

export const updateModerationFiltersThunk =
  (filters: ModerationFilterPayload) => (dispatch: AppDispatch) => {
    dispatch(setModerationFilters(filters));
  };

export const enableModerationPollingThunk =
  () => (dispatch: AppDispatch) => {
    dispatch(setPollingEnabled(true));
  };

export const disableModerationPollingThunk =
  () => (dispatch: AppDispatch) => {
    dispatch(setPollingEnabled(false));
  };

export const changeRequestStatusThunk =
  (requestId: number, status: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(moderationStart());

      if (status === 'completed') {
        await crossingsApi.apiCrossingsIdCompletePut({
          id: requestId,
        } as never);
      } else if (status === 'rejected') {
        await crossingsApi.apiCrossingsIdRejectPut({
          id: requestId,
        } as never);
      }

      dispatch(
        updateModerationRequestStatus({
          requestId,
          status,
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка изменения статуса заявки';
      dispatch(moderationFailure(message));
    }
  };

export const clearModerationThunk = () => (dispatch: AppDispatch) => {
  dispatch(clearModerationState());
};