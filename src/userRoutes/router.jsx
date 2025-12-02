// import { Navigate, Route, Routes } from 'react-router-dom';
// import AuthLayout from '@/layouts/AuthLayout';
// import { useAuthContext } from '@/context/useAuthContext';
// import { appRoutes, authRoutes } from '@/routes/index';
// import AdminLayout from '@/layouts/AdminLayout';
// const AppRouter = props => {
//   const {
//     isAuthenticated
//   } = useAuthContext();
//   return <Routes>
//       {(authRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />)}

//       {(appRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <AdminLayout {...props}>{route.element}</AdminLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}
//     </Routes>;
// };
// export default AppRouter;



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
  console.log(user);
  
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

      {/* Private App Routes */}
      {/* {appRoutes.map((route, idx) => {
        const routeElement = route.isPublic ? (
          route.element
        ) : (
          <PrivateRoute roles={route.roles}>
            {route.element}
          </PrivateRoute>
        );

        return (
          <Route
            key={`app-${idx}`}
            path={route.path}
            element={
              isAuthenticated ? (
                <AdminLayout {...props}>{routeElement}</AdminLayout>
              ) : (
                <Navigate
                  to={{
                    pathname: '/auth/sign-in-2',
                    search: `redirectTo=${route.path}`,
                  }}
                  replace
                />
              )
            }
          />
        );
      })} */}

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

