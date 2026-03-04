import { Link } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const MaintenanceListView = ({ 
  maintenance, 
  currentPage, 
  totalPages, 
  totalMaintenance, 
  itemsPerPage,
  onPageChange,
  onEditMaintenance,
  onViewMaintenance,
  deletingId,
  tenantSlug
}) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'primary';
      case 'in progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      case 'pending': return 'info';
      default: return 'light';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      case 'urgent': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMaintenance);

  // Get the maintenance ID - handle both id and maintenance_id properties
  const getMaintenanceId = (item) => {
    return item.id || item.maintenance_id;
  };

  return (
    <div>
      <div className="table-responsive table-centered">
        <table className="table text-nowrap mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="border-0 py-2">Maintenance ID</th>
              <th className="border-0 py-2">Title</th>
              <th className="border-0 py-2">Category</th>
              <th className="border-0 py-2">Created Date</th>
              <th className="border-0 py-2">Priority</th>
              <th className="border-0 py-2">Status</th>
              <th className="border-0 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No maintenance requests found
                </td>
              </tr>
            ) : (
              maintenance.map((item, idx) => {
                const maintenanceId = getMaintenanceId(item);
                
                return (
                  <tr key={maintenanceId || idx}>
                    <td>
                      <span className="fw-semibold">#{maintenanceId || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          <h6 className="mb-0">{item.maintenance_title || 'No Title'}</h6>
                          <small className="text-muted">
                            {item.maintenance_description ? `${item.maintenance_description.substring(0, 50)}...` : 'No description'}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="text-capitalize">
                        {item.maintenance_category || 'General'}
                      </Badge>
                    </td>
                    <td>
                      {item.created_at ? (
                        <>
                          {formatDate(item.created_at)}
                          <br />
                          <small className="text-muted">
                            {new Date(item.created_at).toLocaleTimeString()}
                          </small>
                        </>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <Badge bg={getPriorityVariant(item.maintenance_priority)} className="text-capitalize">
                        {item.maintenance_priority || 'Medium'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(item.maintenance_status)} className="text-capitalize">
                        {item.maintenance_status || 'Open'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="soft-primary" 
                          size="sm" 
                          onClick={() => onViewMaintenance(item)}
                          title="View Details"
                        >
                          <IconifyIcon icon="bx:show" className="fs-16" />
                        </Button>
                        <Button 
                          variant="soft-secondary" 
                          size="sm" 
                          onClick={() => onEditMaintenance(item)}
                          title="Edit Maintenance Request"
                        >
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {maintenance.length > 0 && (
        <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
          <div className="col-sm">
            <div className="text-muted">
              Showing&nbsp;
              <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
              <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
              <span className="fw-semibold">{totalMaintenance}</span>&nbsp; maintenance requests
            </div>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <ul className="pagination pagination-rounded m-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Link 
                  to="" 
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                >
                  <IconifyIcon icon="bx:left-arrow-alt" />
                </Link>
              </li>
              
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <Link 
                    to=""
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </Link>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Link 
                  to="" 
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                >
                  <IconifyIcon icon="bx:right-arrow-alt" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceListView;