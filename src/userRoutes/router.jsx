import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import PrivateRoute from '@/routes/PrivateRoute';
import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes } from '@/routes';

const AppRouter = (props) => {
  const { isAuthenticated } = useAuthContext();

  const {user} = useAuthContext();
  
  const  tenantSlug  = user?.tenant;
  return (
    <Routes>
      {/* Public Auth Routes */}
      {authRoutes.map((route, idx) => (
        <Route
          key={`auth-${idx}`}
          path={route.path}
          element={
            <AuthLayout {...props}>
              {route.element}
            </AuthLayout>
          }
        />
      ))}

      {/* // AppRouter.jsx */}
{appRoutes.map((route, idx) => (
  <Route
    key={`app-${idx}`}
    path={route.path}
    element={
      route.isPublic ? (
        route.element
      ) : (
        <PrivateRoute roles={route.roles}>
          {route.element}
        </PrivateRoute>
      )
    }
  />
))}


      {/* Fallback Routes */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/auth/sign-in-2'} />}
      />
    </Routes>
  );
};

export default AppRouter;

