import type { AppDispatch } from '../../app/store';
import {
  authFailure,
  authStart,
  authSuccess,
  logoutSuccess,
  type AuthUser,
} from './authSlice';
import { clearDraft } from '../requestDraft/requestDraftSlice';
import { clearRequestsState } from '../requests/requestsSlice';
import { clearModerationState } from '../moderation/moderationSlice';
import { authApi } from '../../lib/openapi';

type LoginResponse = {
  message?: string;
  user: {
    id: number;
    login: string;
    full_name: string;
    role: string;
    terminal_id: number | null;
  };
  session_id?: string;
};

function mapApiUser(apiUser: LoginResponse['user']): AuthUser {
  return {
    id: apiUser.id,
    login: apiUser.login,
    fullName: apiUser.full_name,
    role: apiUser.role as 'operator' | 'moderator',
    terminalId: apiUser.terminal_id,
    terminalName:
      apiUser.terminal_id === 1
        ? 'Терминал A'
        : apiUser.terminal_id === 2
          ? 'Терминал B'
          : null,
    source: 'api',
  };
}

export const loginThunk =
  (loginValue: string, passwordValue: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());

      const response = await authApi.apiUsersLoginPost({
        request: {
          login: loginValue,
          password: passwordValue,
        },
      });

      const data = response.data as LoginResponse;

      if (!data?.user) {
        throw new Error('Сервер не вернул данные пользователя');
      }

      dispatch(authSuccess(mapApiUser(data.user)));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка авторизации';
      dispatch(authFailure(message));
      throw error;
    }
  };

export const logoutThunk = () => async (dispatch: AppDispatch) => {
  try {
    await authApi.apiUsersLogoutPost();
  } catch {
    // даже если logout endpoint не ответил, redux всё равно очищаем
  }

  dispatch(clearDraft());
  dispatch(clearRequestsState());
  dispatch(clearModerationState());
  dispatch(logoutSuccess());
};

export const restoreAuthThunk = () => (dispatch: AppDispatch) => {
  dispatch(logoutSuccess());
};