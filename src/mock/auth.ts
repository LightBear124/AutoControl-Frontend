import { mockUsers } from './data';
import type { MockUser } from '../types';

export type UserRole = 'operator' | 'moderator';

export type AuthUser = {
  id: number;
  login: string;
  fullName: string;
  role: UserRole;
  terminalId: number | null;
  terminalName: string | null;
  source: 'api' | 'mock';
};

type ApiUser = {
  id: number;
  login: string;
  full_name: string;
  role: string;
  terminal_id: number | null;
};

const STORAGE_KEY = 'currentUser';
const API_BASE_URL = '/api';

function saveCurrentUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function mapApiUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    login: apiUser.login,
    fullName: apiUser.full_name,
    role: apiUser.role as UserRole,
    terminalId: apiUser.terminal_id,
    terminalName: null,
    source: 'api',
  };
}

function mapMockUser(user: MockUser): AuthUser {
  return {
    id: user.id,
    login: user.login,
    fullName: user.fullName,
    role: user.role,
    terminalId: null,
    terminalName: user.terminalName,
    source: 'mock',
  };
}

async function loginViaApi(login: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });

  if (!response.ok) {
    let message = 'Ошибка авторизации';

    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  const data = (await response.json()) as {
    message: string;
    user: ApiUser;
  };

  return mapApiUser(data.user);
}

function loginViaMock(login: string, password: string): AuthUser {
  const user = (mockUsers as MockUser[]).find(
    (item) => item.login === login && item.password === password,
  );

  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  return mapMockUser(user);
}

export async function login(
  loginValue: string,
  passwordValue: string,
): Promise<AuthUser> {
  try {
    const user = await loginViaApi(loginValue, passwordValue);
    saveCurrentUser(user);
    return user;
  } catch (apiError) {
    try {
      const user = loginViaMock(loginValue, passwordValue);
      saveCurrentUser(user);
      return user;
    } catch {
      throw apiError instanceof Error
        ? apiError
        : new Error('Ошибка авторизации');
    }
  }
}

export async function logout(): Promise<void> {
  const currentUser = getCurrentUser();

  if (currentUser?.source === 'api') {
    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // ignore
    }
  }

  saveCurrentUser(null);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getCurrentMockUser(): AuthUser | null {
  return getCurrentUser();
}

export async function loginMock(
  loginValue: string,
  passwordValue: string,
): Promise<AuthUser> {
  return login(loginValue, passwordValue);
}

export async function logoutMock(): Promise<void> {
  await logout();
}

export function isModerator(user: AuthUser | null): boolean {
  return user?.role === 'moderator';
}

export function isOperator(user: AuthUser | null): boolean {
  return user?.role === 'operator';
}

export function canAccessTerminal(
  user: AuthUser | null,
  terminalName: string | null,
): boolean {
  if (!user) {
    return false;
  }

  if (user.role === 'moderator') {
    return true;
  }

  if (user.terminalName && terminalName) {
    return user.terminalName === terminalName;
  }

  if (user.terminalId !== null && terminalName) {
    if (user.terminalId === 1 && terminalName === 'Терминал A') {
      return true;
    }

    if (user.terminalId === 2 && terminalName === 'Терминал B') {
      return true;
    }
  }

  return false;
}