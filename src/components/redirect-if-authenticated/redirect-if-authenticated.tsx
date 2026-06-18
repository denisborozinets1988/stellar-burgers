import { Navigate, useLocation } from 'react-router-dom';

interface RedirectIfAuthenticatedProps {
  children: JSX.Element;
}

export const RedirectIfAuthenticated = ({
  children
}: RedirectIfAuthenticatedProps) => {
  const user = null;
  const location = useLocation();

  if (user) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }

  return children;
};
