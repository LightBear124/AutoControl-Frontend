import type { MockFlight, MockPassenger, MockUser } from '../types';

export const mockUsers: MockUser[] = [
  {
    id: 1,
    login: 'operator1',
    password: 'test_hash_1',
    fullName: 'Оператор Терминала A',
    role: 'operator',
    terminalName: 'Терминал A',
  },
  {
    id: 2,
    login: 'operator2',
    password: 'test_hash_2',
    fullName: 'Оператор Терминала B',
    role: 'operator',
    terminalName: 'Терминал B',
  },
  {
    id: 3,
    login: 'moderator',
    password: 'moderator',
    fullName: 'Главный модератор',
    role: 'moderator',
    terminalName: null,
  },
];

// дальше оставляешь свои mockFlights и mockPassengers

export const mockFlights: MockFlight[] = [
  {
    id: 1,
    flightNumber: 'SU100',
    terminalName: 'Терминал A',
    direction: 'departure',
    routeName: 'Москва — Стамбул',
    flightDate: '2026-04-10 10:30',
    status: 'boarding',
  },
  {
    id: 2,
    flightNumber: 'SU101',
    terminalName: 'Терминал A',
    direction: 'arrival',
    routeName: 'Анталья — Москва',
    flightDate: '2026-04-10 12:20',
    status: 'arrived',
  },
  {
    id: 3,
    flightNumber: 'DP204',
    terminalName: 'Терминал B',
    direction: 'departure',
    routeName: 'Москва — Ереван',
    flightDate: '2026-04-11 08:10',
    status: 'registration',
  },
  {
    id: 4,
    flightNumber: 'B2730',
    terminalName: 'Терминал B',
    direction: 'arrival',
    routeName: 'Минск — Москва',
    flightDate: '2026-04-11 14:45',
    status: 'landed',
  },
];

export const mockPassengers: MockPassenger[] = [
  {
    id: 1,
    flightId: 1,
    fullName: 'Иванов Иван Иванович',
    citizenship: 'Россия',
    passportNumber: '4510 123456',
    seatNumber: '12A',
  },
  {
    id: 2,
    flightId: 1,
    fullName: 'Smith John Michael',
    citizenship: 'США',
    passportNumber: '71 2345678',
    seatNumber: '12B',
  },
  {
    id: 3,
    flightId: 2,
    fullName: 'Garcia Maria Elena',
    citizenship: 'Испания',
    passportNumber: 'PA2345678',
    seatNumber: '14C',
  },
  {
    id: 4,
    flightId: 3,
    fullName: 'Петров Пётр Петрович',
    citizenship: 'Россия',
    passportNumber: '4011 567890',
    seatNumber: '5D',
  },
  {
    id: 5,
    flightId: 4,
    fullName: 'Sargsyan Arman',
    citizenship: 'Армения',
    passportNumber: 'AM998877',
    seatNumber: '9F',
  },
];