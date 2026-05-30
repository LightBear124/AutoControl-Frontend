import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type RequestListItem = {
  id: number;
  status: string;
  creatorLogin?: string;
  moderatorLogin?: string | null;
  createdAt?: string;
  formedAt?: string | null;
  completedAt?: string | null;
  passengerCount?: number;
};

type RequestsFilters = {
  dateFrom: string;
  dateTo: string;
  status: string;
};

type RequestsState = {
  items: RequestListItem[];
  selectedRequest: RequestListItem | null;
  filters: RequestsFilters;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

function getTodayInputDate(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

function getDefaultFilters(): RequestsFilters {
  const today = getTodayInputDate();

  return {
    dateFrom: today,
    dateTo: today,
    status: '',
  };
}

const initialState: RequestsState = {
  items: [],
  selectedRequest: null,
  filters: getDefaultFilters(),
  status: 'idle',
  error: null,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    requestsStart(state) {
      state.status = 'loading';
      state.error = null;
    },

    requestsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },

    setRequests(state, action: PayloadAction<RequestListItem[]>) {
      state.items = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },

    setSelectedRequest(state, action: PayloadAction<RequestListItem | null>) {
      state.selectedRequest = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },

    setRequestsFilters(
      state,
      action: PayloadAction<Partial<RequestsFilters>>,
    ) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    updateRequestStatus(
      state,
      action: PayloadAction<{
        requestId: number;
        status: string;
        formedAt?: string | null;
        completedAt?: string | null;
      }>,
    ) {
      const request = state.items.find(
        (item) => item.id === action.payload.requestId,
      );

      if (request) {
        request.status = action.payload.status;

        if (action.payload.formedAt !== undefined) {
          request.formedAt = action.payload.formedAt;
        }

        if (action.payload.completedAt !== undefined) {
          request.completedAt = action.payload.completedAt;
        }
      }

      if (state.selectedRequest?.id === action.payload.requestId) {
        state.selectedRequest = {
          ...state.selectedRequest,
          status: action.payload.status,
          formedAt:
            action.payload.formedAt !== undefined
              ? action.payload.formedAt
              : state.selectedRequest.formedAt,
          completedAt:
            action.payload.completedAt !== undefined
              ? action.payload.completedAt
              : state.selectedRequest.completedAt,
        };
      }
    },

    removeRequest(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);

      if (state.selectedRequest?.id === action.payload) {
        state.selectedRequest = null;
      }
    },

    clearRequestsFilters(state) {
      state.filters = getDefaultFilters();
    },

    clearRequestsState(state) {
      state.items = [];
      state.selectedRequest = null;
      state.status = 'idle';
      state.error = null;
      state.filters = getDefaultFilters();
    },
  },
});

export const {
  requestsStart,
  requestsFailure,
  setRequests,
  setSelectedRequest,
  setRequestsFilters,
  updateRequestStatus,
  removeRequest,
  clearRequestsFilters,
  clearRequestsState,
} = requestsSlice.actions;

export default requestsSlice.reducer;