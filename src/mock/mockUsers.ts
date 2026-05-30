export type MockAppUser = {
  id: number;
  login: string;
  password: string;
  fullName: string;
  role: 'operator' | 'moderator';
  terminalId: number | null;
  terminalName: string | null;
};

export const mockUsers: MockAppUser[] = [
  {
    id: 1,
    login: 'operator1',
    password: 'password1',
    fullName: 'Оператор Терминала A',
    role: 'operator',
    terminalId: 1,
    terminalName: 'Терминал A',
  },
  {
    id: 2,
    login: 'operator2',
    password: 'password2',
    fullName: 'Оператор Терминала B',
    role: 'operator',
    terminalId: 2,
    terminalName: 'Терминал B',
  },
  {
    id: 3,
    login: 'moderator1',
    password: 'password3',
    fullName: 'Модератор системы',
    role: 'moderator',
    terminalId: null,
    terminalName: null,
  },
];