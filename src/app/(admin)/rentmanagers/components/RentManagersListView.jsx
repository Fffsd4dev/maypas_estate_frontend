import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const RentManagersListView = ({ rentAccounts, onEditClick, onDeleteClick, onViewRentCycles }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTenantName = (account) => {
    if (account.user) {
      return `${account.user.first_name} ${account.user.last_name}`;
    }
    return 'Unknown Tenant';
  };

  const getTenantEmail = (account) => {
    return account.user?.email || 'N/A';
  };

  const getUnitName = (account) => {
    return account.apartment_units?.unit_name || 'Unknown Unit';
  };

  const getApartmentInfo = (account) => {
    return {
      category: account.apartment?.category || 'N/A',
      address: account.apartment?.address || 'N/A'
    };
  };

  const getAccountTypeText = (account) => {
    return account.account_type || 'one-off';
  };

  const truncateUUID = (uuid) => {
    if (!uuid) return 'N/A';
    return `${uuid.substring(0, 8)}...`;
  };

  const handleRowClick = (account, e) => {
    // Prevent click if the user clicked on an action button
    if (e.target.closest('button')) {
      return;
    }
    onViewRentCycles(account);
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Tenant Information</th>
              <th>Apartment Details</th>
              <th>Unit</th>
              <th>Account Type</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentAccounts.map((account, index) => {
              const apartmentInfo = getApartmentInfo(account);
              const tenantName = getTenantName(account);
              const unitName = getUnitName(account);
              
              return (
                <tr 
                  key={account.rent_account?.uuid || account.id || index}
                  onClick={(e) => handleRowClick(account, e)}
                  style={{ cursor: 'pointer' }}
                  className="hover-row"
                >
                  <td>
                    <span className="fw-semibold">{index + 1}</span>
                  </td>
                  <td>
                    <div>
                      <span className="fw-semibold d-block">{tenantName}</span>
                      <small className="text-muted d-block">{getTenantEmail(account)}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="fw-semibold d-block">{apartmentInfo.category}</span>
                      <small className="text-muted">{apartmentInfo.address}</small>
                      <br />
                    </div>
                  </td>
                  <td>
                    <div>
                      <Badge bg="info" className="fw-normal mb-1">
                        {unitName}
                      </Badge>
                      <br />
                    </div>
                  </td>
                  <td>
                    <Badge bg="primary" className="fw-normal">
                      {getAccountTypeText(account)}
                    </Badge>
                  </td>
                  <td>
                    <div>
                      <small className="d-block">
                        <strong>Start:</strong> {formatDate(account.start_date)}
                      </small>
                      <small className="d-block">
                        <strong>End:</strong> {account.termination_date ? formatDate(account.termination_date) : 'Not set'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg={account.is_active ? 'success' : 'danger'}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-sm btn-light"
                        onClick={() => onEditClick(account)}
                        title="Edit Rent Account"
                      >
                        <IconifyIcon icon="bx:edit" />
                      </button>
                      <button 
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => onDeleteClick(account)}
                        title="Delete Rent Account"
                      >
                        <IconifyIcon icon="bx:trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {rentAccounts.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No rent accounts found</p>
        </div>
      )}

      <style jsx>{`
        .hover-row:hover {
          background-color: #f8f9fa;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </Card>
  );
};

export default RentManagersListView;