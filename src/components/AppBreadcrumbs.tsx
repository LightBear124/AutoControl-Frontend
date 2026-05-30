import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCurrentMockUser } from '../mock/auth';

export default function AppBreadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const user = getCurrentMockUser();

  if (!user && location.pathname === '/') {
    return (
      <Breadcrumb>
        <Breadcrumb.Item active>Логин</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (!user) {
    return null;
  }

  if (location.pathname === '/flights') {
    return (
      <Breadcrumb>
        <Breadcrumb.Item active>Рейсы</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  if (location.pathname.startsWith('/flights/')) {
    return (
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/flights' }}>
          Рейсы
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Рейс #{params.id}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  return null;
}