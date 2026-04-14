

export const MENU_ITEMS = (tenantSlug = "") => [{
  key: 'dashboard-finance',
  icon: 'iconamoon:category-duotone',
  label: 'Dashboard',
  url: `/${tenantSlug}/dashboard`,
  allowedUserTypes: ['landlord', 'agent', 'admin'],
  parentKey: 'dashboards'
}, {
  key: 'dashboard-finance',
  icon: 'iconamoon:category-duotone',
  label: 'Dashboard',
  url: `/${tenantSlug}/tenant-dashboard`,
  allowedUserTypes: ['tenant'],
  parentKey: 'dashboards'
}, {
  key: 'subscriptions',
  icon: 'iconamoon:attention-circle-duotone',
  label: 'Subscriptions',
  url: `/${tenantSlug}/subscriptions`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Accounts',
  children: [{
    key: 'account-admin',
    label: 'Admins',
    url: `/${tenantSlug}/accounts/admin`,
    allowedUserTypes: [ 'admin'],
    parentKey: 'users'
  }, {
    key: 'account-roles',
    label: 'User Types',
    url: `/${tenantSlug}/accounts/user-types`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'users'
  }, {
    key: 'account-landlords',
    label: 'Landlords',
    url: `/${tenantSlug}/accounts/landlords`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'users'
  },{
    key: 'account-agents',
    label: 'Property Managers',
    url: `/${tenantSlug}/accounts/property-managers`,
    allowedUserTypes: ['landlord'],
    parentKey: 'users'
  }, {
    key: 'account-tenants',
    label: 'Tenants',
    url: `/${tenantSlug}/accounts/tenants`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'users'
  }]
}, {
  key: 'properties',
  icon: 'iconamoon:home-duotone',
  label: 'Properties',
  children: [{
    key: 'apartment-account',
    label: 'Apartment',
    url: `/${tenantSlug}/properties/apartments`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'properties'
  }, {
    key: 'location',
    label: 'Locations',
    url: `/${tenantSlug}/properties/locations`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'properties'
  }, {
    key: 'branches',
    label: 'Branches',
    url: `/${tenantSlug}/properties/branches`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'properties'
  }]
}, {
  key: 'apartment-complaints',
  icon: 'iconamoon:attention-circle-duotone',
  label: 'Complaints',
  url: `/${tenantSlug}/properties/complaints`,
  allowedUserTypes: ['tenant']
}, {
  key: 'tenant-complaints',
  icon: 'iconamoon:attention-circle-duotone',
  label: 'Tenants Complaints',
  url: `/${tenantSlug}/properties/tenant-complaints`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'documents',
  icon: 'iconamoon:folder-document-duotone',
  label: 'Documents',
  allowedUserTypes: ['landlord', 'agent', 'tenant'],
  children: [{
    key: 'original-documents',
    label: 'Original Documents',
    url: `/${tenantSlug}/documents`,
    allowedUserTypes: [ 'landlord', 'agent'],
    parentKey: 'documents'
  }, {
    key: 'unsigned-documents',
    label: 'Unsigned Documents',
    url: `/${tenantSlug}/documents/unsigned`,
    allowedUserTypes: [ 'landlord', 'agent'],
    parentKey: 'documents'
  }, {
    key: 'unsigned-documents',
    label: 'Unsigned Documents',
    url: `/${tenantSlug}/tenant-documents/unsigned`,
    allowedUserTypes: [ 'tenant'],
    parentKey: 'documents'
  }, {
    key: 'signed-documents',
    label: 'Signed Documents',
    url: `/${tenantSlug}/documents/signed`,
    allowedUserTypes: [ 'landlord', 'agent'],
    parentKey: 'documents'
  }, {
    key: 'signed-documents',
    label: 'Signed Documents',
    url: `/${tenantSlug}/tenant-documents/signed`,
    allowedUserTypes: [ 'tenant'],
    parentKey: 'documents'
  }]
  // parentKey: 'properties'
}, {
  key: 'maintenance-complaints',
  icon: 'iconamoon:attention-circle-duotone',
  label: 'Maintenance',
  url: `/${tenantSlug}/properties/maintenance`,
  allowedUserTypes: ['tenant']
}, {
  key: 'maintenance-landlord',
  icon: 'iconamoon:attention-circle-duotone',
  label: 'Tenant Maintenance',
  url: `/${tenantSlug}/properties/tenant-maintenance`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'rent-manager',
  icon: 'iconamoon:restart-duotone',
  label: 'Rent Manager',
  url: `/${tenantSlug}/rent-manager`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'technicians',
  icon: 'iconamoon:profile-duotone',
  label: 'Technicians',
  url: `/${tenantSlug}/technicians`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'charges',
  icon: 'iconamoon:credit-card-duotone',
  label: 'Charges',
  url: `/${tenantSlug}/charges`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'invoices',
  icon: 'iconamoon:file-document-duotone',
  label: 'Invoices',
  url: `/${tenantSlug}/invoice`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'branding',
  icon: 'iconamoon:settings-duotone',
  label: 'Branding',
  url: `/${tenantSlug}/branding`,
  allowedUserTypes: ['landlord', 'agent']
}, {
  key: 'notification',
  icon: 'iconamoon:notification-duotone',
  label: 'Notifications',
  url: `/${tenantSlug}/notification`,
  allowedUserTypes: ['landlord', 'agent']
}];