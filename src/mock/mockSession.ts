import { mockUsers, type MockAppUser } from './mockUsers';

const MOCK_SESSION_KEY = 'autocontrol_mock_session';

export type MockSessionUser = Omit<MockAppUser, 'password'>;

function removePassword(user: MockAppUser): MockSessionUser {
  return {
    id: user.id,
    login: user.login,
    fullName: user.fullName,
    role: user.role,
    terminalId: user.terminalId,
    terminalName: user.terminalName,
  };
}

export function loginMockUser(
  login: string,
  password: string,
): MockSessionUser {
  const normalizedLogin = login.trim();

  const user = mockUsers.find(
    (item) =>
      item.login === normalizedLogin &&
      item.password === password,
  );

  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  const sessionUser = removePassword(user);

  localStorage.setItem(
    MOCK_SESSION_KEY,
    JSON.stringify(sessionUser),
  );

  return sessionUser;
}

export function getMockSession(): MockSessionUser | null {
  try {
    const saved = localStorage.getItem(MOCK_SESSION_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved) as MockSessionUser;
  } catch {
    localStorage.removeItem(MOCK_SESSION_KEY);
    return null;
  }
}

export function logoutMockUser(): void {
  localStorage.removeItem(MOCK_SESSION_KEY);
}