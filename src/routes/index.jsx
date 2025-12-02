import ApartmentUnits from '@/app/(admin)/apartments/components/ApartmentUnits';
import InvoiceDetailPage  from '@/app/(admin)/invoices/components/InvoiceDetailPage';
import RentCyclesPage from '@/app/(admin)/rentmanagers/components/RentCyclesPage';
// import Technicians from '@/app/(admin)/technicians/page';
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));
const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'));
const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'));
const IconaMoonIcons = lazy(() => import('@/app/(admin)/icons/iconamoon/page'));
const Invoices = lazy(() => import('@/app/(admin)/invoices/page'));
const Branding = lazy(() => import('@/app/(admin)/branding/page'));
// const InvoiceDetails = lazy(() => import('@/app/(admin)/invoices/[invoiceId]/page'));

// Apps Routes
const Admin = lazy(() => import('@/app/(admin)/admin/page'));
const AdminRoles = lazy(() => import('@/app/(admin)/adminroles/page'));
const UserTypes = lazy(() => import('@/app/(admin)/usertype/page'));
const EstateManagers = lazy(() => import('@/app/(admin)/estatemanagers/page'));
const ApartmentCategories = lazy(() => import('@/app/(admin)/apartmentcategories/page'));
const ApartmentAmenities = lazy(() => import('@/app/(admin)/apartmentamenities/page'));
const ApartmentSpeciality = lazy(() => import('@/app/(admin)/apartmentspeciality/page'));
const Landlords = lazy(() => import('@/app/(admin)/landlords/page'));
const Apartments = lazy(() => import('@/app/(admin)/apartments/page'));
const Tenants = lazy(() => import('@/app/(admin)/tenants/page'));
const RentManagers = lazy(() => import('@/app/(admin)/rentmanagers/page'));
const Technicians = lazy(() => import('@/app/(admin)/technicians/page'));
const ChargesApartment = lazy(() => import('@/app/(admin)/charges/page'));
const Charges = lazy(() => import('@/app/(admin)/charges/ApartmentCharges'));
const Complaints = lazy(() => import('@/app/(admin)/complaints/page'));
const TenantComplaints = lazy(() => import('@/app/(admin)/tenantcomplaints/page'));
const Maintenance = lazy(() => import('@/app/(admin)/maintenance/page'));
const MaintenanceComplaints = lazy(() => import('@/app/(admin)/maintenancecomplaints/page'));

// Not Found Routes
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'));
// const Unauthorized = lazy(() => import('@/app/(other)/(error-pages)/error-401/page'));

// Auth Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'));
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'));
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'));
const ManagerAuthSignUp = lazy(() => import('@/app/(other)/auth/managers-sign-up/page'));
const AuthSignUp2 = lazy(() => import('@/app/(other)/auth/sign-up-2/page'));
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'));
const ForgotPassword = lazy(() => import('@/app/(other)/auth/forgot-pass/page'));
const ResetPassword2 = lazy(() => import('@/app/(other)/auth/reset-pass-2/page'));
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'));
const LockScreen2 = lazy(() => import('@/app/(other)/auth/lock-screen-2/page'));

// Loading component for Suspense fallback
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

// Wrapper for lazy components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/auth/sign-in-2" />,
  isPublic: true
}, {
  path: '*',
  name: 'not-found',
  element: withSuspense(NotFound),
  isPublic: true
}
];

const generalRoutes = [{
  path: '/dashboard/analytics',
  name: 'Analytics',
  element: withSuspense(Analytics),
  isPublic: false
}, {
  path: '/dashboard/finance',
  name: 'Finance',
  element: withSuspense(Finance),
  isPublic: false
}, {
  path: '/:tenantSlug/dashboard/finance',
  name: 'Finance',
  element: withSuspense(Finance),
  isPublic: false
}, {
  path: '/dashboard/sales',
  name: 'Sales',
  element: withSuspense(Sales),
  isPublic: false
}];

const appsRoutes = [{
  name: 'Admins',
  path: '/accounts/admin',
  element: withSuspense(Admin),
  isPublic: false,
  roles: ['admin'] // Example role-based access
}, {
  name: 'Admin Roles',
  path: '/accounts/admin-roles',
  element: withSuspense(AdminRoles),
  isPublic: false,
  roles: ['super-admin'] // Example role-based access
}, {
  name: 'Estate Managers',
  path: '/accounts/estate-managers',
  element: withSuspense(EstateManagers),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Categories',
  path: '/properties/apartment-categories',
  element: withSuspense(ApartmentCategories),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Amenities',
  path: '/properties/apartment-amenities',
  element: withSuspense(ApartmentAmenities),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Speciality',
  path: '/properties/apartment-speciality',
  element: withSuspense(ApartmentSpeciality),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}];

const tenantRoutes = [{
  name: 'tenants Admins',
  path: '/:tenantSlug/accounts/admin',
  element: withSuspense(Admin),
  isPublic: false,
  roles: ['admin'] // Example role-based access
}, {
  name: 'Tenants Admin Roles',
  path: '/:tenantSlug/accounts/user-types',
  element: withSuspense(UserTypes),
  isPublic: false,
  roles: ['landlord'] // Example role-based access
}, {
  name: 'Landlords',
  path: '/:tenantSlug/accounts/landlords',
  element: withSuspense(Landlords),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Estate Managers',
  path: '/:tenantSlug/accounts/tenants',
  element: withSuspense(Tenants),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Apartments',
  path: '/:tenantSlug/properties/apartments',
  element: withSuspense(Apartments),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Apartments Units',
  path: '/:tenantSlug/properties/apartments/:apartmentUuid/units',
  element: withSuspense(ApartmentUnits),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Apartments Complaints',
  path: '/:tenantSlug/properties/complaints',
  element: withSuspense(Complaints),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Tenant Complaints',
  path: '/:tenantSlug/properties/tenant-complaints',
  element: withSuspense(TenantComplaints),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Maintenance',
  path: '/:tenantSlug/properties/maintenance',
  element: withSuspense(Maintenance),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Tenant Maintenance',
  path: '/:tenantSlug/properties/tenant-maintenance',
  element: withSuspense(MaintenanceComplaints),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Rent Manager',
  path: '/:tenantSlug/rent-manager',
  element: withSuspense(RentManagers),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'Rent Cycles',
  path: '/:tenantSlug/rent-accounts/cycles',
  element: withSuspense(RentCyclesPage),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'technicians',
  path: '/:tenantSlug/technicians',
  element: withSuspense(Technicians),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'apartment charges',
  path: '/:tenantSlug/charges',
  element: withSuspense(ChargesApartment),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'charges',
  path: '/:tenantSlug/properties/charges/:apartmentUnitUuid',
  element: withSuspense(Charges),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'charges',
  path: '/:tenantSlug/charges/:apartmentUnitUuid',
  element: withSuspense(Charges),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'branding',
  path: '/:tenantSlug/branding',
  element: withSuspense(Branding),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'invoices',
  path: '/:tenantSlug/invoice',
  element: withSuspense(Invoices),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}, {
  name: 'invoices',
  path: '/:tenantSlug/invoices/:invoiceId',
  element: withSuspense(InvoiceDetailPage),
  isPublic: false,
  roles: ['admin', 'estate-manager'] // Example role-based access
}];

export const authRoutes = [{
  path: '/:tenantSlug/auth/sign-in',
  name: 'tenants Sign In',
  element: withSuspense(AuthSignIn),
  isPublic: true
}, 
{
  name: 'Sign In 2',
  path: '/auth/sign-in-2',
  element: withSuspense(AuthSignIn2),
  isPublic: true
}, {
  name: 'Sign Up',
  path: '/:tenantSlug/auth/sign-up',
  element: withSuspense(AuthSignUp),
  isPublic: true
}, {
  name: 'Sign Up',
  path: '/:tenantSlug/auth/sign-up',
  element: withSuspense(AuthSignUp),
  isPublic: true
}, {
  name: 'Manager Sign Up',
  path: '/auth/sign-up',
  element: withSuspense(ManagerAuthSignUp),
  isPublic: true
}, {
  name: 'Sign Up 2',
  path: '/auth/sign-up-2',
  element: withSuspense(AuthSignUp2),
  isPublic: true
}, {
  name: 'Reset Password',
  path: '/:tenantSlug/reset-password',
  element: withSuspense(ResetPassword),
  isPublic: true
}, {
  name: 'Forgot Password',
  path: '/:tenantSlug/forgot-password',
  element: withSuspense(ForgotPassword),
  isPublic: true
}, {
  name: 'Reset Password 2',
  path: '/reset-password',
  element: withSuspense(ResetPassword2),
  isPublic: true
}, {
  name: 'Lock Screen',
  path: '/auth/lock-screen',
  element: withSuspense(LockScreen),
  isPublic: true
}, {
  name: 'Lock Screen 2',
  path: '/auth/lock-screen-2',
  element: withSuspense(LockScreen2),
  isPublic: true
}, {
  name: 'IconaMoon',
  path: '/icons/iconamoon',
  element: <IconaMoonIcons />
// }, {
//   name: 'Invoices List',
//   path: '/testingestate/invoices',
//   element: <Invoices />
}
// , {
//   name: 'Invoices Details',
//   path: '/invoices/:invoiceId',
//   element: <InvoiceDetails />
// }
];

export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...authRoutes, ...tenantRoutes];