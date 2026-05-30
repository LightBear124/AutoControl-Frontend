import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'guest' | 'operator' | 'moderator';

export type AuthUser = {
  id: number;
  login: string;
  fullName: string;
  role: 'operator' | 'moderator';
  terminalId: number | null;
  terminalName: string | null;
  source: 'api' | 'mock';
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: 'guest',
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.status = 'loading';
      state.error = null;
    },

    authSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.status = 'succeeded';
      state.error = null;
    },

    authFailure(state, action: PayloadAction<string>) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = 'guest';
      state.status = 'failed';
      state.error = action.payload;
    },

    logoutSuccess(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = 'guest';
      state.status = 'idle';
      state.error = null;
    },

    clearAuthError(state) {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;