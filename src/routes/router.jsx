import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateRoute from '@/routes/PrivateRoute';
import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes } from '@/routes';
import { Suspense } from 'react';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

const AppRouter = (props) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Suspense fallback={<LoadingSpinner />}>
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

        {/* Protected App Routes */}
        {appRoutes
          .filter(route => !route.isPublic)
          .map((route, idx) => (
            <Route
              key={`protected-${idx}`}
              path={route.path}
              element={
                <PrivateRoute roles={route.roles}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}

        {/* Public App Routes */}
        {appRoutes
          .filter(route => route.isPublic)
          .map((route, idx) => (
            <Route
              key={`public-${idx}`}
              path={route.path}
              element={route.element}
            />
          ))}

        {/* Fallback Route - redirect based on authentication */}
        <Route
          path="*"
          element={<FallbackRedirect />}
        />
      </Routes>
    </Suspense>
  );
};

// Separate component to access useParams
const FallbackRedirect = () => {
  const { isAuthenticated } = useAuthContext();
  const { tenantSlug } = useParams();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/analytics" replace />;
  } else {
    // If there's a tenantSlug in the URL, redirect to tenant-specific sign-in
    if (tenantSlug) {
      return <Navigate to={`/${tenantSlug}/auth/sign-in`} replace />;
    }
    // Otherwise redirect to default sign-in
    return <Navigate to="/auth/sign-in-2" replace />;
  }
};

export default AppRouter;