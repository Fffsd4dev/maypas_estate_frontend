// // // // import { Link } from 'react-router-dom';
// // // // import { Button, Badge, Spinner } from 'react-bootstrap';
// // // // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // // // const ComplaintsListView = ({ 
// // // //   complaints, 
// // // //   currentPage, 
// // // //   totalPages, 
// // // //   totalComplaints, 
// // // //   itemsPerPage,
// // // //   onPageChange,
// // // //   onDeleteComplaint,
// // // //   deletingId,
// // // //   tenantSlug
// // // // }) => {
// // // //   const handleEditClick = (complaint) => {
// // // //     // Handle edit functionality
// // // //     console.log('Edit complaint:', complaint);
// // // //   };

// // // //   const handleViewClick = (complaint) => {
// // // //     // Handle view details functionality
// // // //     console.log('View complaint:', complaint);
// // // //   };

// // // //   const getStatusVariant = (status) => {
// // // //     switch (status?.toLowerCase()) {
// // // //       case 'open': return 'primary';
// // // //       case 'in progress': return 'warning';
// // // //       case 'resolved': return 'success';
// // // //       case 'closed': return 'secondary';
// // // //       case 'pending': return 'info';
// // // //       default: return 'light';
// // // //     }
// // // //   };

// // // //   const getPriorityVariant = (priority) => {
// // // //     switch (priority?.toLowerCase()) {
// // // //       case 'high': return 'danger';
// // // //       case 'medium': return 'warning';
// // // //       case 'low': return 'success';
// // // //       default: return 'secondary';
// // // //     }
// // // //   };

// // // //   const formatDate = (dateString) => {
// // // //     if (!dateString) return 'N/A';
// // // //     return new Date(dateString).toLocaleDateString();
// // // //   };

// // // //   const startItem = (currentPage - 1) * itemsPerPage + 1;
// // // //   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

// // // //   return (
// // // //     <div>
// // // //       <div className="table-responsive table-centered">
// // // //         <table className="table text-nowrap mb-0">
// // // //           <thead className="bg-light bg-opacity-50">
// // // //             <tr>
// // // //               <th className="border-0 py-2">Complaint ID</th>
// // // //               <th className="border-0 py-2">Title</th>
// // // //               <th className="border-0 py-2">Category</th>
// // // //               <th className="border-0 py-2">Created Date</th>
// // // //               <th className="border-0 py-2">Priority</th>
// // // //               <th className="border-0 py-2">Status</th>
// // // //               <th className="border-0 py-2">Actions</th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {complaints.length === 0 ? (
// // // //               <tr>
// // // //                 <td colSpan="7" className="text-center py-4">
// // // //                   No complaints found
// // // //                 </td>
// // // //               </tr>
// // // //             ) : (
// // // //               complaints.map((complaint, idx) => (
// // // //                 <tr key={complaint.id || complaint.complaint_id || idx}>
// // // //                   <td>
// // // //                     <span className="fw-semibold">#{complaint.complaint_id || complaint.id || 'N/A'}</span>
// // // //                   </td>
// // // //                   <td>
// // // //                     <div className="d-flex align-items-center gap-2">
// // // //                       <div>
// // // //                         <h6 className="mb-0">{complaint.title || 'No Title'}</h6>
// // // //                         <small className="text-muted">
// // // //                           {complaint.description ? `${complaint.description.substring(0, 50)}...` : 'No description'}
// // // //                         </small>
// // // //                       </div>
// // // //                     </div>
// // // //                   </td>
// // // //                   <td>
// // // //                     <Badge bg="light" text="dark" className="text-capitalize">
// // // //                       {complaint.category || 'General'}
// // // //                     </Badge>
// // // //                   </td>
// // // //                   <td>
// // // //                     {complaint.created_at ? (
// // // //                       <>
// // // //                         {formatDate(complaint.created_at)}
// // // //                         <br />
// // // //                         <small className="text-muted">
// // // //                           {new Date(complaint.created_at).toLocaleTimeString()}
// // // //                         </small>
// // // //                       </>
// // // //                     ) : 'N/A'}
// // // //                   </td>
// // // //                   <td>
// // // //                     <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
// // // //                       {complaint.priority || 'Medium'}
// // // //                     </Badge>
// // // //                   </td>
// // // //                   <td>
// // // //                     <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
// // // //                       {complaint.status || 'Open'}
// // // //                     </Badge>
// // // //                   </td>
// // // //                   <td>
// // // //                     <Button 
// // // //                       variant="soft-primary" 
// // // //                       size="sm" 
// // // //                       className="me-2"
// // // //                       onClick={() => handleViewClick(complaint)}
// // // //                       title="View Details"
// // // //                     >
// // // //                       <IconifyIcon icon="bx:show" className="fs-16" />
// // // //                     </Button>
// // // //                     <Button 
// // // //                       variant="soft-secondary" 
// // // //                       size="sm" 
// // // //                       className="me-2"
// // // //                       onClick={() => handleEditClick(complaint)}
// // // //                       title="Edit Complaint"
// // // //                     >
// // // //                       <IconifyIcon icon="bx:edit" className="fs-16" />
// // // //                     </Button>
// // // //                     <Button 
// // // //                       variant="soft-danger" 
// // // //                       size="sm" 
// // // //                       onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
// // // //                       disabled={deletingId === (complaint.id || complaint.complaint_id)}
// // // //                       title="Delete Complaint"
// // // //                     >
// // // //                       {deletingId === (complaint.id || complaint.complaint_id) ? (
// // // //                         <Spinner animation="border" size="sm" />
// // // //                       ) : (
// // // //                         <IconifyIcon icon="bx:trash" className="fs-16" />
// // // //                       )}
// // // //                     </Button>
// // // //                   </td>
// // // //                 </tr>
// // // //               ))
// // // //             )}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>

// // // //       {/* Pagination */}
// // // //       {complaints.length > 0 && (
// // // //         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
// // // //           <div className="col-sm">
// // // //             <div className="text-muted">
// // // //               Showing&nbsp;
// // // //               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
// // // //               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
// // // //               <span className="fw-semibold">{totalComplaints}</span>&nbsp; complaints
// // // //             </div>
// // // //           </div>
// // // //           <div className="col-sm-auto mt-3 mt-sm-0">
// // // //             <ul className="pagination pagination-rounded m-0">
// // // //               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
// // // //                 <Link 
// // // //                   to="" 
// // // //                   className="page-link"
// // // //                   onClick={(e) => {
// // // //                     e.preventDefault();
// // // //                     if (currentPage > 1) onPageChange(currentPage - 1);
// // // //                   }}
// // // //                 >
// // // //                   <IconifyIcon icon="bx:left-arrow-alt" />
// // // //                 </Link>
// // // //               </li>
              
// // // //               {[...Array(totalPages)].map((_, index) => (
// // // //                 <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
// // // //                   <Link 
// // // //                     to=""
// // // //                     className="page-link"
// // // //                     onClick={(e) => {
// // // //                       e.preventDefault();
// // // //                       onPageChange(index + 1);
// // // //                     }}
// // // //                   >
// // // //                     {index + 1}
// // // //                   </Link>
// // // //                 </li>
// // // //               ))}
              
// // // //               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
// // // //                 <Link 
// // // //                   to="" 
// // // //                   className="page-link"
// // // //                   onClick={(e) => {
// // // //                     e.preventDefault();
// // // //                     if (currentPage < totalPages) onPageChange(currentPage + 1);
// // // //                   }}
// // // //                 >
// // // //                   <IconifyIcon icon="bx:right-arrow-alt" />
// // // //                 </Link>
// // // //               </li>
// // // //             </ul>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ComplaintsListView;





// // // import { Link } from 'react-router-dom';
// // // import { Button, Badge, Spinner } from 'react-bootstrap';
// // // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // // const ComplaintsListView = ({ 
// // //   complaints, 
// // //   currentPage, 
// // //   totalPages, 
// // //   totalComplaints, 
// // //   itemsPerPage,
// // //   onPageChange,
// // //   onDeleteComplaint,
// // //   onEditComplaint,
// // //   deletingId,
// // //   tenantSlug
// // // }) => {
// // //   const handleViewClick = (complaint) => {
// // //     // Handle view details functionality
// // //     console.log('View complaint:', complaint);
// // //   };

// // //   const getStatusVariant = (status) => {
// // //     switch (status?.toLowerCase()) {
// // //       case 'open': return 'primary';
// // //       case 'in progress': return 'warning';
// // //       case 'resolved': return 'success';
// // //       case 'closed': return 'secondary';
// // //       case 'pending': return 'info';
// // //       default: return 'light';
// // //     }
// // //   };

// // //   const getPriorityVariant = (priority) => {
// // //     switch (priority?.toLowerCase()) {
// // //       case 'high': return 'danger';
// // //       case 'medium': return 'warning';
// // //       case 'low': return 'success';
// // //       default: return 'secondary';
// // //     }
// // //   };

// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return 'N/A';
// // //     return new Date(dateString).toLocaleDateString();
// // //   };

// // //   const startItem = (currentPage - 1) * itemsPerPage + 1;
// // //   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

// // //   return (
// // //     <div>
// // //       <div className="table-responsive table-centered">
// // //         <table className="table text-nowrap mb-0">
// // //           <thead className="bg-light bg-opacity-50">
// // //             <tr>
// // //               <th className="border-0 py-2">Complaint ID</th>
// // //               <th className="border-0 py-2">Title</th>
// // //               <th className="border-0 py-2">Category</th>
// // //               <th className="border-0 py-2">Created Date</th>
// // //               <th className="border-0 py-2">Priority</th>
// // //               <th className="border-0 py-2">Status</th>
// // //               <th className="border-0 py-2">Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {complaints.length === 0 ? (
// // //               <tr>
// // //                 <td colSpan="7" className="text-center py-4">
// // //                   No complaints found
// // //                 </td>
// // //               </tr>
// // //             ) : (
// // //               complaints.map((complaint, idx) => (
// // //                 <tr key={complaint.id || complaint.complaint_id || idx}>
// // //                   <td>
// // //                     <span className="fw-semibold">#{complaint.complaint_id || complaint.id || 'N/A'}</span>
// // //                   </td>
// // //                   <td>
// // //                     <div className="d-flex align-items-center gap-2">
// // //                       <div>
// // //                         <h6 className="mb-0">{complaint.title || 'No Title'}</h6>
// // //                         <small className="text-muted">
// // //                           {complaint.description ? `${complaint.description.substring(0, 50)}...` : 'No description'}
// // //                         </small>
// // //                       </div>
// // //                     </div>
// // //                   </td>
// // //                   <td>
// // //                     <Badge bg="light" text="dark" className="text-capitalize">
// // //                       {complaint.category || 'General'}
// // //                     </Badge>
// // //                   </td>
// // //                   <td>
// // //                     {complaint.created_at ? (
// // //                       <>
// // //                         {formatDate(complaint.created_at)}
// // //                         <br />
// // //                         <small className="text-muted">
// // //                           {new Date(complaint.created_at).toLocaleTimeString()}
// // //                         </small>
// // //                       </>
// // //                     ) : 'N/A'}
// // //                   </td>
// // //                   <td>
// // //                     <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
// // //                       {complaint.priority || 'Medium'}
// // //                     </Badge>
// // //                   </td>
// // //                   <td>
// // //                     <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
// // //                       {complaint.status || 'Open'}
// // //                     </Badge>
// // //                   </td>
// // //                   <td>
// // //                     <Button 
// // //                       variant="soft-primary" 
// // //                       size="sm" 
// // //                       className="me-2"
// // //                       onClick={() => handleViewClick(complaint)}
// // //                       title="View Details"
// // //                     >
// // //                       <IconifyIcon icon="bx:show" className="fs-16" />
// // //                     </Button>
// // //                     <Button 
// // //                       variant="soft-secondary" 
// // //                       size="sm" 
// // //                       className="me-2"
// // //                       onClick={() => onEditComplaint(complaint)}
// // //                       title="Edit Complaint"
// // //                     >
// // //                       <IconifyIcon icon="bx:edit" className="fs-16" />
// // //                     </Button>
// // //                     <Button 
// // //                       variant="soft-danger" 
// // //                       size="sm" 
// // //                       onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
// // //                       disabled={deletingId === (complaint.id || complaint.complaint_id)}
// // //                       title="Delete Complaint"
// // //                     >
// // //                       {deletingId === (complaint.id || complaint.complaint_id) ? (
// // //                         <Spinner animation="border" size="sm" />
// // //                       ) : (
// // //                         <IconifyIcon icon="bx:trash" className="fs-16" />
// // //                       )}
// // //                     </Button>
// // //                   </td>
// // //                 </tr>
// // //               ))
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {/* Pagination */}
// // //       {complaints.length > 0 && (
// // //         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
// // //           <div className="col-sm">
// // //             <div className="text-muted">
// // //               Showing&nbsp;
// // //               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
// // //               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
// // //               <span className="fw-semibold">{totalComplaints}</span>&nbsp; complaints
// // //             </div>
// // //           </div>
// // //           <div className="col-sm-auto mt-3 mt-sm-0">
// // //             <ul className="pagination pagination-rounded m-0">
// // //               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
// // //                 <Link 
// // //                   to="" 
// // //                   className="page-link"
// // //                   onClick={(e) => {
// // //                     e.preventDefault();
// // //                     if (currentPage > 1) onPageChange(currentPage - 1);
// // //                   }}
// // //                 >
// // //                   <IconifyIcon icon="bx:left-arrow-alt" />
// // //                 </Link>
// // //               </li>
              
// // //               {[...Array(totalPages)].map((_, index) => (
// // //                 <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
// // //                   <Link 
// // //                     to=""
// // //                     className="page-link"
// // //                     onClick={(e) => {
// // //                       e.preventDefault();
// // //                       onPageChange(index + 1);
// // //                     }}
// // //                   >
// // //                     {index + 1}
// // //                   </Link>
// // //                 </li>
// // //               ))}
              
// // //               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
// // //                 <Link 
// // //                   to="" 
// // //                   className="page-link"
// // //                   onClick={(e) => {
// // //                     e.preventDefault();
// // //                     if (currentPage < totalPages) onPageChange(currentPage + 1);
// // //                   }}
// // //                 >
// // //                   <IconifyIcon icon="bx:right-arrow-alt" />
// // //                 </Link>
// // //               </li>
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ComplaintsListView;


// // import { Link } from 'react-router-dom';
// // import { Button, Badge, Spinner, Modal, Row, Col } from 'react-bootstrap';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // import { useState } from 'react';

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
// //   const [showViewModal, setShowViewModal] = useState(false);
// //   const [selectedComplaint, setSelectedComplaint] = useState(null);

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

// //   const formatDateTime = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'long',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   const startItem = (currentPage - 1) * itemsPerPage + 1;
// //   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

// //   // Handle view button click
// //   const handleViewClick = (complaint) => {
// //     setSelectedComplaint(complaint);
// //     setShowViewModal(true);
// //   };

// //   // Handle modal close
// //   const handleViewModalClose = () => {
// //     setShowViewModal(false);
// //     setSelectedComplaint(null);
// //   };

// //   // Get display values with fallbacks
// //   const getDisplayValue = (value, fallback = 'N/A') => {
// //     return value || fallback;
// //   };

// //   // View Complaint Modal Component
// //   const ViewComplaintModal = () => {
// //     if (!selectedComplaint) return null;

// //     return (
// //       <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
// //         <Modal.Header closeButton>
// //           <Modal.Title>
// //             <IconifyIcon icon="bx:detail" className="me-2" />
// //             Complaint Details
// //           </Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <div className="complaint-details">
// //             {/* Header Section */}
// //             <div className="d-flex justify-content-between align-items-start mb-4">
// //               <div>
// //                 <h4 className="text-primary mb-1">
// //                   {getDisplayValue(selectedComplaint.title, 'No Title')}
// //                 </h4>
// //                 <p className="text-muted mb-0">
// //                   ID: #{selectedComplaint.complaint_id || selectedComplaint.id || 'N/A'}
// //                 </p>
// //               </div>
// //               <div className="text-end">
// //                 <Badge bg={getStatusVariant(selectedComplaint.status)} className="fs-6">
// //                   {getDisplayValue(selectedComplaint.status, 'Open')}
// //                 </Badge>
// //                 <br />
// //                 <Badge bg={getPriorityVariant(selectedComplaint.priority)} className="mt-1">
// //                   {getDisplayValue(selectedComplaint.priority, 'Medium')}
// //                 </Badge>
// //               </div>
// //             </div>

// //             <Row className="g-3">
// //               {/* Basic Information */}
// //               <Col md={6}>
// //                 <div className="detail-item">
// //                   <label className="fw-semibold text-muted">Category</label>
// //                   <p className="mb-0">
// //                     {getDisplayValue(selectedComplaint.category, 'General')}
// //                   </p>
// //                 </div>
// //               </Col>
              
// //               <Col md={6}>
// //                 <div className="detail-item">
// //                   <label className="fw-semibold text-muted">Complaint ID</label>
// //                   <p className="mb-0">
// //                     #{selectedComplaint.complaint_id || selectedComplaint.id || 'N/A'}
// //                   </p>
// //                 </div>
// //               </Col>

// //               {/* Dates */}
// //               <Col md={6}>
// //                 <div className="detail-item">
// //                   <label className="fw-semibold text-muted">Created Date</label>
// //                   <p className="mb-0">
// //                     {formatDateTime(selectedComplaint.created_at)}
// //                   </p>
// //                 </div>
// //               </Col>

// //               <Col md={6}>
// //                 <div className="detail-item">
// //                   <label className="fw-semibold text-muted">Last Updated</label>
// //                   <p className="mb-0">
// //                     {formatDateTime(selectedComplaint.updated_at || selectedComplaint.created_at)}
// //                   </p>
// //                 </div>
// //               </Col>

// //               {/* Description */}
// //               <Col xs={12}>
// //                 <div className="detail-item">
// //                   <label className="fw-semibold text-muted">Description</label>
// //                   <div className="border rounded p-3 bg-light">
// //                     {getDisplayValue(selectedComplaint.description, 'No description provided')}
// //                   </div>
// //                 </div>
// //               </Col>

// //               {/* Additional Information if available */}
// //               {selectedComplaint.assigned_to && (
// //                 <Col md={6}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Assigned To</label>
// //                     <p className="mb-0">
// //                       {selectedComplaint.assigned_to}
// //                     </p>
// //                   </div>
// //                 </Col>
// //               )}

// //               {selectedComplaint.estimated_completion && (
// //                 <Col md={6}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Estimated Completion</label>
// //                     <p className="mb-0">
// //                       {formatDateTime(selectedComplaint.estimated_completion)}
// //                     </p>
// //                   </div>
// //                 </Col>
// //               )}

// //               {/* Apartment/Unit Information if available */}
// //               {selectedComplaint.apartment_unit_name && (
// //                 <Col md={6}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Apartment Unit</label>
// //                     <p className="mb-0">
// //                       {selectedComplaint.apartment_unit_name}
// //                     </p>
// //                   </div>
// //                 </Col>
// //               )}

// //               {selectedComplaint.property_name && (
// //                 <Col md={6}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Property</label>
// //                     <p className="mb-0">
// //                       {selectedComplaint.property_name}
// //                     </p>
// //                   </div>
// //                 </Col>
// //               )}

// //               {/* Attachment/Evidence */}
// //               {(selectedComplaint.attachment || selectedComplaint.evidence) && (
// //                 <Col xs={12}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Attachment</label>
// //                     <div className="d-flex align-items-center gap-2 mt-1">
// //                       <IconifyIcon icon="mdi:paperclip" className="text-muted" />
// //                       <span className="text-primary">
// //                         {selectedComplaint.attachment || selectedComplaint.evidence}
// //                       </span>
// //                       <Button 
// //                         variant="outline-primary" 
// //                         size="sm" 
// //                         className="ms-2"
// //                         onClick={() => {
// //                           // Handle attachment download/view
// //                           console.log('View attachment:', selectedComplaint.attachment || selectedComplaint.evidence);
// //                         }}
// //                       >
// //                         <IconifyIcon icon="bx:download" className="me-1" />
// //                         View
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </Col>
// //               )}

// //               {/* Status History if available */}
// //               {selectedComplaint.status_history && Array.isArray(selectedComplaint.status_history) && (
// //                 <Col xs={12}>
// //                   <div className="detail-item">
// //                     <label className="fw-semibold text-muted">Status History</label>
// //                     <div className="status-timeline mt-2">
// //                       {selectedComplaint.status_history.map((history, index) => (
// //                         <div key={index} className="d-flex align-items-center mb-2">
// //                           <div className="timeline-dot bg-primary rounded-circle me-3" style={{width: '8px', height: '8px'}}></div>
// //                           <div className="flex-grow-1">
// //                             <span className="text-capitalize">{history.status}</span>
// //                             <small className="text-muted ms-2">
// //                               {formatDateTime(history.date)}
// //                             </small>
// //                             {history.notes && (
// //                               <div className="text-muted small">{history.notes}</div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </Col>
// //               )}
// //             </Row>
// //           </div>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleViewModalClose}>
// //             Close
// //           </Button>
// //           <Button 
// //             variant="primary"
// //             onClick={() => {
// //               // You can add functionality to print or export the details
// //               window.print();
// //             }}
// //           >
// //             <IconifyIcon icon="bx:printer" className="me-1" />
// //             Print
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     );
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
// //                   No complaints found
// //                 </td>
// //               </tr>
// //             ) : (
// //               complaints.map((complaint, idx) => (
// //                 <tr key={complaint.id || complaint.complaint_id || idx}>
// //                   <td>
// //                     <span className="fw-semibold">#{complaint.complaint_id || complaint.id || 'N/A'}</span>
// //                   </td>
// //                   <td>
// //                     <div className="d-flex align-items-center gap-2">
// //                       <div>
// //                         <h6 className="mb-0">{complaint.title || 'No Title'}</h6>
// //                         <small className="text-muted">
// //                           {complaint.description ? `${complaint.description.substring(0, 50)}...` : 'No description'}
// //                         </small>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td>
// //                     <Badge bg="light" text="dark" className="text-capitalize">
// //                       {complaint.category || 'General'}
// //                     </Badge>
// //                   </td>
// //                   <td>
// //                     {complaint.created_at ? (
// //                       <>
// //                         {formatDate(complaint.created_at)}
// //                         <br />
// //                         <small className="text-muted">
// //                           {new Date(complaint.created_at).toLocaleTimeString()}
// //                         </small>
// //                       </>
// //                     ) : 'N/A'}
// //                   </td>
// //                   <td>
// //                     <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
// //                       {complaint.priority || 'Medium'}
// //                     </Badge>
// //                   </td>
// //                   <td>
// //                     <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
// //                       {complaint.status || 'Open'}
// //                     </Badge>
// //                   </td>
// //                   <td>
// //                     <Button 
// //                       variant="soft-primary" 
// //                       size="sm" 
// //                       className="me-2"
// //                       onClick={() => handleViewClick(complaint)}
// //                       title="View Details"
// //                     >
// //                       <IconifyIcon icon="bx:show" className="fs-16" />
// //                     </Button>
// //                     <Button 
// //                       variant="soft-secondary" 
// //                       size="sm" 
// //                       className="me-2"
// //                       onClick={() => onEditComplaint(complaint)}
// //                       title="Edit Complaint"
// //                     >
// //                       <IconifyIcon icon="bx:edit" className="fs-16" />
// //                     </Button>
// //                     <Button 
// //                       variant="soft-danger" 
// //                       size="sm" 
// //                       onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
// //                       disabled={deletingId === (complaint.id || complaint.complaint_id)}
// //                       title="Delete Complaint"
// //                     >
// //                       {deletingId === (complaint.id || complaint.complaint_id) ? (
// //                         <Spinner animation="border" size="sm" />
// //                       ) : (
// //                         <IconifyIcon icon="bx:trash" className="fs-16" />
// //                       )}
// //                     </Button>
// //                   </td>
// //                 </tr>
// //               ))
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

// //       {/* View Complaint Modal */}
// //       <ViewComplaintModal />
// //     </div>
// //   );
// // };

// // export default ComplaintsListView;



// import { Link } from 'react-router-dom';
// import { Button, Badge, Spinner, Modal, Row, Col, Alert, Card } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';

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
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [loadingComplaint, setLoadingComplaint] = useState(false);
//   const [complaintError, setComplaintError] = useState(null);
//   const { user } = useAuthContext();

//   // Fetch individual complaint details
//   const fetchComplaintDetails = async (complaintId) => {
//     if (!complaintId) {
//       setComplaintError('No complaint ID provided');
//       return;
//     }

//     setLoadingComplaint(true);
//     setComplaintError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/view/${complaintId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched complaint details:', response.data);
      
//       // Use the data from the API response
//       const complaintData = response.data.data;
//       setSelectedComplaint(complaintData);
      
//     } catch (error) {
//       console.error('Error fetching complaint details:', error);
//       setComplaintError(error.response?.data?.message || error.message || 'Failed to fetch complaint details');
//       setSelectedComplaint(null);
//     } finally {
//       setLoadingComplaint(false);
//     }
//   };

//   // Handle view button click
//   const handleViewClick = async (complaint) => {
//     const complaintId = complaint.id || complaint.complaint_id;
    
//     if (!complaintId) {
//       setComplaintError('No complaint ID found');
//       return;
//     }

//     setShowViewModal(true);
    
//     // Fetch the detailed complaint data
//     await fetchComplaintDetails(complaintId);
//   };

//   // Handle modal close
//   const handleViewModalClose = () => {
//     setShowViewModal(false);
//     setSelectedComplaint(null);
//     setComplaintError(null);
//   };

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

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalComplaints);

//   // Get display values with fallbacks
//   const getDisplayValue = (value, fallback = 'N/A') => {
//     return value || fallback;
//   };

//   // View Complaint Modal Component
//   const ViewComplaintModal = () => {
//     return (
//       <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <IconifyIcon icon="bx:detail" className="me-2" />
//             Complaint Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {loadingComplaint && (
//             <div className="text-center py-4">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-2">Loading complaint details...</p>
//             </div>
//           )}

//           {complaintError && (
//             <Alert variant="danger" onClose={() => setComplaintError(null)} dismissible>
//               {complaintError}
//             </Alert>
//           )}

//           {!loadingComplaint && selectedComplaint && (
//             <div className="complaint-details">
//               {/* Header Section */}
//               <div className="d-flex justify-content-between align-items-start mb-4">
//                 <div>
//                   <h4 className="text-primary mb-1">
//                     {getDisplayValue(selectedComplaint.title, 'No Title')}
//                   </h4>
//                   <p className="text-muted mb-0">
//                     Complaint ID: #{selectedComplaint.id}
//                   </p>
//                 </div>
//                 <div className="text-end">
//                   <Badge bg={getStatusVariant(selectedComplaint.status)} className="fs-6 mb-2">
//                     {getDisplayValue(selectedComplaint.status)}
//                   </Badge>
//                   <br />
//                   <Badge bg={getPriorityVariant(selectedComplaint.priority)}>
//                     Priority: {getDisplayValue(selectedComplaint.priority)}
//                   </Badge>
//                 </div>
//               </div>

//               <Row className="g-3">
//                 {/* Basic Complaint Information */}
//                 <Col md={6}>
//                   <Card className="h-100">
//                     <Card.Header className="bg-light">
//                       <h6 className="mb-0">Complaint Information</h6>
//                     </Card.Header>
//                     <Card.Body>
//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Title</label>
//                         <p className="mb-0">{selectedComplaint.title}</p>
//                       </div>
                      
//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Description</label>
//                         <p className="mb-0">{selectedComplaint.description}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Resolution Notes</label>
//                         <p className="mb-0">
//                           {getDisplayValue(selectedComplaint.resolution_notes, 'No resolution notes provided')}
//                         </p>
//                       </div>

//                       <div className="detail-item">
//                         <label className="fw-semibold text-muted small">Evidence/Attachment</label>
//                         <div className="d-flex align-items-center gap-2 mt-1">
//                           {selectedComplaint.evidence ? (
//                             <>
//                               <IconifyIcon icon="mdi:paperclip" className="text-muted" />
//                               <span className="text-primary">{selectedComplaint.evidence}</span>
//                               <Button 
//                                 variant="outline-primary" 
//                                 size="sm" 
//                                 className="ms-2"
//                                 onClick={() => {
//                                   // Handle evidence download/view
//                                   console.log('View evidence:', selectedComplaint.evidence);
//                                 }}
//                               >
//                                 <IconifyIcon icon="bx:download" className="me-1" />
//                                 View
//                               </Button>
//                             </>
//                           ) : (
//                             <span className="text-muted">No evidence attached</span>
//                           )}
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>

//                 {/* Dates and Status */}
//                 <Col md={6}>
//                   <Card className="h-100">
//                     <Card.Header className="bg-light">
//                       <h6 className="mb-0">Timeline & Status</h6>
//                     </Card.Header>
//                     <Card.Body>
//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Created Date</label>
//                         <p className="mb-0">{formatDateTime(selectedComplaint.created_at)}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Last Updated</label>
//                         <p className="mb-0">{formatDateTime(selectedComplaint.updated_at)}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Status</label>
//                         <div>
//                           <Badge bg={getStatusVariant(selectedComplaint.status)} className="text-capitalize">
//                             {selectedComplaint.status}
//                           </Badge>
//                         </div>
//                       </div>

//                       <div className="detail-item">
//                         <label className="fw-semibold text-muted small">Priority</label>
//                         <div>
//                           <Badge bg={getPriorityVariant(selectedComplaint.priority)} className="text-capitalize">
//                             {selectedComplaint.priority}
//                           </Badge>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>

//                 {/* Apartment Information */}
//                 {selectedComplaint.apartment && (
//                   <Col xs={12}>
//                     <Card>
//                       <Card.Header className="bg-light">
//                         <h6 className="mb-0">Apartment Information</h6>
//                       </Card.Header>
//                       <Card.Body>
//                         <Row>
//                           <Col md={3}>
//                             <div className="detail-item">
//                               <label className="fw-semibold text-muted small">Unit Number</label>
//                               <p className="mb-0">{selectedComplaint.apartment.number_item}</p>
//                             </div>
//                           </Col>
//                           <Col md={3}>
//                             <div className="detail-item">
//                               <label className="fw-semibold text-muted small">Location</label>
//                               <p className="mb-0">{selectedComplaint.apartment.location}</p>
//                             </div>
//                           </Col>
//                           <Col md={6}>
//                             <div className="detail-item">
//                               <label className="fw-semibold text-muted small">Address</label>
//                               <p className="mb-0">{selectedComplaint.apartment.address}</p>
//                             </div>
//                           </Col>
//                           {selectedComplaint.apartment.apartment_category && (
//                             <>
//                               <Col md={6}>
//                                 <div className="detail-item">
//                                   <label className="fw-semibold text-muted small">Category</label>
//                                   <p className="mb-0">
//                                     {selectedComplaint.apartment.apartment_category.name}
//                                   </p>
//                                 </div>
//                               </Col>
//                               <Col md={6}>
//                                 <div className="detail-item">
//                                   <label className="fw-semibold text-muted small">Category Description</label>
//                                   <p className="mb-0">
//                                     {getDisplayValue(
//                                       selectedComplaint.apartment.apartment_category.description,
//                                       'No description'
//                                     )}
//                                   </p>
//                                 </div>
//                               </Col>
//                             </>
//                           )}
//                         </Row>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 )}

//                 {/* Complaint Responses */}
//                 {selectedComplaint.complaint_responses && selectedComplaint.complaint_responses.length > 0 && (
//                   <Col xs={12}>
//                     <Card>
//                       <Card.Header className="bg-light">
//                         <h6 className="mb-0">
//                           Responses ({selectedComplaint.complaint_responses.length})
//                         </h6>
//                       </Card.Header>
//                       <Card.Body>
//                         <div className="response-timeline">
//                           {selectedComplaint.complaint_responses.map((response, index) => (
//                             <div key={response.id} className="response-item mb-4 pb-4 border-bottom">
//                               <div className="d-flex justify-content-between align-items-start mb-2">
//                                 <div className="d-flex align-items-center">
//                                   <div className="timeline-dot bg-primary rounded-circle me-3" 
//                                        style={{width: '12px', height: '12px'}}></div>
//                                   <h6 className="mb-0">Response #{index + 1}</h6>
//                                 </div>
//                                 <small className="text-muted">
//                                   {formatDateTime(response.created_at)}
//                                 </small>
//                               </div>
                              
//                               <div className="ms-4">
//                                 <p className="mb-2">{response.message}</p>
                                
//                                 {response.attachment && (
//                                   <div className="d-flex align-items-center gap-2 mt-2">
//                                     <IconifyIcon icon="mdi:paperclip" className="text-muted" />
//                                     <span className="text-primary small">{response.attachment}</span>
//                                     <Button 
//                                       variant="outline-primary" 
//                                       size="sm" 
//                                       className="ms-2"
//                                       onClick={() => {
//                                         // Handle response attachment download/view
//                                         console.log('View response attachment:', response.attachment);
//                                       }}
//                                     >
//                                       <IconifyIcon icon="bx:download" className="me-1" />
//                                       View
//                                     </Button>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 )}

//                 {/* No Responses Message */}
//                 {(!selectedComplaint.complaint_responses || selectedComplaint.complaint_responses.length === 0) && (
//                   <Col xs={12}>
//                     <Card>
//                       <Card.Body className="text-center py-4">
//                         <IconifyIcon icon="bx:message-detail" className="text-muted fs-1 mb-2" />
//                         <p className="text-muted mb-0">No responses yet for this complaint</p>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 )}
//               </Row>
//             </div>
//           )}

//           {!loadingComplaint && !selectedComplaint && !complaintError && (
//             <div className="text-center py-4">
//               <p>No complaint data available</p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleViewModalClose}>
//             Close
//           </Button>
//           {selectedComplaint && (
//             <Button 
//               variant="primary"
//               onClick={() => {
//                 // Print functionality
//                 window.print();
//               }}
//             >
//               <IconifyIcon icon="bx:printer" className="me-1" />
//               Print
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     );
//   };

//   return (
//     <div>
//       <div className="table-responsive table-centered">
//         <table className="table text-nowrap mb-0">
//           <thead className="bg-light bg-opacity-50">
//             <tr>
//               <th className="border-0 py-2">Complaint ID</th>
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
//                   No complaints found
//                 </td>
//               </tr>
//             ) : (
//               complaints.map((complaint, idx) => (
//                 <tr key={complaint.id || complaint.complaint_id || idx}>
//                   <td>
//                     <span className="fw-semibold">#{complaint.complaint_id || complaint.id || 'N/A'}</span>
//                   </td>
//                   <td>
//                     <div className="d-flex align-items-center gap-2">
//                       <div>
//                         <h6 className="mb-0">{complaint.title || 'No Title'}</h6>
//                         <small className="text-muted">
//                           {complaint.description ? `${complaint.description.substring(0, 50)}...` : 'No description'}
//                         </small>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <Badge bg="light" text="dark" className="text-capitalize">
//                       {complaint.category || 'General'}
//                     </Badge>
//                   </td>
//                   <td>
//                     {complaint.created_at ? (
//                       <>
//                         {formatDate(complaint.created_at)}
//                         <br />
//                         <small className="text-muted">
//                           {new Date(complaint.created_at).toLocaleTimeString()}
//                         </small>
//                       </>
//                     ) : 'N/A'}
//                   </td>
//                   <td>
//                     <Badge bg={getPriorityVariant(complaint.priority)} className="text-capitalize">
//                       {complaint.priority || 'Medium'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Badge bg={getStatusVariant(complaint.status)} className="text-capitalize">
//                       {complaint.status || 'Open'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Button 
//                       variant="soft-primary" 
//                       size="sm" 
//                       className="me-2"
//                       onClick={() => handleViewClick(complaint)}
//                       title="View Details"
//                       disabled={loadingComplaint}
//                     >
//                       {loadingComplaint && selectedComplaint?.id === (complaint.id || complaint.complaint_id) ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         <IconifyIcon icon="bx:show" className="fs-16" />
//                       )}
//                     </Button>
//                     <Button 
//                       variant="soft-secondary" 
//                       size="sm" 
//                       className="me-2"
//                       onClick={() => onEditComplaint(complaint)}
//                       title="Edit Complaint"
//                     >
//                       <IconifyIcon icon="bx:edit" className="fs-16" />
//                     </Button>
//                     <Button 
//                       variant="soft-danger" 
//                       size="sm" 
//                       onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
//                       disabled={deletingId === (complaint.id || complaint.complaint_id)}
//                       title="Delete Complaint"
//                     >
//                       {deletingId === (complaint.id || complaint.complaint_id) ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         <IconifyIcon icon="bx:trash" className="fs-16" />
//                       )}
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination - Keep your existing pagination code */}
//       {complaints.length > 0 && (
//         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
//           <div className="col-sm">
//             <div className="text-muted">
//               Showing&nbsp;
//               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
//               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
//               <span className="fw-semibold">{totalComplaints}</span>&nbsp; complaints
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

//       {/* View Complaint Modal */}
//       <ViewComplaintModal />
//     </div>
//   );
// };

// export default ComplaintsListView;



import { Link } from 'react-router-dom';
import { Button, Badge, Spinner, Modal, Row, Col, Alert, Card, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingComplaint, setLoadingComplaint] = useState(false);
  const [complaintError, setComplaintError] = useState(null);
  const { user } = useAuthContext();

  // Response management states
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState('create'); // 'create', 'edit'
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseForm, setResponseForm] = useState({
    message: '',
    attachment: null
  });
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState('');

  // Fetch individual complaint details
  const fetchComplaintDetails = async (complaintId) => {
    if (!complaintId) {
      setComplaintError('No complaint ID provided');
      return;
    }

    setLoadingComplaint(true);
    setComplaintError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/view/${complaintId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched complaint details:', response.data);
      
      // Use the data from the API response
      const complaintData = response.data.data;
      setSelectedComplaint(complaintData);
      
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      setComplaintError(error.response?.data?.message || error.message || 'Failed to fetch complaint details');
      setSelectedComplaint(null);
    } finally {
      setLoadingComplaint(false);
    }
  };

  // Handle view button click
  const handleViewClick = async (complaint) => {
    const complaintId = complaint.id || complaint.complaint_id;
    
    if (!complaintId) {
      setComplaintError('No complaint ID found');
      return;
    }

    setShowViewModal(true);
    
    // Fetch the detailed complaint data
    await fetchComplaintDetails(complaintId);
  };

  // Handle modal close
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedComplaint(null);
    setComplaintError(null);
  };

  // Response Management Functions
  const handleCreateResponse = () => {
    setResponseAction('create');
    setSelectedResponse(null);
    setResponseForm({
      message: '',
      attachment: null
    });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleEditResponse = (response) => {
    setResponseAction('edit');
    setSelectedResponse(response);
    setResponseForm({
      message: response.message,
      attachment: response.attachment
    });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleDeleteResponse = async (responseId) => {
    if (!responseId || !selectedComplaint) return;

    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }

    setResponseLoading(true);
    setResponseError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/delete/${responseId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponseSuccess('Response deleted successfully!');
      
      // Refresh complaint details to get updated responses
      await fetchComplaintDetails(selectedComplaint.id);
      
      setTimeout(() => {
        setResponseSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting response:', error);
      setResponseError(error.response?.data?.message || error.message || 'Failed to delete response');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    
    if (!responseForm.message.trim()) {
      setResponseError('Message is required');
      return;
    }

    setResponseLoading(true);
    setResponseError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug || !selectedComplaint) {
        throw new Error('Required information missing');
      }

      let response;

      if (responseAction === 'create') {
        // Create new response
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/create`,
          {
            complaint_id: selectedComplaint.id,
            message: responseForm.message,
            attachment: responseForm.attachment
          },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Update existing response
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/update/${selectedResponse.id}`,
          {
            message: responseForm.message,
            attachment: responseForm.attachment
          },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setResponseSuccess(
        responseAction === 'create' 
          ? 'Response created successfully!' 
          : 'Response updated successfully!'
      );

      // Refresh complaint details to get updated responses
      await fetchComplaintDetails(selectedComplaint.id);
      
      // Close modal after success
      setTimeout(() => {
        setShowResponseModal(false);
        setResponseSuccess('');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving response:', error);
      setResponseError(error.response?.data?.message || error.message || 'Failed to save response');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleResponseFormChange = (field, value) => {
    setResponseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResponseModalClose = () => {
    setShowResponseModal(false);
    setResponseForm({
      message: '',
      attachment: null
    });
    setResponseError(null);
    setResponseSuccess('');
  };

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

  // Get display values with fallbacks
  const getDisplayValue = (value, fallback = 'N/A') => {
    return value || fallback;
  };

  // Response Modal Component
  const ResponseModal = () => (
    <Modal show={showResponseModal} onHide={handleResponseModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:message" className="me-2" />
          {responseAction === 'create' ? 'Add Response' : 'Edit Response'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleResponseSubmit}>
        <Modal.Body>
          {responseError && (
            <Alert variant="danger" onClose={() => setResponseError(null)} dismissible>
              {responseError}
            </Alert>
          )}
          
          {responseSuccess && (
            <Alert variant="success">
              {responseSuccess}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={responseForm.message}
              onChange={(e) => handleResponseFormChange('message', e.target.value)}
              placeholder="Enter your response message..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Attachment</Form.Label>
            <Form.Control
              type="text"
              value={responseForm.attachment || ''}
              onChange={(e) => handleResponseFormChange('attachment', e.target.value)}
              placeholder="Attachment URL or filename..."
            />
            <Form.Text className="text-muted">
              Optional: Add attachment URL or filename
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleResponseModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={responseLoading || !responseForm.message.trim()}
          >
            {responseLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                {responseAction === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:save" className="me-1" />
                {responseAction === 'create' ? 'Create Response' : 'Update Response'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );

  // View Complaint Modal Component
  const ViewComplaintModal = () => {
    return (
      <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="bx:detail" className="me-2" />
            Complaint Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loadingComplaint && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading complaint details...</p>
            </div>
          )}

          {complaintError && (
            <Alert variant="danger" onClose={() => setComplaintError(null)} dismissible>
              {complaintError}
            </Alert>
          )}

          {responseSuccess && (
            <Alert variant="success" onClose={() => setResponseSuccess('')} dismissible>
              {responseSuccess}
            </Alert>
          )}

          {!loadingComplaint && selectedComplaint && (
            <div className="complaint-details">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="text-primary mb-1">
                    {getDisplayValue(selectedComplaint.title, 'No Title')}
                  </h4>
                  <p className="text-muted mb-0">
                    Complaint ID: #{selectedComplaint.id}
                  </p>
                </div>
                <div className="text-end">
                  <Badge bg={getStatusVariant(selectedComplaint.status)} className="fs-6 mb-2">
                    {getDisplayValue(selectedComplaint.status)}
                  </Badge>
                  <br />
                  <Badge bg={getPriorityVariant(selectedComplaint.priority)}>
                    Priority: {getDisplayValue(selectedComplaint.priority)}
                  </Badge>
                </div>
              </div>

              <Row className="g-3">
                {/* Basic Complaint Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Complaint Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Title</label>
                        <p className="mb-0">{selectedComplaint.title}</p>
                      </div>
                      
                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Description</label>
                        <p className="mb-0">{selectedComplaint.description}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Resolution Notes</label>
                        <p className="mb-0">
                          {getDisplayValue(selectedComplaint.resolution_notes, 'No resolution notes provided')}
                        </p>
                      </div>

                      <div className="detail-item">
                        <label className="fw-semibold text-muted small">Evidence/Attachment</label>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          {selectedComplaint.evidence ? (
                            <>
                              <IconifyIcon icon="mdi:paperclip" className="text-muted" />
                              <span className="text-primary">{selectedComplaint.evidence}</span>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="ms-2"
                                onClick={() => {
                                  // Handle evidence download/view
                                  console.log('View evidence:', selectedComplaint.evidence);
                                }}
                              >
                                <IconifyIcon icon="bx:download" className="me-1" />
                                View
                              </Button>
                            </>
                          ) : (
                            <span className="text-muted">No evidence attached</span>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Dates and Status */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Timeline & Status</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Created Date</label>
                        <p className="mb-0">{formatDateTime(selectedComplaint.created_at)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Last Updated</label>
                        <p className="mb-0">{formatDateTime(selectedComplaint.updated_at)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Status</label>
                        <div>
                          <Badge bg={getStatusVariant(selectedComplaint.status)} className="text-capitalize">
                            {selectedComplaint.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="detail-item">
                        <label className="fw-semibold text-muted small">Priority</label>
                        <div>
                          <Badge bg={getPriorityVariant(selectedComplaint.priority)} className="text-capitalize">
                            {selectedComplaint.priority}
                          </Badge>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Apartment Information */}
                {selectedComplaint.apartment && (
                  <Col xs={12}>
                    <Card>
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Apartment Information</h6>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={3}>
                            <div className="detail-item">
                              <label className="fw-semibold text-muted small">Unit Number</label>
                              <p className="mb-0">{selectedComplaint.apartment.number_item}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="detail-item">
                              <label className="fw-semibold text-muted small">Location</label>
                              <p className="mb-0">{selectedComplaint.apartment.location}</p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="detail-item">
                              <label className="fw-semibold text-muted small">Address</label>
                              <p className="mb-0">{selectedComplaint.apartment.address}</p>
                            </div>
                          </Col>
                          {selectedComplaint.apartment.apartment_category && (
                            <>
                              <Col md={6}>
                                <div className="detail-item">
                                  <label className="fw-semibold text-muted small">Category</label>
                                  <p className="mb-0">
                                    {selectedComplaint.apartment.apartment_category.name}
                                  </p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="detail-item">
                                  <label className="fw-semibold text-muted small">Category Description</label>
                                  <p className="mb-0">
                                    {getDisplayValue(
                                      selectedComplaint.apartment.apartment_category.description,
                                      'No description'
                                    )}
                                  </p>
                                </div>
                              </Col>
                            </>
                          )}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {/* Complaint Responses Section */}
                <Col xs={12}>
                  <Card>
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        Responses ({selectedComplaint.complaint_responses?.length || 0})
                      </h6>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleCreateResponse}
                      >
                        <IconifyIcon icon="bx:plus" className="me-1" />
                        Add Response
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {selectedComplaint.complaint_responses && selectedComplaint.complaint_responses.length > 0 ? (
                        <div className="response-timeline">
                          {selectedComplaint.complaint_responses.map((response, index) => (
                            <div key={response.id} className="response-item mb-4 pb-4 border-bottom">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                  <div className="timeline-dot bg-primary rounded-circle me-3" 
                                       style={{width: '12px', height: '12px'}}></div>
                                  <h6 className="mb-0">Response #{index + 1}</h6>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <small className="text-muted">
                                    {formatDateTime(response.created_at)}
                                  </small>
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => handleEditResponse(response)}
                                    title="Edit Response"
                                  >
                                    <IconifyIcon icon="bx:edit" className="fs-14" />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeleteResponse(response.id)}
                                    disabled={responseLoading}
                                    title="Delete Response"
                                  >
                                    {responseLoading ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <IconifyIcon icon="bx:trash" className="fs-14" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="ms-4">
                                <p className="mb-2">{response.message}</p>
                                
                                {response.attachment && (
                                  <div className="d-flex align-items-center gap-2 mt-2">
                                    <IconifyIcon icon="mdi:paperclip" className="text-muted" />
                                    <span className="text-primary small">{response.attachment}</span>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm" 
                                      className="ms-2"
                                      onClick={() => {
                                        // Handle response attachment download/view
                                        console.log('View response attachment:', response.attachment);
                                      }}
                                    >
                                      <IconifyIcon icon="bx:download" className="me-1" />
                                      View
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <IconifyIcon icon="bx:message-detail" className="text-muted fs-1 mb-2" />
                          <p className="text-muted mb-3">No responses yet for this complaint</p>
                          <Button 
                            variant="primary"
                            onClick={handleCreateResponse}
                          >
                            <IconifyIcon icon="bx:plus" className="me-1" />
                            Add First Response
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {!loadingComplaint && !selectedComplaint && !complaintError && (
            <div className="text-center py-4">
              <p>No complaint data available</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
          {selectedComplaint && (
            <Button 
              variant="primary"
              onClick={() => {
                // Print functionality
                window.print();
              }}
            >
              <IconifyIcon icon="bx:printer" className="me-1" />
              Print
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      {/* Your existing table and pagination code remains the same */}
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
                    <Button 
                      variant="soft-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleViewClick(complaint)}
                      title="View Details"
                      disabled={loadingComplaint}
                    >
                      {loadingComplaint && selectedComplaint?.id === (complaint.id || complaint.complaint_id) ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <IconifyIcon icon="bx:show" className="fs-16" />
                      )}
                    </Button>
                    <Button 
                      variant="soft-secondary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => onEditComplaint(complaint)}
                      title="Edit Complaint"
                    >
                      <IconifyIcon icon="bx:edit" className="fs-16" />
                    </Button>
                    <Button 
                      variant="soft-danger" 
                      size="sm" 
                      onClick={() => onDeleteComplaint(complaint.id || complaint.complaint_id)}
                      disabled={deletingId === (complaint.id || complaint.complaint_id)}
                      title="Delete Complaint"
                    >
                      {deletingId === (complaint.id || complaint.complaint_id) ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <IconifyIcon icon="bx:trash" className="fs-16" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Keep your existing pagination code */}
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
              {/* Your existing pagination code */}
            </ul>
          </div>
        </div>
      )}

      {/* View Complaint Modal */}
      <ViewComplaintModal />

      {/* Response Management Modal */}
      <ResponseModal />
    </div>
  );
};

export default ComplaintsListView;