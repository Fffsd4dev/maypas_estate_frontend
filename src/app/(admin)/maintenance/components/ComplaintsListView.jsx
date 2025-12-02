// // import { Link } from 'react-router-dom';
// // import { Button, Badge, Spinner } from 'react-bootstrap';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // const ComplaintsListView = ({ 
// //   complaints, 
// //   currentPage, 
// //   totalPages, 
// //   totalComplaints, 
// //   itemsPerPage,
// //   onPageChange,
// //   onDeleteComplaint,
// //   onEditComplaint,
// //   deletingId,
// //   tenantSlug
// // }) => {
// //   const getStatusVariant = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case 'open': return 'primary';
// //       case 'in progress': return 'warning';
// //       case 'resolved': return 'success';
// //       case 'closed': return 'secondary';
// //       case 'pending': return 'info';
// //       default: return 'light';
// //     }
// //   };

// //   const getPriorityVariant = (priority) => {
// //     switch (priority?.toLowerCase()) {
// //       case 'high': return 'danger';
// //       case 'medium': return 'warning';
// //       case 'low': return 'success';
// //       default: return 'secondary';
// //     }
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   const startItem = (currentPage - 1) * itemsPerPage + 1;
// //   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

// //   // Get the complaint ID - handle both id and complaint_id properties
// //   const getComplaintId = (complaint) => {
// //     return complaint.id || complaint.maintenance_id;
// //   };

// //   // Check if this complaint is being deleted
// //   const isDeleting = (complaint) => {
// //     const complaintId = getComplaintId(complaint);
// //     return deletingId === complaintId;
// //   };

// //   return (
// //     <div>
// //       <div className="table-responsive table-centered">
// //         <table className="table text-nowrap mb-0">
// //           <thead className="bg-light bg-opacity-50">
// //             <tr>
// //               <th className="border-0 py-2">Complaint ID</th>
// //               <th className="border-0 py-2">Title</th>
// //               <th className="border-0 py-2">Category</th>
// //               <th className="border-0 py-2">Created Date</th>
// //               <th className="border-0 py-2">Priority</th>
// //               <th className="border-0 py-2">Status</th>
// //               <th className="border-0 py-2">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {complaints.length === 0 ? (
// //               <tr>
// //                 <td colSpan="7" className="text-center py-4">
// //                   No Maintenance complaints found
// //                 </td>
// //               </tr>
// //             ) : (
// //               complaints.map((complaint, idx) => {
// //                 const complaintId = getComplaintId(complaint);
// //                 const deleting = isDeleting(complaint);
                
// //                 return (
// //                   <tr key={complaintId || idx}>
// //                     <td>
// //                       <span className="fw-semibold">#{complaintId || 'N/A'}</span>
// //                     </td>
// //                     <td>
// //                       <div className="d-flex align-items-center gap-2">
// //                         <div>
// //                           <h6 className="mb-0">{complaint.maintenance_title || 'No Title'}</h6>
// //                           <small className="text-muted">
// //                             {complaint.maintenance_description ? `${complaint.maintenance_description.substring(0, 50)}...` : 'No description'}
// //                           </small>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <Badge bg="light" text="dark" className="text-capitalize">
// //                         {complaint.maintenance_category || 'General'}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       {complaint.created_at ? (
// //                         <>
// //                           {formatDate(complaint.created_at)}
// //                           <br />
// //                           <small className="text-muted">
// //                             {new Date(complaint.created_at).toLocaleTimeString()}
// //                           </small>
// //                         </>
// //                       ) : 'N/A'}
// //                     </td>
// //                     <td>
// //                       <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
// //                         {complaint.priority || 'Medium'}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
// //                         {complaint.maintenance_status || 'Open'}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <div className="d-flex gap-1">
// //                         <Button 
// //                           variant="soft-primary" 
// //                           size="sm" 
// //                           onClick={() => console.log('View complaint:', complaint)}
// //                           title="View Details"
// //                           disabled={deleting}
// //                         >
// //                           <IconifyIcon icon="bx:show" className="fs-16" />
// //                         </Button>
// //                         <Button 
// //                           variant="soft-secondary" 
// //                           size="sm" 
// //                           onClick={() => onEditComplaint(complaint)}
// //                           title="Edit Complaint"
// //                           disabled={deleting}
// //                         >
// //                           <IconifyIcon icon="bx:edit" className="fs-16" />
// //                         </Button>
// //                         <Button 
// //                           variant="soft-danger" 
// //                           size="sm" 
// //                           onClick={() => onDeleteComplaint(complaint)}
// //                           disabled={deleting}
// //                           title="Delete Complaint"
// //                         >
// //                           {deleting ? (
// //                             <Spinner animation="border" size="sm" />
// //                           ) : (
// //                             <IconifyIcon icon="bx:trash" className="fs-16" />
// //                           )}
// //                         </Button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 );
// //               })
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Pagination */}
// //       {complaints.length > 0 && (
// //         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
// //           <div className="col-sm">
// //             <div className="text-muted">
// //               Showing&nbsp;
// //               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
// //               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
// //               <span className="fw-semibold">{totalComplaints}</span>&nbsp; complaints
// //             </div>
// //           </div>
// //           <div className="col-sm-auto mt-3 mt-sm-0">
// //             <ul className="pagination pagination-rounded m-0">
// //               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
// //                 <Link 
// //                   to="" 
// //                   className="page-link"
// //                   onClick={(e) => {
// //                     e.preventDefault();
// //                     if (currentPage > 1) onPageChange(currentPage - 1);
// //                   }}
// //                 >
// //                   <IconifyIcon icon="bx:left-arrow-alt" />
// //                 </Link>
// //               </li>
              
// //               {[...Array(totalPages)].map((_, index) => (
// //                 <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
// //                   <Link 
// //                     to=""
// //                     className="page-link"
// //                     onClick={(e) => {
// //                       e.preventDefault();
// //                       onPageChange(index + 1);
// //                     }}
// //                   >
// //                     {index + 1}
// //                   </Link>
// //                 </li>
// //               ))}
              
// //               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
// //                 <Link 
// //                   to="" 
// //                   className="page-link"
// //                   onClick={(e) => {
// //                     e.preventDefault();
// //                     if (currentPage < totalPages) onPageChange(currentPage + 1);
// //                   }}
// //                 >
// //                   <IconifyIcon icon="bx:right-arrow-alt" />
// //                 </Link>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ComplaintsListView;




// import { Link } from 'react-router-dom';
// import { Button, Badge, Spinner } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const ComplaintsListView = ({ 
//   complaints, 
//   currentPage, 
//   totalPages, 
//   totalComplaints, 
//   itemsPerPage,
//   onPageChange,
//   onDeleteComplaint,
//   onEditComplaint,
//   deletingId,
//   tenantSlug
// }) => {
//   const getStatusVariant = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'open': return 'primary';
//       case 'in progress': return 'warning';
//       case 'resolved': return 'success';
//       case 'closed': return 'secondary';
//       case 'pending': return 'info';
//       default: return 'light';
//     }
//   };

//   const getPriorityVariant = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high': return 'danger';
//       case 'medium': return 'warning';
//       case 'low': return 'success';
//       default: return 'secondary';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

//   // Get the maintenance ID - handle both id and maintenance_id properties
//   const getMaintenanceId = (complaint) => {
//     return complaint.id || complaint.maintenance_id;
//   };

//   // Check if this maintenance complaint is being deleted
//   const isDeleting = (complaint) => {
//     const maintenanceId = getMaintenanceId(complaint);
//     return deletingId === maintenanceId;
//   };

//   return (
//     <div>
//       <div className="table-responsive table-centered">
//         <table className="table text-nowrap mb-0">
//           <thead className="bg-light bg-opacity-50">
//             <tr>
//               <th className="border-0 py-2">Maintenance ID</th>
//               <th className="border-0 py-2">Title</th>
//               <th className="border-0 py-2">Category</th>
//               <th className="border-0 py-2">Created Date</th>
//               <th className="border-0 py-2">Priority</th>
//               <th className="border-0 py-2">Status</th>
//               <th className="border-0 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No maintenance complaints found
//                 </td>
//               </tr>
//             ) : (
//               complaints.map((complaint, idx) => {
//                 const maintenanceId = getMaintenanceId(complaint);
//                 const deleting = isDeleting(complaint);
                
//                 return (
//                   <tr key={maintenanceId || idx}>
//                     <td>
//                       <span className="fw-semibold">#{maintenanceId || 'N/A'}</span>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-center gap-2">
//                         <div>
//                           <h6 className="mb-0">{complaint.maintenance_title || 'No Title'}</h6>
//                           <small className="text-muted">
//                             {complaint.maintenance_description ? `${complaint.maintenance_description.substring(0, 50)}...` : 'No description'}
//                           </small>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <Badge bg="light" text="dark" className="text-capitalize">
//                         {complaint.maintenance_category || 'General'}
//                       </Badge>
//                     </td>
//                     <td>
//                       {complaint.created_at ? (
//                         <>
//                           {formatDate(complaint.created_at)}
//                           <br />
//                           <small className="text-muted">
//                             {new Date(complaint.created_at).toLocaleTimeString()}
//                           </small>
//                         </>
//                       ) : 'N/A'}
//                     </td>
//                     <td>
//                       <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
//                         {complaint.priority || 'Medium'}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Badge bg={getStatusVariant(complaint.maintenance_status)} className="text-capitalize">
//                         {complaint.maintenance_status || 'Open'}
//                       </Badge>
//                     </td>
//                     <td>
//                       <div className="d-flex gap-1">
//                         <Button 
//                           variant="soft-primary" 
//                           size="sm" 
//                           onClick={() => console.log('View maintenance complaint:', complaint)}
//                           title="View Details"
//                           disabled={deleting}
//                         >
//                           <IconifyIcon icon="bx:show" className="fs-16" />
//                         </Button>
//                         <Button 
//                           variant="soft-secondary" 
//                           size="sm" 
//                           onClick={() => onEditComplaint(complaint)}
//                           title="Edit Maintenance Complaint"
//                           disabled={deleting}
//                         >
//                           <IconifyIcon icon="bx:edit" className="fs-16" />
//                         </Button>
//                         <Button 
//                           variant="soft-danger" 
//                           size="sm" 
//                           onClick={() => onDeleteComplaint(complaint)}
//                           disabled={deleting}
//                           title="Delete Maintenance Complaint"
//                         >
//                           {deleting ? (
//                             <Spinner animation="border" size="sm" />
//                           ) : (
//                             <IconifyIcon icon="bx:trash" className="fs-16" />
//                           )}
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {complaints.length > 0 && (
//         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
//           <div className="col-sm">
//             <div className="text-muted">
//               Showing&nbsp;
//               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
//               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
//               <span className="fw-semibold">{totalComplaints}</span>&nbsp; maintenance complaints
//             </div>
//           </div>
//           <div className="col-sm-auto mt-3 mt-sm-0">
//             <ul className="pagination pagination-rounded m-0">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <Link 
//                   to="" 
//                   className="page-link"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage > 1) onPageChange(currentPage - 1);
//                   }}
//                 >
//                   <IconifyIcon icon="bx:left-arrow-alt" />
//                 </Link>
//               </li>
              
//               {[...Array(totalPages)].map((_, index) => (
//                 <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
//                   <Link 
//                     to=""
//                     className="page-link"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       onPageChange(index + 1);
//                     }}
//                   >
//                     {index + 1}
//                   </Link>
//                 </li>
//               ))}
              
//               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                 <Link 
//                   to="" 
//                   className="page-link"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage < totalPages) onPageChange(currentPage + 1);
//                   }}
//                 >
//                   <IconifyIcon icon="bx:right-arrow-alt" />
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplaintsListView;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Spinner, Modal, Row, Col, Alert } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ComplaintsListView = ({ 
  complaints, 
  currentPage, 
  totalPages, 
  totalComplaints, 
  itemsPerPage,
  onPageChange,
  // onDeleteComplaint,
  onEditComplaint,
  deletingId,
  tenantSlug
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

  // Get the maintenance ID - handle both id and maintenance_id properties
  const getMaintenanceId = (complaint) => {
    return complaint.id || complaint.maintenance_id;
  };

  // Check if this maintenance complaint is being deleted
  // const isDeleting = (complaint) => {
  //   const maintenanceId = getMaintenanceId(complaint);
  //   return deletingId === maintenanceId;
  // };

  // Handle view button click
  const handleViewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowViewModal(true);
  };

  // Handle modal close
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedComplaint(null);
  };

  // Get display values with fallbacks
  const getDisplayValue = (value, fallback = 'N/A') => {
    return value || fallback;
  };

  // View Complaint Modal Component (inside the same file)
  const ViewComplaintModal = () => {
    if (!selectedComplaint) return null;

    return (
      <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="bx:detail" className="me-2" />
            Maintenance Complaint Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="complaint-details">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="text-primary mb-1">
                  {getDisplayValue(selectedComplaint.maintenance_title, 'No Title')}
                </h4>
                <p className="text-muted mb-0">
                  ID: #{selectedComplaint.maintenance_id || selectedComplaint.id || 'N/A'}
                </p>
              </div>
              <div className="text-end">
                <Badge bg={getStatusVariant(selectedComplaint.maintenance_status)} className="fs-6">
                  {getDisplayValue(selectedComplaint.maintenance_status, 'Open')}
                </Badge>
                <br />
                <Badge bg={getPriorityVariant(selectedComplaint.maintenance_priority)} className="mt-1">
                  {getDisplayValue(selectedComplaint.maintenance_priority, 'Medium')}
                </Badge>
              </div>
            </div>

            <Row className="g-3">
              {/* Basic Information */}
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Category</label>
                  <p className="mb-0">
                    {getDisplayValue(selectedComplaint.maintenance_category, 'General')}
                  </p>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Apartment Unit</label>
                  <p className="mb-0">
                    {getDisplayValue(selectedComplaint.apartment_unit_name, 'Not specified')}
                  </p>
                </div>
              </Col>

              {/* Dates */}
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Created Date</label>
                  <p className="mb-0">
                    {formatDateTime(selectedComplaint.created_at)}
                  </p>
                </div>
              </Col>

              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Last Updated</label>
                  <p className="mb-0">
                    {formatDateTime(selectedComplaint.updated_at || selectedComplaint.created_at)}
                  </p>
                </div>
              </Col>

              {/* Description */}
              <Col xs={12}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Description</label>
                  <div className="border rounded p-3 bg-light">
                    {getDisplayValue(selectedComplaint.maintenance_description, 'No description provided')}
                  </div>
                </div>
              </Col>

              {/* Additional Information if available */}
              {selectedComplaint.assigned_to && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Assigned To</label>
                    <p className="mb-0">
                      {selectedComplaint.assigned_to}
                    </p>
                  </div>
                </Col>
              )}

              {selectedComplaint.estimated_completion && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Estimated Completion</label>
                    <p className="mb-0">
                      {formatDateTime(selectedComplaint.estimated_completion)}
                    </p>
                  </div>
                </Col>
              )}

              {/* Attachment/Evidence */}
              {(selectedComplaint.attachment || selectedComplaint.evidence) && (
                <Col xs={12}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Attachment</label>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <IconifyIcon icon="mdi:paperclip" className="text-muted" />
                      <span className="text-primary">
                        {selectedComplaint.attachment || selectedComplaint.evidence}
                      </span>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => {
                          // Handle attachment download/view
                          console.log('View attachment:', selectedComplaint.attachment || selectedComplaint.evidence);
                        }}
                      >
                        <IconifyIcon icon="bx:download" className="me-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </Col>
              )}

              {/* Status History if available */}
              {selectedComplaint.status_history && Array.isArray(selectedComplaint.status_history) && (
                <Col xs={12}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Status History</label>
                    <div className="status-timeline mt-2">
                      {selectedComplaint.status_history.map((history, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <div className="timeline-dot bg-primary rounded-circle me-3" style={{width: '8px', height: '8px'}}></div>
                          <div className="flex-grow-1">
                            <span className="text-capitalize">{history.status}</span>
                            <small className="text-muted ms-2">
                              {formatDateTime(history.date)}
                            </small>
                            {history.notes && (
                              <div className="text-muted small">{history.notes}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              // You can add functionality to print or export the details
              window.print();
            }}
          >
            <IconifyIcon icon="bx:printer" className="me-1" />
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No maintenance complaints found
                </td>
              </tr>
            ) : (
              complaints.map((complaint, idx) => {
                const maintenanceId = getMaintenanceId(complaint);
                // const deleting = isDeleting(complaint);
                
                return (
                  <tr key={maintenanceId || idx}>
                    <td>
                      <span className="fw-semibold">#{maintenanceId || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          <h6 className="mb-0">{complaint.maintenance_title || 'No Title'}</h6>
                          <small className="text-muted">
                            {complaint.maintenance_description ? `${complaint.maintenance_description.substring(0, 50)}...` : 'No description'}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="text-capitalize">
                        {complaint.maintenance_category || 'General'}
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
                      <Badge bg={getPriorityVariant(complaint.maintenance_priority)} className="text-capitalize">
                        {complaint.maintenance_priority || 'Medium'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(complaint.maintenance_status)} className="text-capitalize">
                        {complaint.maintenance_status || 'Open'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="soft-primary" 
                          size="sm" 
                          onClick={() => handleViewClick(complaint)}
                          title="View Details"
                          // disabled={deleting}
                        >
                          <IconifyIcon icon="bx:show" className="fs-16" />
                        </Button>
                        <Button 
                          variant="soft-secondary" 
                          size="sm" 
                          onClick={() => onEditComplaint(complaint)}
                          title="Edit Maintenance Complaint"
                          // disabled={deleting}
                        >
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        {/* <Button 
                          variant="soft-danger" 
                          size="sm" 
                          onClick={() => onDeleteComplaint(complaint)}
                          disabled={deleting}
                          title="Delete Maintenance Complaint"
                        >
                          {deleting ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <IconifyIcon icon="bx:trash" className="fs-16" />
                          )}
                        </Button> */}
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
              <span className="fw-semibold">{totalComplaints}</span>&nbsp; maintenance complaints
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

      {/* View Complaint Modal */}
      <ViewComplaintModal />
    </div>
  );
};

export default ComplaintsListView;