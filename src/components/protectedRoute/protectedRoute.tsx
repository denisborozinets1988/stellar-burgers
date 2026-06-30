import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUser } from '../../slices/userSlice';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Только для не авторизованных. Редирект если авторизован.
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname} replace />;
  }

  // Только для авторизованных. Редирект если не авторизован.
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
