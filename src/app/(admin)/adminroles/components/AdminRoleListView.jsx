import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const RolesListView = ({ roles, onEditClick, onDeleteClick }) => {
  const getPermissionBadges = (role) => {
    const permissions = [];
    if (role.manage_properties === 'yes') permissions.push('Properties');
    if (role.manage_accounts === 'yes') permissions.push('Accounts');
    if (role.manage_estate_manager === 'yes') permissions.push('Estate Managers');
    if (role.manage_admins === 'yes') permissions.push('Admins');
    
    return permissions.map((perm, index) => (
      <span key={index} className="badge bg-primary me-1">{perm}</span>
    ));
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <span className="fw-semibold">{role.name}</span>
                </td>
                <td>
                  {getPermissionBadges(role)}
                </td>
                <td>
                  {new Date(role.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(role)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(role)}
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

export default RolesListView;