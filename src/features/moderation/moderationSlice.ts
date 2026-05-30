import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModerationRequestItem = {
  id: number;
  status: string;
  creatorLogin?: string;
  moderatorLogin?: string | null;
  createdAt?: string;
  formedAt?: string | null;
  completedAt?: string | null;
  passengerCount?: number;
};

type ModerationFilters = {
  dateFrom: string;
  dateTo: string;
  status: string;
  creatorSearch: string;
};

type ModerationState = {
  allRequests: ModerationRequestItem[];
  filters: ModerationFilters;
  pollingEnabled: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ModerationState = {
  allRequests: [],
  filters: {
    dateFrom: '',
    dateTo: '',
    status: '',
    creatorSearch: '',
  },
  pollingEnabled: false,
  status: 'idle',
  error: null,
};

const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    moderationStart(state) {
      state.status = 'loading';
      state.error = null;
    },

    moderationFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },

    setModerationRequests(
      state,
      action: PayloadAction<ModerationRequestItem[]>,
    ) {
      state.allRequests = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },

    setModerationFilters(
      state,
      action: PayloadAction<Partial<ModerationFilters>>,
    ) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearModerationFilters(state) {
      state.filters = {
        dateFrom: '',
        dateTo: '',
        status: '',
        creatorSearch: '',
      };
    },

    setPollingEnabled(state, action: PayloadAction<boolean>) {
      state.pollingEnabled = action.payload;
    },

    updateModerationRequestStatus(
      state,
      action: PayloadAction<{
        requestId: number;
        status: string;
      }>,
    ) {
      const request = state.allRequests.find(
        (item) => item.id === action.payload.requestId,
      );

      if (request) {
        request.status = action.payload.status;
      }
    },

    clearModerationState(state) {
      state.allRequests = [];
      state.filters = {
        dateFrom: '',
        dateTo: '',
        status: '',
        creatorSearch: '',
      };
      state.pollingEnabled = false;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  moderationStart,
  moderationFailure,
  setModerationRequests,
  setModerationFilters,
  clearModerationFilters,
  setPollingEnabled,
  updateModerationRequestStatus,
  clearModerationState,
} = moderationSlice.actions;

export default moderationSlice.reducer;