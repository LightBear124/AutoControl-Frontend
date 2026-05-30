export type MockUser = {
  id: number;
  login: string;
  password: string;
  fullName: string;
  role: 'operator' | 'moderator';
  terminalName: string | null;
};

export type MockFlight = {
  id: number;
  flightNumber: string;
  terminalName: string;
  direction: 'arrival' | 'departure';
  routeName: string;
  flightDate: string;
  status: string;
};

export type MockPassenger = {
  id: number;
  flightId: number;
  fullName: string;
  citizenship: string;
  passportNumber: string;
  seatNumber: string;
};