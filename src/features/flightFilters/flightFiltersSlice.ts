import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getMockSession } from '../../mock/mockSession';

export type FlightDirectionFilter =
  | 'all'
  | 'arrival'
  | 'departure';

export type FlightFiltersState = {
  ownerLogin: string;
  search: string;
  direction: FlightDirectionFilter;
  status: string;
  dateFrom: string;
  dateTo: string;
};

const FILTERS_STORAGE_PREFIX = 'autocontrol_flight_filters';

function normalizeLogin(
  login: string | null | undefined,
): string {
  return login?.trim() || 'guest';
}

function getStorageKey(
  login: string | null | undefined,
): string {
  return `${FILTERS_STORAGE_PREFIX}:${normalizeLogin(login)}`;
}

function createEmptyFilters(
  login: string | null | undefined,
): FlightFiltersState {
  return {
    ownerLogin: normalizeLogin(login),
    search: '',
    direction: 'all',
    status: '',
    dateFrom: '',
    dateTo: '',
  };
}

function loadFilters(
  login: string | null | undefined,
): FlightFiltersState {
  const ownerLogin = normalizeLogin(login);

  try {
    const saved = localStorage.getItem(
      getStorageKey(ownerLogin),
    );

    if (!saved) {
      return createEmptyFilters(ownerLogin);
    }

    const parsed = JSON.parse(
      saved,
    ) as Partial<FlightFiltersState>;

    const direction: FlightDirectionFilter =
      parsed.direction === 'arrival' ||
      parsed.direction === 'departure'
        ? parsed.direction
        : 'all';

    return {
      ownerLogin,
      search: parsed.search ?? '',
      direction,
      status: parsed.status ?? '',
      dateFrom: parsed.dateFrom ?? '',
      dateTo: parsed.dateTo ?? '',
    };
  } catch {
    return createEmptyFilters(ownerLogin);
  }
}

function saveFilters(
  state: FlightFiltersState,
): void {
  localStorage.setItem(
    getStorageKey(state.ownerLogin),
    JSON.stringify({
      search: state.search,
      direction: state.direction,
      status: state.status,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
    }),
  );
}

const initialLogin =
  getMockSession()?.login ?? 'guest';

const initialState: FlightFiltersState =
  loadFilters(initialLogin);

const flightFiltersSlice = createSlice({
  name: 'flightFilters',

  initialState,

  reducers: {
    loadFlightFiltersForUser(
      _state,
      action: PayloadAction<
        string | null | undefined
      >,
    ) {
      return loadFilters(action.payload);
    },

    setFlightSearch(
      state,
      action: PayloadAction<string>,
    ) {
      state.search = action.payload;
      saveFilters(state);
    },

    setFlightDirection(
      state,
      action: PayloadAction<FlightDirectionFilter>,
    ) {
      state.direction = action.payload;
      saveFilters(state);
    },

    setFlightStatus(
      state,
      action: PayloadAction<string>,
    ) {
      state.status = action.payload;
      saveFilters(state);
    },

    setFlightDateFrom(
      state,
      action: PayloadAction<string>,
    ) {
      state.dateFrom = action.payload;
      saveFilters(state);
    },

    setFlightDateTo(
      state,
      action: PayloadAction<string>,
    ) {
      state.dateTo = action.payload;
      saveFilters(state);
    },

    clearFlightFilters(state) {
      const ownerLogin = state.ownerLogin;

      localStorage.removeItem(
        getStorageKey(ownerLogin),
      );

      return createEmptyFilters(ownerLogin);
    },
  },
});

export const {
  loadFlightFiltersForUser,
  setFlightSearch,
  setFlightDirection,
  setFlightStatus,
  setFlightDateFrom,
  setFlightDateTo,
  clearFlightFilters,
} = flightFiltersSlice.actions;

export default flightFiltersSlice.reducer;