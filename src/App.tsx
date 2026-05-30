import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MockProtectedRoute from './components/MockProtectedRoute';

import LoginPage from './pages/LoginPage';
import MockLoginPage from './pages/MockLoginPage';

import HomePage from './pages/HomePage';

import FlightsPage from './pages/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import MockFlightDetailPage from './pages/MockFlightDetailPage';

import RequestsPage from './pages/RequestsPage';
import RequestDetailPage from './pages/RequestDetailPage';
import MockRequestsPage from './pages/MockRequestsPage';
import MockRequestDetailPage from './pages/MockRequestDetailPage';

import ModeratorRequestsPage from './pages/ModeratorRequestsPage';
import RegisterOperatorPage from './pages/RegisterOperatorPage';
import ProfilePage from './pages/ProfilePage';

import { IS_MOCK_MODE } from './config/runtime';
import { getMockSession } from './mock/mockSession';

export default function App() {
  if (IS_MOCK_MODE) {
    const mockSession = getMockSession();

    return (
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={mockSession ? '/home' : '/login'}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<MockLoginPage />}
        />

        <Route
          path="/home"
          element={
            <MockProtectedRoute>
              <HomePage />
            </MockProtectedRoute>
          }
        />

        <Route
          path="/flights"
          element={
            <MockProtectedRoute>
              <FlightsPage />
            </MockProtectedRoute>
          }
        />

        <Route
          path="/flights/:id"
          element={
            <MockProtectedRoute>
              <MockFlightDetailPage />
            </MockProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <MockProtectedRoute>
              <MockRequestsPage />
            </MockProtectedRoute>
          }
        />

        <Route
          path="/requests/:id"
          element={
            <MockProtectedRoute>
              <MockRequestDetailPage />
            </MockProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={mockSession ? '/home' : '/login'}
              replace
            />
          }
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/flights"
        element={
          <ProtectedRoute>
            <FlightsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/flights/:id"
        element={
          <ProtectedRoute>
            <FlightDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <RequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/moderator/requests"
        element={
          <ProtectedRoute>
            <ModeratorRequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/moderator/register-operator"
        element={
          <ProtectedRoute>
            <RegisterOperatorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}