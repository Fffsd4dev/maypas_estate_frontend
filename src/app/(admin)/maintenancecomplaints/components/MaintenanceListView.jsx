import { Button, Badge, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';

const MaintenanceListView = ({ 
  maintenance, 
  currentPage, 
  totalPages, 
  totalMaintenance, 
  itemsPerPage,
  onPageChange,
  onDeleteMaintenance,
  onEditMaintenance,
  deletingId,
  tenantSlug
}) => {
  // Helper functions
  const getStatusVariant = (status) => {
    if (!status) return 'light';
    
    switch (status?.toLowerCase()) {
      case 'open': return 'primary';
      case 'in_progress': return 'warning';
      case 'in progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      case 'pending': return 'info';
      default: return 'light';
    }
  };

  const getPriorityVariant = (priority) => {
    if (!priority) return 'secondary';
    
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Pagination component
  const PaginationComponent = () => {
    const maxVisiblePages = 5;
    const pages = [];
    
    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <ul className="pagination pagination-rounded m-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IconifyIcon icon="bx:chevron-left" />
          </button>
        </li>
        
        {startPage > 1 && (
          <>
            <li className={`page-item ${1 === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(1)}>1</button>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}
        
        {pages.map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className={`page-item ${totalPages === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IconifyIcon icon="bx:chevron-right" />
          </button>
        </li>
      </ul>
    );
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMaintenance);

  return (
    <div className="maintenance-list-view">
      {/* Table Section */}
      <div className="table-responsive table-centered">
        <table className="table text-nowrap mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="border-0 py-2">Maintenance ID</th>
              <th className="border-0 py-2">Title</th>
              <th className="border-0 py-2">Address</th>
              <th className="border-0 py-2">Priority</th>
              <th className="border-0 py-2">Status</th>
              <th className="border-0 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center">
                    <IconifyIcon icon="bx:file" className="text-muted fs-1 mb-2" />
                    <h5 className="text-muted">No maintenance requests found</h5>
                    <p className="text-muted mb-0">No maintenance requests match your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              maintenance.map((maintenanceItem, idx) => {
                const maintenanceId = maintenanceItem.id || maintenanceItem.maintenance_id;
                const maintenanceTitle = maintenanceItem.title || maintenanceItem.maintenance_title || 'No Title';
                
                return (
                  <tr key={maintenanceId || idx}>
                    <td>
                      <span className="fw-semibold">#{maintenanceId || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          <h6 className="mb-0">{maintenanceTitle}</h6>
                          <small className="text-muted">
                            {maintenanceItem.description || maintenanceItem.maintenance_description ? 
                              `${(maintenanceItem.description || maintenanceItem.maintenance_description).substring(0, 50)}...` : 
                              'No description'
                            }
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {maintenanceItem.address || maintenanceItem.maintenance_address || 'General'}
                    </td>
                    <td>
                      <Badge bg={getPriorityVariant(maintenanceItem.priority)} className="text-capitalize">
                        {maintenanceItem.priority || 'Medium'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(maintenanceItem.status || maintenanceItem.maintenance_status)} className="text-capitalize">
                        {formatStatus(maintenanceItem.status || maintenanceItem.maintenance_status)}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* View Button - Link to Details Page */}
                        <Button 
                          as={Link}
                          to={`/${tenantSlug}/properties/tenant-maintenance-details/${maintenanceId}`}
                          variant="soft-primary" 
                          size="sm"
                          title="View Details"
                          className="px-3"
                        >
                          <IconifyIcon icon="bx:show" className="fs-16" />
                        </Button>
                        
                        {/* Edit Button */}
                        <Button 
                          variant="soft-secondary" 
                          size="sm"
                          onClick={() => onEditMaintenance(maintenanceItem)}
                          title="Edit Maintenance Request"
                          className="px-3"
                        >
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        
                        {/* Delete Button */}
                        <Button 
                          variant="soft-danger" 
                          size="sm"
                          onClick={() => onDeleteMaintenance(maintenanceId)}
                          disabled={deletingId === maintenanceId}
                          title="Delete Maintenance Request"
                          className="px-3"
                        >
                          {deletingId === maintenanceId ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <IconifyIcon icon="bx:trash" className="fs-16" />
                          )}
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
            <PaginationComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceListView;