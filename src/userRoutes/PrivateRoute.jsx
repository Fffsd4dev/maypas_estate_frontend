import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import AdminLayout from '@/layouts/AdminLayout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={{
          pathname: '/auth/sign-in-2',
        }}
        replace
        state={{ from: location }}
      />
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default PrivateRoute;
