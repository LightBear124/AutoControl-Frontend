import type { AppDispatch } from '../../app/store';
import { authApi } from '../../lib/openapi';
import { moderationFailure, moderationStart } from './moderationSlice';

type RegisterOperatorPayload = {
  login: string;
  password: string;
  fullName: string;
  terminalId: number;
};

export const registerOperatorThunk =
  (payload: RegisterOperatorPayload) => async (dispatch: AppDispatch) => {
    try {
      dispatch(moderationStart());

      await authApi.apiUsersRegisterPost({
        request: {
          login: payload.login,
          password: payload.password,
          full_name: payload.fullName,
          role: 'operator',
          terminal_id: payload.terminalId,
        },
      } as never);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка регистрации оператора';
      dispatch(moderationFailure(message));
      throw error;
    }
  };