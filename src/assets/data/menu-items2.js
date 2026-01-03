

export const MENU_ITEMS = (tenantSlug = "") => [{
  key: 'dashboard-finance',
  icon: 'iconamoon:home-duotone',
  label: 'Dashboard',
  url: `/${tenantSlug}/dashboard`,
  allowedUserTypes: ['landlord', 'agent', 'admin'],
  parentKey: 'dashboards'
}, {
  key: 'dashboard-finance',
  icon: 'iconamoon:home-duotone',
  label: 'Dashboard',
  url: `/${tenantSlug}/tenant-dashboard`,
  allowedUserTypes: ['tenant'],
  parentKey: 'dashboards'
}, {
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Accounts',
  children: [{
    key: 'account-admin',
    label: 'Admins',
    url: `/${tenantSlug}/accounts/admin`,
    allowedUserTypes: ['landlord', 'agent', 'admin'],
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
    label: 'Agents',
    url: `/${tenantSlug}/accounts/agents`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'users'
  }, {
    key: 'account-tenants',
    label: 'Tenants',
    url: `/${tenantSlug}/accounts/tenants`,
    allowedUserTypes: ['landlord', 'agent'],
    parentKey: 'users'
  }]
}, {
  key: 'apartment-account',
  icon: 'iconamoon:home-duotone',
  label: 'Apartments',
  url: `/${tenantSlug}/properties/apartments`,
  allowedUserTypes: ['landlord', 'agent'],
  parentKey: 'properties'
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
  key: 'add-documents',
  icon: 'iconamoon:folder-document-duotone',
  label: 'Documents',
  url: `/${tenantSlug}/landlordforms/createtemplate`,
  allowedUserTypes: ['landlord', 'agent'],
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
  icon: 'iconamoon:settings-duotone',
  label: 'Notifications',
  url: `/${tenantSlug}/notification`,
  allowedUserTypes: ['landlord', 'agent']
}];