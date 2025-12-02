import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const TenantsListView = ({ tenants, onEditClick, onDeleteClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getFullName = (tenant) => {
    return `${tenant.first_name} ${tenant.middle_name ? tenant.middle_name + ' ' : ''}${tenant.last_name}`;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, index) => (
              <tr key={tenant.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{getFullName(tenant)}</span>
                </td>
                <td>
                  <span className="text-muted">{tenant.phone || 'N/A'}</span>
                </td>
                <td>
                  <span className="text-muted">{tenant.email || 'N/A'}</span>
                </td>
                <td>
                  <span className="text-muted">{formatDate(tenant.dob)}</span>
                </td>
                <td>
                  <span className={`badge ${tenant.deactivated === 'no' ? 'bg-success' : 'bg-danger'}`}>
                    {tenant.deactivated === 'no' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <span className="text-muted">{formatDate(tenant.created_at)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(tenant)}
                    title="Edit Tenant"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(tenant)}
                    title="Delete Tenant"
                  >
                    <IconifyIcon icon="bx:trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TenantsListView;