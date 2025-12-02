import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
// import Admin from '@/app/(admin)/admin/page';

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));
const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'));
const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'));

// Apps Routes
const Admin = lazy(() => import('@/app/(admin)/admin/page'));
const AdminRoles = lazy(() => import('@/app/(admin)/adminroles/page'));
const EstateManagers = lazy(() => import('@/app/(admin)/estatemanagers/page'));


// Not Found Routes
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'));

// Auth Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'));
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'));
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'));
const AuthSignUp2 = lazy(() => import('@/app/(other)/auth/sign-up-2/page'));
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'));
const ResetPassword2 = lazy(() => import('@/app/(other)/auth/reset-pass-2/page'));
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'));
const LockScreen2 = lazy(() => import('@/app/(other)/auth/lock-screen-2/page'));
const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/auth/sign-in-2" />
}, {
  path: '*',
  name: 'not-found',
  element: <NotFound />
}];
const generalRoutes = [{
  path: '/dashboard/analytics',
  name: 'Analytics',
  element: <Analytics />,
  // route: PrivateRoute,
  // isPublic: false
}, {
  path: '/dashboard/finance',
  name: 'Finance',
  element: <Finance />,
  // route: PrivateRoute,
  // isPublic: false
}, {
  path: '/dashboard/sales',
  name: 'Sales',
  element: <Sales />,
  // route: PrivateRoute,
  // isPublic: false
}];
const appsRoutes = [{
  name: 'Admins',
  path: '/accounts/admin',
  element: <Admin />
}, {
  name: 'Admin Roles',
  path: '/accounts/admin-roles',
  element: <AdminRoles />
}, {
  name: 'Estate Managers',
  path: '/accounts/estate-managers',
  element: <EstateManagers />
}];

export const authRoutes = [{
  path: '/:tenantSlug/auth/sign-in',
  name: 'Sign In',
  element: <AuthSignIn />
}, {
  name: 'Sign In 2',
  path: '/auth/sign-in-2',
  element: <AuthSignIn2 />
}, {
  name: 'Sign Up',
  path: '/auth/sign-up',
  element: <AuthSignUp />
}, {
  name: 'Sign Up 2',
  path: '/auth/sign-up-2',
  element: <AuthSignUp2 />
}, {
  name: 'Reset Password',
  path: '/auth/reset-pass',
  element: <ResetPassword />
}, {
  name: 'Reset Password 2',
  path: '/reset-password',
  element: <ResetPassword2 />
}, {
  name: 'Lock Screen',
  path: '/auth/lock-screen',
  element: <LockScreen />
}, {
  name: 'Lock Screen 2',
  path: '/auth/lock-screen-2',
  element: <LockScreen2 />
}];
export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...authRoutes];