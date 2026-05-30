import { mockFlights, mockPassengers } from './data';
import type { MockSessionUser } from './mockSession';

const MOCK_DATABASE_KEY = 'autocontrol_mock_database';

export type MockPassengerRecord = {
  id: number;
  flightId: number;

  fullName: string;
  citizenship: string;
  passportNumber: string;
  seatNumber: string;

  birthDate: string;
  gender: 'Мужской' | 'Женский';
  passportExpiryDate: string;
  previousTripsCount: number;
  description: string;
  imageUrl: string;
};

export type MockRequestPassengerRecord =
  MockPassengerRecord & {
    decision: 'allow' | 'deny' | null;
  };

export type MockRequestRecord = {
  id: number;
  status: 'draft' | 'completed' | 'rejected';

  creatorLogin: string;
  moderatorLogin: string | null;
  terminalName: string;

  createdAt: string;
  formedAt: string | null;
  completedAt: string | null;

  passengers: MockRequestPassengerRecord[];
};

type MockDatabase = {
  passengers: MockPassengerRecord[];
  requests: MockRequestRecord[];
};

type PassengerExtraInfo = Pick<
  MockPassengerRecord,
  | 'birthDate'
  | 'gender'
  | 'passportExpiryDate'
  | 'previousTripsCount'
  | 'description'
  | 'imageUrl'
>;

const passengerExtraInfo: Record<
  number,
  PassengerExtraInfo
> = {
  1: {
    birthDate: '15.04.1987',
    gender: 'Мужской',
    passportExpiryDate: '20.08.2030',
    previousTripsCount: 14,
    description:
      'Постоянный пассажир. Нарушения ранее не зафиксированы.',
    imageUrl: '/passengers/passenger-1.svg',
  },

  2: {
    birthDate: '22.11.1991',
    gender: 'Мужской',
    passportExpiryDate: '12.03.2029',
    previousTripsCount: 8,
    description:
      'Проверка документов выполнена ранее без замечаний.',
    imageUrl: '/passengers/passenger-2.svg',
  },

  3: {
    birthDate: '09.07.1994',
    gender: 'Женский',
    passportExpiryDate: '01.12.2028',
    previousTripsCount: 5,
    description:
      'Требуется дополнительная проверка цели поездки.',
    imageUrl: '/passengers/passenger-3.svg',
  },

  4: {
    birthDate: '03.02.1980',
    gender: 'Мужской',
    passportExpiryDate: '17.06.2031',
    previousTripsCount: 21,
    description:
      'Документы действительны. История поездок без нарушений.',
    imageUrl: '/passengers/passenger-4.svg',
  },

  5: {
    birthDate: '28.09.1996',
    gender: 'Женский',
    passportExpiryDate: '04.04.2027',
    previousTripsCount: 3,
    description:
      'Рекомендуется уточнить сведения о месте пребывания.',
    imageUrl: '/passengers/passenger-5.svg',
  },
};

const defaultExtraInfo: PassengerExtraInfo = {
  birthDate: '—',
  gender: 'Мужской',
  passportExpiryDate: '—',
  previousTripsCount: 0,
  description: 'Дополнительная информация отсутствует.',
  imageUrl: '/passengers/passenger-default.svg',
};

function mapInitialPassengers(): MockPassengerRecord[] {
  return mockPassengers.map((passenger) => ({
    id: passenger.id,
    flightId: passenger.flightId,

    fullName: passenger.fullName,
    citizenship: passenger.citizenship,
    passportNumber: passenger.passportNumber,
    seatNumber: passenger.seatNumber,

    ...(passengerExtraInfo[passenger.id] ??
      defaultExtraInfo),
  }));
}

function getPassenger(
  passengers: MockPassengerRecord[],
  id: number,
  decision: 'allow' | 'deny' | null,
): MockRequestPassengerRecord | null {
  const passenger = passengers.find(
    (item) => item.id === id,
  );

  if (!passenger) {
    return null;
  }

  return {
    ...passenger,
    decision,
  };
}

function createInitialDatabase(): MockDatabase {
  const passengers = mapInitialPassengers();

  const request101Passengers = [
    getPassenger(passengers, 1, 'allow'),
    getPassenger(passengers, 2, 'allow'),
  ].filter(
    (
      item,
    ): item is MockRequestPassengerRecord =>
      item !== null,
  );

  const request102Passengers = [
    getPassenger(passengers, 3, 'deny'),
  ].filter(
    (
      item,
    ): item is MockRequestPassengerRecord =>
      item !== null,
  );

  const request201Passengers = [
    getPassenger(passengers, 4, 'allow'),
    getPassenger(passengers, 5, 'deny'),
  ].filter(
    (
      item,
    ): item is MockRequestPassengerRecord =>
      item !== null,
  );

  return {
    passengers,

    requests: [
      {
        id: 101,
        status: 'completed',

        creatorLogin: 'operator1',
        moderatorLogin: null,
        terminalName: 'Терминал A',

        createdAt: '30.05.2026 09:10',
        formedAt: '30.05.2026 09:25',
        completedAt: '30.05.2026 09:25',

        passengers: request101Passengers,
      },

      {
        id: 102,
        status: 'rejected',

        creatorLogin: 'operator1',
        moderatorLogin: null,
        terminalName: 'Терминал A',

        createdAt: '30.05.2026 10:05',
        formedAt: '30.05.2026 10:18',
        completedAt: '30.05.2026 10:18',

        passengers: request102Passengers,
      },

      {
        id: 201,
        status: 'completed',

        creatorLogin: 'operator2',
        moderatorLogin: null,
        terminalName: 'Терминал B',

        createdAt: '30.05.2026 11:20',
        formedAt: '30.05.2026 11:38',
        completedAt: '30.05.2026 11:38',

        passengers: request201Passengers,
      },
    ],
  };
}

function saveDatabase(
  database: MockDatabase,
): void {
  localStorage.setItem(
    MOCK_DATABASE_KEY,
    JSON.stringify(database),
  );
}

export function getMockDatabase(): MockDatabase {
  try {
    const saved = localStorage.getItem(
      MOCK_DATABASE_KEY,
    );

    if (!saved) {
      const initialDatabase =
        createInitialDatabase();

      saveDatabase(initialDatabase);

      return initialDatabase;
    }

    return JSON.parse(saved) as MockDatabase;
  } catch {
    const initialDatabase =
      createInitialDatabase();

    saveDatabase(initialDatabase);

    return initialDatabase;
  }
}

export function resetMockDatabase(): void {
  localStorage.removeItem(MOCK_DATABASE_KEY);
}

export function getMockFlightsForUser(
  user: MockSessionUser,
) {
  if (user.role === 'moderator') {
    return mockFlights;
  }

  return mockFlights.filter(
    (flight) =>
      flight.terminalName === user.terminalName,
  );
}

export function getMockPassengersByFlightId(
  flightId: number,
): MockPassengerRecord[] {
  const database = getMockDatabase();

  return database.passengers.filter(
    (passenger) =>
      passenger.flightId === flightId,
  );
}

export function getMockRequestsForUser(
  user: MockSessionUser,
): MockRequestRecord[] {
  const database = getMockDatabase();

  if (user.role === 'moderator') {
    return database.requests;
  }

  return database.requests.filter(
    (request) =>
      request.creatorLogin === user.login,
  );
}

export function getMockRequestById(
  requestId: number,
  user: MockSessionUser,
): MockRequestRecord | null {
  const requests =
    getMockRequestsForUser(user);

  return (
    requests.find(
      (request) => request.id === requestId,
    ) ?? null
  );
}