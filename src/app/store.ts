import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import requestDraftReducer from '../features/requestDraft/requestDraftSlice';
import requestsReducer from '../features/requests/requestsSlice';
import moderationReducer from '../features/moderation/moderationSlice';
import flightFiltersReducer from '../features/flightFilters/flightFiltersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requestDraft: requestDraftReducer,
    requests: requestsReducer,
    moderation: moderationReducer,
    flightFilters: flightFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;