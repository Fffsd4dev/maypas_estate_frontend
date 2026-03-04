import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const UserTypesListView = ({ userTypes, onEditClick, onDeleteClick }) => {
  const getPermissionBadges = (userType) => {
    const permissions = [];
    if (userType.admin_management === 'yes' || userType.admin_management === true) permissions.push('Admin Management');
    if (userType.user_management === 'yes' || userType.user_management === true) permissions.push('User Management');
    if (userType.complaint_management === 'yes' || userType.complaint_management === true) permissions.push('Complaint Management');
    
    if (permissions.length === 0) {
      return <span className="badge bg-secondary">No permissions</span>;
    }

    return permissions.map((perm, index) => (
      <span key={index} className="badge bg-primary me-1 mb-1">{perm}</span>
    ));
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userTypes.map((userType, index) => (
              <tr key={userType.id}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{userType.name}</span>
                </td>
                <td>
                  <div className="d-flex flex-wrap">
                    {getPermissionBadges(userType)}
                  </div>
                </td>
                <td>
                  {userType.created_at ? new Date(userType.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(userType)}
                    title="Edit user type"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(userType)}
                    title="Delete user type"
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

export default UserTypesListView;