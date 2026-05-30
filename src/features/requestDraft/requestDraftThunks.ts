import type { AppDispatch } from '../../app/store';
import { crossingsApi, apiAxios } from '../../lib/openapi';
import {
  addDraftPassenger,
  clearDraft,
  removeDraftPassenger,
  requestDraftFailure,
  requestDraftStart,
  setDraft,
  setDraftPassengers,
  updateDraftPassengerDecision,
} from './requestDraftSlice';

type DraftPassengerPayload = {
  id: number;
  fullName: string;
  citizenship: string;
  passportNumber: string;
  seatNumber: string;
  decision?: 'allow' | 'deny' | null;
};

type DraftRequestPayload = {
  id: number;
  status: string;
  createdAt?: string;
  formedAt?: string | null;
};

type ApiCrossingDraft = {
  id?: number;
  status?: string;
  created_at?: string;
  formed_at?: string | null;
};

function mapDraft(data: ApiCrossingDraft): DraftRequestPayload {
  return {
    id: Number(data.id),
    status: data.status || 'draft',
    createdAt: data.created_at,
    formedAt: data.formed_at ?? null,
  };
}

function isActiveDraft(data: ApiCrossingDraft | null): data is ApiCrossingDraft {
  if (!data?.id) {
    return false;
  }

  if (!data.status) {
    return true;
  }

  return data.status === 'draft';
}

export const loadDraftThunk =
  () => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      const draftResponse = await crossingsApi.apiCrossingsCartGet();
      const draftData = draftResponse.data as ApiCrossingDraft | null;

      if (!isActiveDraft(draftData)) {
        dispatch(clearDraft());
        dispatch(setDraftPassengers([]));
        return;
      }

      dispatch(setDraft(mapDraft(draftData)));
    } catch (error) {
      dispatch(clearDraft());
      dispatch(setDraftPassengers([]));

      const message =
        error instanceof Error ? error.message : 'Ошибка загрузки черновика';
      dispatch(requestDraftFailure(message));
    }
  };

export const setDraftThunk =
  (draft: DraftRequestPayload | null) => (dispatch: AppDispatch) => {
    dispatch(setDraft(draft));
  };

export const setDraftPassengersThunk =
  (passengers: DraftPassengerPayload[]) => (dispatch: AppDispatch) => {
    dispatch(setDraftPassengers(passengers));
  };

export const addPassengerToDraftThunk =
  (passenger: DraftPassengerPayload) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      const response = await apiAxios.post('/api/crossing-passengers', {
        passenger_id: passenger.id,
      });

      const responseData = response.data as
        | {
            id?: number;
            crossing_id?: number;
            crossing?: {
              id?: number;
              status?: string;
              created_at?: string;
              formed_at?: string | null;
            };
            status?: string;
            created_at?: string;
            formed_at?: string | null;
          }
        | undefined;

      const draftId =
        responseData?.crossing?.id ??
        responseData?.crossing_id ??
        responseData?.id;

      if (draftId) {
        dispatch(
          setDraft({
            id: Number(draftId),
            status: responseData?.crossing?.status ?? responseData?.status ?? 'draft',
            createdAt: responseData?.crossing?.created_at ?? responseData?.created_at,
            formedAt:
              responseData?.crossing?.formed_at ??
              responseData?.formed_at ??
              null,
          }),
        );
      }

      dispatch(addDraftPassenger(passenger));
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка добавления пассажира в черновик';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const removePassengerFromDraftThunk =
  (passengerId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      dispatch(removeDraftPassenger(passengerId));
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка удаления пассажира из черновика';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const allowPassengerThunk =
  (passengerId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      dispatch(
        updateDraftPassengerDecision({
          passengerId,
          decision: 'allow',
        }),
      );

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка подтверждения пассажира';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const denyPassengerThunk =
  (passengerId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      dispatch(
        updateDraftPassengerDecision({
          passengerId,
          decision: 'deny',
        }),
      );

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка отказа пассажиру';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const completeDraftThunk =
  (crossingId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      await apiAxios.put(`/api/crossings/${crossingId}/complete`);

      dispatch(clearDraft());
      dispatch(setDraftPassengers([]));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка завершения заявки';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const rejectDraftThunk =
  (crossingId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      await apiAxios.put(`/api/crossings/${crossingId}/reject`);

      dispatch(clearDraft());
      dispatch(setDraftPassengers([]));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка отклонения заявки';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const deleteDraftThunk =
  (crossingId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(requestDraftStart());

      await apiAxios.delete(`/api/crossings/${crossingId}`);

      dispatch(clearDraft());
      dispatch(setDraftPassengers([]));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка удаления заявки';
      dispatch(requestDraftFailure(message));
      throw error;
    }
  };

export const clearDraftThunk = () => (dispatch: AppDispatch) => {
  dispatch(clearDraft());
  dispatch(setDraftPassengers([]));
};