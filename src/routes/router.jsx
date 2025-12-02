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



// import React from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import AuthLayout from '@/layouts/AuthLayout';
// import AdminLayout from '@/layouts/AdminLayout';
// import PrivateRoute from '@/routes/PrivateRoute';
// import { useAuthContext } from '@/context/useAuthContext';
// import { appRoutes, authRoutes } from '@/routes';

// const AppRouter = (props) => {
//   const { isAuthenticated } = useAuthContext();

//   return (
//     <Routes>
//       {/* Public Auth Routes */}
//       {authRoutes.map((route, idx) => (
//         <Route
//           key={`auth-${idx}`}
//           path={route.path}
//           element={
//             <AuthLayout {...props}>
//               {route.element}
//             </AuthLayout>
//           }
//         />
//       ))}

//       {/* Private App Routes */}
//       {/* {appRoutes.map((route, idx) => {
//         const routeElement = route.isPublic ? (
//           route.element
//         ) : (
//           <PrivateRoute roles={route.roles}>
//             {route.element}
//           </PrivateRoute>
//         );

//         return (
//           <Route
//             key={`app-${idx}`}
//             path={route.path}
//             element={
//               isAuthenticated ? (
//                 <AdminLayout {...props}>{routeElement}</AdminLayout>
//               ) : (
//                 <Navigate
//                   to={{
//                     pathname: '/auth/sign-in-2',
//                     search: `redirectTo=${route.path}`,
//                   }}
//                   replace
//                 />
//               )
//             }
//           />
//         );
//       })} */}

//       {/* // AppRouter.jsx */}
// {appRoutes.map((route, idx) => (
//   <Route
//     key={`app-${idx}`}
//     path={route.path}
//     element={
//       route.isPublic ? (
//         route.element
//       ) : (
//         <PrivateRoute roles={route.roles}>
//           {route.element}
//         </PrivateRoute>
//       )
//     }
//   />
// ))}


//       {/* Fallback Routes */}
//       <Route
//         path="*"
//         element={<Navigate to={isAuthenticated ? '/' : '/auth/sign-in-2'} />}
//       />
//     </Routes>
//   );
// };

// export default AppRouter;




import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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

  // const {user} = useAuthContext();
  // console.log({user});

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
          element={
            <Navigate 
              to={isAuthenticated ? '/dashboard/analytics' : '/auth/sign-in-2'} 
              replace 
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

