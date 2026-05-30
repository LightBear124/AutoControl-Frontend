import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getMockSession } from '../mock/mockSession';

type MockProtectedRouteProps = {
  children: ReactNode;
};

export default function MockProtectedRoute({
  children,
}: MockProtectedRouteProps) {
  const session = getMockSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}