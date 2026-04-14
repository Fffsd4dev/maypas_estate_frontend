import { Button, Badge, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';

const ComplaintsListView = ({ 
  complaints, 
  currentPage, 
  totalPages, 
  totalComplaints, 
  itemsPerPage,
  onPageChange,
  onDeleteComplaint,
  onEditComplaint,
  deletingId,
  tenantSlug
}) => {
  // Helper functions
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
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
  const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

  return (
    <div className="complaints-list-view">
      {/* Table Section */}
      <div className="table-responsive table-centered">
        <table className="table text-nowrap mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="border-0 py-2">Complaint ID</th>
              <th className="border-0 py-2">Title</th>
              <th className="border-0 py-2">Category</th>
              <th className="border-0 py-2">Created Date</th>
              <th className="border-0 py-2">Priority</th>
              <th className="border-0 py-2">Status</th>
              <th className="border-0 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center">
                    <IconifyIcon icon="bx:file" className="text-muted fs-1 mb-2" />
                    <h5 className="text-muted">No complaints found</h5>
                    <p className="text-muted mb-0">No complaints match your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((complaint, idx) => (
                <tr key={complaint.id || complaint.complaint_id || idx}>
                  <td>
                    <span className="fw-semibold">#{complaint.complaint_id || complaint.id || 'N/A'}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div>
                        <h6 className="mb-0">{complaint.title || 'No Title'}</h6>
                        <small className="text-muted">
                          {complaint.description ? `${complaint.description.substring(0, 50)}...` : 'No description'}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="text-capitalize">
                      {complaint.category || 'General'}
                    </Badge>
                  </td>
                  <td>
                    {complaint.created_at ? (
                      <>
                        {formatDate(complaint.created_at)}
                        <br />
                        <small className="text-muted">
                          {formatTime(complaint.created_at)}
                        </small>
                      </>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
                      {complaint.priority || 'Medium'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
                      {complaint.status || 'Open'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* View Button - Now a Link to Details Page */}
                      <Button 
                        as={Link}
                        to={`/${tenantSlug}/properties/tenant-complaint-details/${complaint.id || complaint.complaint_id}`}
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
                        onClick={() => onEditComplaint(complaint)}
                        title="Edit Complaint"
                        className="px-3"
                      >
                        <IconifyIcon icon="bx:edit" className="fs-16" />
                      </Button>
                      
                      {/* Delete Button */}
                      <Button 
                        variant="soft-danger" 
                        size="sm"
                        onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
                        disabled={deletingId === (complaint.id || complaint.complaint_id)}
                        title="Delete Complaint"
                        className="px-3"
                      >
                        {deletingId === (complaint.id || complaint.complaint_id) ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <IconifyIcon icon="bx:trash" className="fs-16" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {complaints.length > 0 && (
        <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
          <div className="col-sm">
            <div className="text-muted">
              Showing&nbsp;
              <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
              <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
              <span className="fw-semibold">{totalComplaints}</span>&nbsp; complaints
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

export default ComplaintsListView;



