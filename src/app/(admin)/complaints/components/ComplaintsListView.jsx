import { Link } from 'react-router-dom';
import { Button, Badge, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

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
    return new Date(dateString).toLocaleDateString();
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

  // Get the complaint ID - handle both id and complaint_id properties
  const getComplaintId = (complaint) => {
    return complaint.id || complaint.complaint_id;
  };

  // Check if this complaint is being deleted
  const isDeleting = (complaint) => {
    const complaintId = getComplaintId(complaint);
    return deletingId === complaintId;
  };

  return (
    <div>
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
                  No complaints found
                </td>
              </tr>
            ) : (
              complaints.map((complaint, idx) => {
                const complaintId = getComplaintId(complaint);
                const deleting = isDeleting(complaint);
                
                return (
                  <tr key={complaintId || idx}>
                    <td>
                      <span className="fw-semibold">#{complaintId || 'N/A'}</span>
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
                            {new Date(complaint.created_at).toLocaleTimeString()}
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
                      <div className="d-flex gap-1">
                        <Button 
                          variant="soft-primary" 
                          size="sm" 
                          onClick={() => console.log('View complaint:', complaint)}
                          title="View Details"
                          disabled={deleting}
                        >
                          <IconifyIcon icon="bx:show" className="fs-16" />
                        </Button>
                        <Button 
                          variant="soft-secondary" 
                          size="sm" 
                          onClick={() => onEditComplaint(complaint)}
                          title="Edit Complaint"
                          disabled={deleting}
                        >
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        <Button 
                          variant="soft-danger" 
                          size="sm" 
                          onClick={() => onDeleteComplaint(complaint)}
                          disabled={deleting}
                          title="Delete Complaint"
                        >
                          {deleting ? (
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

export default ComplaintsListView;