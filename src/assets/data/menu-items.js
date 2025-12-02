export const MENU_ITEMS = [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboards',
  icon: 'iconamoon:category-duotone',
  label: 'Dashboards',
  url: '/dashboard/finance',
  // children: [{
  //   key: 'dashboard-analytics',
  //   label: 'Analytics',
  //   url: '/dashboard/analytics',
  //   parentKey: 'dashboards'
  // }, {
  //   key: 'dashboard-finance',
  //   label: 'Finance',
  //   url: '/dashboard/finance',
  //   parentKey: 'dashboards'
  // }, {
  //   key: 'dashboard-sales',
  //   label: 'Sales',
  //   url: '/dashboard/sales',
  //   parentKey: 'dashboards'
  // }]
}, {
  key: 'users',
  label: 'USERS',
  isTitle: true
}, {
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Account',
  children: [{
    key: 'account-admin',
    label: 'Admins',
    url: '/accounts/admin',
    parentKey: 'users'
  }, {
    key: 'account-roles',
    label: 'Admin Roles',
    url: '/accounts/admin-roles',
    parentKey: 'users'
  }, {
    key: 'account-user',
    label: 'Estate Managers',
    url: '/accounts/estate-managers',
    parentKey: 'users'
  }]
}, {
  key: 'properties',
  label: 'PROPERTIES',
  isTitle: true
}, {
  key: 'properties',
  icon: 'iconamoon:home-duotone',
  label: 'Apartments',
  children: [{
    key: 'apartment-categories',
    label: 'Categories',
    url: '/properties/apartment-categories',
    parentKey: 'properties'
  }, {
    key: 'apartment-amenities',
    label: 'Amenities',
    url: '/properties/apartment-amenities',
    parentKey: 'properties'
  }, {
    key: 'apartment-speciality',
    label: 'Speciality',
    url: '/properties/apartment-speciality',
    parentKey: 'properties'
  }]
}];