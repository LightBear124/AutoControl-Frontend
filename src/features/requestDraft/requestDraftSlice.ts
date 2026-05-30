import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DraftPassenger = {
  id: number;
  fullName: string;
  citizenship: string;
  passportNumber: string;
  seatNumber: string;
  decision?: 'allow' | 'deny' | null;
};

export type DraftRequest = {
  id: number;
  status: string;
  createdAt?: string;
  formedAt?: string | null;
};

type RequestDraftState = {
  draft: DraftRequest | null;
  passengers: DraftPassenger[];
  hasDraft: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: RequestDraftState = {
  draft: null,
  passengers: [],
  hasDraft: false,
  status: 'idle',
  error: null,
};

const requestDraftSlice = createSlice({
  name: 'requestDraft',
  initialState,
  reducers: {
    requestDraftStart(state) {
      state.status = 'loading';
      state.error = null;
    },

    requestDraftFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },

    setDraft(state, action: PayloadAction<DraftRequest | null>) {
      state.draft = action.payload;
      state.hasDraft = action.payload !== null;
      state.status = 'succeeded';
      state.error = null;

      if (action.payload === null) {
        state.passengers = [];
      }
    },

    setDraftPassengers(state, action: PayloadAction<DraftPassenger[]>) {
      state.passengers = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },

    addDraftPassenger(state, action: PayloadAction<DraftPassenger>) {
      const exists = state.passengers.some(
        (passenger) => passenger.id === action.payload.id,
      );

      if (!exists) {
        state.passengers.push(action.payload);
      }

      state.status = 'succeeded';
      state.error = null;
    },

    removeDraftPassenger(state, action: PayloadAction<number>) {
      state.passengers = state.passengers.filter(
        (passenger) => passenger.id !== action.payload,
      );
      state.status = 'succeeded';
      state.error = null;
    },

    updateDraftPassengerDecision(
      state,
      action: PayloadAction<{
        passengerId: number;
        decision: 'allow' | 'deny' | null;
      }>,
    ) {
      const passenger = state.passengers.find(
        (item) => item.id === action.payload.passengerId,
      );

      if (passenger) {
        passenger.decision = action.payload.decision;
      }

      state.status = 'succeeded';
      state.error = null;
    },

    clearDraft(state) {
      state.draft = null;
      state.passengers = [];
      state.hasDraft = false;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  requestDraftStart,
  requestDraftFailure,
  setDraft,
  setDraftPassengers,
  addDraftPassenger,
  removeDraftPassenger,
  updateDraftPassengerDecision,
  clearDraft,
} = requestDraftSlice.actions;

export default requestDraftSlice.reducer;