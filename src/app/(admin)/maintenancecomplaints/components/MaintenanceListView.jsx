// // import { Link } from 'react-router-dom';
// // import { Button, Badge, Spinner, Modal, Row, Col, Alert, Card, Form } from 'react-bootstrap';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';

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
// //   const [loadingComplaint, setLoadingComplaint] = useState(false);
// //   const [complaintError, setComplaintError] = useState(null);
// //   const { user } = useAuthContext();

// //   // Response management states
// //   const [showResponseModal, setShowResponseModal] = useState(false);
// //   const [responseAction, setResponseAction] = useState('create'); // 'create', 'edit'
// //   const [selectedResponse, setSelectedResponse] = useState(null);
// //   const [responseForm, setResponseForm] = useState({
// //     message: '',
// //     attachment: null
// //   });
// //   const [responseLoading, setResponseLoading] = useState(false);
// //   const [responseError, setResponseError] = useState(null);
// //   const [responseSuccess, setResponseSuccess] = useState('');

// //   // Fetch individual complaint details
// //   const fetchComplaintDetails = async (complaintId) => {
// //     if (!complaintId) {
// //       setComplaintError('No complaint ID provided');
// //       return;
// //     }

// //     setLoadingComplaint(true);
// //     setComplaintError(null);

// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found');
// //       }

// //       const response = await axios.get(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/view/${complaintId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       console.log('Fetched complaint details:', response.data);
      
// //       // Use the data from the API response
// //       const complaintData = response.data.data;
// //       setSelectedComplaint(complaintData);
      
// //     } catch (error) {
// //       console.error('Error fetching complaint details:', error);
// //       setComplaintError(error.response?.data?.message || error.message || 'Failed to fetch complaint details');
// //       setSelectedComplaint(null);
// //     } finally {
// //       setLoadingComplaint(false);
// //     }
// //   };

// //   // Handle view button click
// //   const handleViewClick = async (complaint) => {
// //     const complaintId = complaint.id || complaint.complaint_id;
    
// //     if (!complaintId) {
// //       setComplaintError('No complaint ID found');
// //       return;
// //     }

// //     setShowViewModal(true);
    
// //     // Fetch the detailed complaint data
// //     await fetchComplaintDetails(complaintId);
// //   };

// //   // Handle modal close
// //   const handleViewModalClose = () => {
// //     setShowViewModal(false);
// //     setSelectedComplaint(null);
// //     setComplaintError(null);
// //   };

// //   // Response Management Functions
// //   const handleCreateResponse = () => {
// //     setResponseAction('create');
// //     setSelectedResponse(null);
// //     setResponseForm({
// //       message: '',
// //       attachment: null
// //     });
// //     setResponseError(null);
// //     setResponseSuccess('');
// //     setShowResponseModal(true);
// //   };

// //   const handleEditResponse = (response) => {
// //     setResponseAction('edit');
// //     setSelectedResponse(response);
// //     setResponseForm({
// //       message: response.message,
// //       attachment: response.attachment
// //     });
// //     setResponseError(null);
// //     setResponseSuccess('');
// //     setShowResponseModal(true);
// //   };

// //   const handleDeleteResponse = async (responseId) => {
// //     if (!responseId || !selectedComplaint) return;

// //     if (!window.confirm('Are you sure you want to delete this response?')) {
// //       return;
// //     }

// //     setResponseLoading(true);
// //     setResponseError(null);

// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found');
// //       }

// //       await axios.delete(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/delete/${responseId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       setResponseSuccess('Response deleted successfully!');
      
// //       // Refresh complaint details to get updated responses
// //       await fetchComplaintDetails(selectedComplaint.id);
      
// //       setTimeout(() => {
// //         setResponseSuccess('');
// //       }, 3000);
      
// //     } catch (error) {
// //       console.error('Error deleting response:', error);
// //       setResponseError(error.response?.data?.message || error.message || 'Failed to delete response');
// //     } finally {
// //       setResponseLoading(false);
// //     }
// //   };

// //   const handleResponseSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!responseForm.message.trim()) {
// //       setResponseError('Message is required');
// //       return;
// //     }

// //     setResponseLoading(true);
// //     setResponseError(null);

// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug || !selectedComplaint) {
// //         throw new Error('Required information missing');
// //       }

// //       let response;

// //       if (responseAction === 'create') {
// //         // Create new response
// //         response = await axios.post(
// //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/create`,
// //           {
// //             complaint_id: selectedComplaint.id,
// //             message: responseForm.message,
// //             attachment: responseForm.attachment
// //           },
// //           {
// //             headers: {
// //               'Authorization': `Bearer ${user.token}`,
// //               'Content-Type': 'application/json'
// //             }
// //           }
// //         );
// //       } else {
// //         // Update existing response
// //         response = await axios.put(
// //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/response/update/${selectedResponse.id}`,
// //           {
// //             message: responseForm.message,
// //             attachment: responseForm.attachment
// //           },
// //           {
// //             headers: {
// //               'Authorization': `Bearer ${user.token}`,
// //               'Content-Type': 'application/json'
// //             }
// //           }
// //         );
// //       }

// //       setResponseSuccess(
// //         responseAction === 'create' 
// //           ? 'Response created successfully!' 
// //           : 'Response updated successfully!'
// //       );

// //       // Refresh complaint details to get updated responses
// //       await fetchComplaintDetails(selectedComplaint.id);
      
// //       // Close modal after success
// //       setTimeout(() => {
// //         setShowResponseModal(false);
// //         setResponseSuccess('');
// //       }, 1500);
      
// //     } catch (error) {
// //       console.error('Error saving response:', error);
// //       setResponseError(error.response?.data?.message || error.message || 'Failed to save response');
// //     } finally {
// //       setResponseLoading(false);
// //     }
// //   };

// //   const handleResponseFormChange = (field, value) => {
// //     setResponseForm(prev => ({
// //       ...prev,
// //       [field]: value
// //     }));
// //   };

// //   const handleResponseModalClose = () => {
// //     setShowResponseModal(false);
// //     setResponseForm({
// //       message: '',
// //       attachment: null
// //     });
// //     setResponseError(null);
// //     setResponseSuccess('');
// //   };

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

// //   // Get display values with fallbacks
// //   const getDisplayValue = (value, fallback = 'N/A') => {
// //     return value || fallback;
// //   };

// //   // Response Modal Component
// //   const ResponseModal = () => (
// //     <Modal show={showResponseModal} onHide={handleResponseModalClose} centered>
// //       <Modal.Header closeButton>
// //         <Modal.Title>
// //           <IconifyIcon icon="bx:message" className="me-2" />
// //           {responseAction === 'create' ? 'Add Response' : 'Edit Response'}
// //         </Modal.Title>
// //       </Modal.Header>
// //       <Form onSubmit={handleResponseSubmit}>
// //         <Modal.Body>
// //           {responseError && (
// //             <Alert variant="danger" onClose={() => setResponseError(null)} dismissible>
// //               {responseError}
// //             </Alert>
// //           )}
          
// //           {responseSuccess && (
// //             <Alert variant="success">
// //               {responseSuccess}
// //             </Alert>
// //           )}

// //           <Form.Group className="mb-3">
// //             <Form.Label>Message *</Form.Label>
// //             <Form.Control
// //               as="textarea"
// //               rows={4}
// //               value={responseForm.message}
// //               onChange={(e) => handleResponseFormChange('message', e.target.value)}
// //               placeholder="Enter your response message..."
// //               required
// //             />
// //           </Form.Group>

// //           <Form.Group className="mb-3">
// //             <Form.Label>Attachment</Form.Label>
// //             <Form.Control
// //               type="text"
// //               value={responseForm.attachment || ''}
// //               onChange={(e) => handleResponseFormChange('attachment', e.target.value)}
// //               placeholder="Attachment URL or filename..."
// //             />
// //             <Form.Text className="text-muted">
// //               Optional: Add attachment URL or filename
// //             </Form.Text>
// //           </Form.Group>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleResponseModalClose}>
// //             Cancel
// //           </Button>
// //           <Button 
// //             variant="primary" 
// //             type="submit" 
// //             disabled={responseLoading || !responseForm.message.trim()}
// //           >
// //             {responseLoading ? (
// //               <>
// //                 <Spinner animation="border" size="sm" className="me-1" />
// //                 {responseAction === 'create' ? 'Creating...' : 'Updating...'}
// //               </>
// //             ) : (
// //               <>
// //                 <IconifyIcon icon="bx:save" className="me-1" />
// //                 {responseAction === 'create' ? 'Create Response' : 'Update Response'}
// //               </>
// //             )}
// //           </Button>
// //         </Modal.Footer>
// //       </Form>
// //     </Modal>
// //   );

// //   // View Complaint Modal Component
// //   const ViewComplaintModal = () => {
// //     return (
// //       <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
// //         <Modal.Header closeButton>
// //           <Modal.Title>
// //             <IconifyIcon icon="bx:detail" className="me-2" />
// //             Complaint Details
// //           </Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
// //           {loadingComplaint && (
// //             <div className="text-center py-4">
// //               <Spinner animation="border" variant="primary" />
// //               <p className="mt-2">Loading complaint details...</p>
// //             </div>
// //           )}

// //           {complaintError && (
// //             <Alert variant="danger" onClose={() => setComplaintError(null)} dismissible>
// //               {complaintError}
// //             </Alert>
// //           )}

// //           {responseSuccess && (
// //             <Alert variant="success" onClose={() => setResponseSuccess('')} dismissible>
// //               {responseSuccess}
// //             </Alert>
// //           )}

// //           {!loadingComplaint && selectedComplaint && (
// //             <div className="complaint-details">
// //               {/* Header Section */}
// //               <div className="d-flex justify-content-between align-items-start mb-4">
// //                 <div>
// //                   <h4 className="text-primary mb-1">
// //                     {getDisplayValue(selectedComplaint.title, 'No Title')}
// //                   </h4>
// //                   <p className="text-muted mb-0">
// //                     Complaint ID: #{selectedComplaint.id}
// //                   </p>
// //                 </div>
// //                 <div className="text-end">
// //                   <Badge bg={getStatusVariant(selectedComplaint.status)} className="fs-6 mb-2">
// //                     {getDisplayValue(selectedComplaint.status)}
// //                   </Badge>
// //                   <br />
// //                   <Badge bg={getPriorityVariant(selectedComplaint.priority)}>
// //                     Priority: {getDisplayValue(selectedComplaint.priority)}
// //                   </Badge>
// //                 </div>
// //               </div>

// //               <Row className="g-3">
// //                 {/* Basic Complaint Information */}
// //                 <Col md={6}>
// //                   <Card className="h-100">
// //                     <Card.Header className="bg-light">
// //                       <h6 className="mb-0">Complaint Information</h6>
// //                     </Card.Header>
// //                     <Card.Body>
// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Title</label>
// //                         <p className="mb-0">{selectedComplaint.title}</p>
// //                       </div>
                      
// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Description</label>
// //                         <p className="mb-0">{selectedComplaint.description}</p>
// //                       </div>

// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Resolution Notes</label>
// //                         <p className="mb-0">
// //                           {getDisplayValue(selectedComplaint.resolution_notes, 'No resolution notes provided')}
// //                         </p>
// //                       </div>

// //                       <div className="detail-item">
// //                         <label className="fw-semibold text-muted small">Evidence/Attachment</label>
// //                         <div className="d-flex align-items-center gap-2 mt-1">
// //                           {selectedComplaint.evidence ? (
// //                             <>
// //                               <IconifyIcon icon="mdi:paperclip" className="text-muted" />
// //                               <span className="text-primary">{selectedComplaint.evidence}</span>
// //                               <Button 
// //                                 variant="outline-primary" 
// //                                 size="sm" 
// //                                 className="ms-2"
// //                                 onClick={() => {
// //                                   // Handle evidence download/view
// //                                   console.log('View evidence:', selectedComplaint.evidence);
// //                                 }}
// //                               >
// //                                 <IconifyIcon icon="bx:download" className="me-1" />
// //                                 View
// //                               </Button>
// //                             </>
// //                           ) : (
// //                             <span className="text-muted">No evidence attached</span>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </Card.Body>
// //                   </Card>
// //                 </Col>

// //                 {/* Dates and Status */}
// //                 <Col md={6}>
// //                   <Card className="h-100">
// //                     <Card.Header className="bg-light">
// //                       <h6 className="mb-0">Timeline & Status</h6>
// //                     </Card.Header>
// //                     <Card.Body>
// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Created Date</label>
// //                         <p className="mb-0">{formatDateTime(selectedComplaint.created_at)}</p>
// //                       </div>

// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Last Updated</label>
// //                         <p className="mb-0">{formatDateTime(selectedComplaint.updated_at)}</p>
// //                       </div>

// //                       <div className="detail-item mb-3">
// //                         <label className="fw-semibold text-muted small">Status</label>
// //                         <div>
// //                           <Badge bg={getStatusVariant(selectedComplaint.status)} className="text-capitalize">
// //                             {selectedComplaint.status}
// //                           </Badge>
// //                         </div>
// //                       </div>

// //                       <div className="detail-item">
// //                         <label className="fw-semibold text-muted small">Priority</label>
// //                         <div>
// //                           <Badge bg={getPriorityVariant(selectedComplaint.priority)} className="text-capitalize">
// //                             {selectedComplaint.priority}
// //                           </Badge>
// //                         </div>
// //                       </div>
// //                     </Card.Body>
// //                   </Card>
// //                 </Col>

// //                 {/* Apartment Information */}
// //                 {selectedComplaint.apartment && (
// //                   <Col xs={12}>
// //                     <Card>
// //                       <Card.Header className="bg-light">
// //                         <h6 className="mb-0">Apartment Information</h6>
// //                       </Card.Header>
// //                       <Card.Body>
// //                         <Row>
// //                           <Col md={3}>
// //                             <div className="detail-item">
// //                               <label className="fw-semibold text-muted small">Unit Number</label>
// //                               <p className="mb-0">{selectedComplaint.apartment.number_item}</p>
// //                             </div>
// //                           </Col>
// //                           <Col md={3}>
// //                             <div className="detail-item">
// //                               <label className="fw-semibold text-muted small">Location</label>
// //                               <p className="mb-0">{selectedComplaint.apartment.location}</p>
// //                             </div>
// //                           </Col>
// //                           <Col md={6}>
// //                             <div className="detail-item">
// //                               <label className="fw-semibold text-muted small">Address</label>
// //                               <p className="mb-0">{selectedComplaint.apartment.address}</p>
// //                             </div>
// //                           </Col>
// //                           {selectedComplaint.apartment.apartment_category && (
// //                             <>
// //                               <Col md={6}>
// //                                 <div className="detail-item">
// //                                   <label className="fw-semibold text-muted small">Category</label>
// //                                   <p className="mb-0">
// //                                     {selectedComplaint.apartment.apartment_category.name}
// //                                   </p>
// //                                 </div>
// //                               </Col>
// //                               <Col md={6}>
// //                                 <div className="detail-item">
// //                                   <label className="fw-semibold text-muted small">Category Description</label>
// //                                   <p className="mb-0">
// //                                     {getDisplayValue(
// //                                       selectedComplaint.apartment.apartment_category.description,
// //                                       'No description'
// //                                     )}
// //                                   </p>
// //                                 </div>
// //                               </Col>
// //                             </>
// //                           )}
// //                         </Row>
// //                       </Card.Body>
// //                     </Card>
// //                   </Col>
// //                 )}

// //                 {/* Complaint Responses Section */}
// //                 <Col xs={12}>
// //                   <Card>
// //                     <Card.Header className="bg-light d-flex justify-content-between align-items-center">
// //                       <h6 className="mb-0">
// //                         Responses ({selectedComplaint.complaint_responses?.length || 0})
// //                       </h6>
// //                       <Button 
// //                         variant="primary" 
// //                         size="sm"
// //                         onClick={handleCreateResponse}
// //                       >
// //                         <IconifyIcon icon="bx:plus" className="me-1" />
// //                         Add Response
// //                       </Button>
// //                     </Card.Header>
// //                     <Card.Body>
// //                       {selectedComplaint.complaint_responses && selectedComplaint.complaint_responses.length > 0 ? (
// //                         <div className="response-timeline">
// //                           {selectedComplaint.complaint_responses.map((response, index) => (
// //                             <div key={response.id} className="response-item mb-4 pb-4 border-bottom">
// //                               <div className="d-flex justify-content-between align-items-start mb-2">
// //                                 <div className="d-flex align-items-center">
// //                                   <div className="timeline-dot bg-primary rounded-circle me-3" 
// //                                        style={{width: '12px', height: '12px'}}></div>
// //                                   <h6 className="mb-0">Response #{index + 1}</h6>
// //                                 </div>
// //                                 <div className="d-flex align-items-center gap-2">
// //                                   <small className="text-muted">
// //                                     {formatDateTime(response.created_at)}
// //                                   </small>
// //                                   <Button 
// //                                     variant="outline-secondary" 
// //                                     size="sm"
// //                                     onClick={() => handleEditResponse(response)}
// //                                     title="Edit Response"
// //                                   >
// //                                     <IconifyIcon icon="bx:edit" className="fs-14" />
// //                                   </Button>
// //                                   <Button 
// //                                     variant="outline-danger" 
// //                                     size="sm"
// //                                     onClick={() => handleDeleteResponse(response.id)}
// //                                     disabled={responseLoading}
// //                                     title="Delete Response"
// //                                   >
// //                                     {responseLoading ? (
// //                                       <Spinner animation="border" size="sm" />
// //                                     ) : (
// //                                       <IconifyIcon icon="bx:trash" className="fs-14" />
// //                                     )}
// //                                   </Button>
// //                                 </div>
// //                               </div>
                              
// //                               <div className="ms-4">
// //                                 <p className="mb-2">{response.message}</p>
                                
// //                                 {response.attachment && (
// //                                   <div className="d-flex align-items-center gap-2 mt-2">
// //                                     <IconifyIcon icon="mdi:paperclip" className="text-muted" />
// //                                     <span className="text-primary small">{response.attachment}</span>
// //                                     <Button 
// //                                       variant="outline-primary" 
// //                                       size="sm" 
// //                                       className="ms-2"
// //                                       onClick={() => {
// //                                         // Handle response attachment download/view
// //                                         console.log('View response attachment:', response.attachment);
// //                                       }}
// //                                     >
// //                                       <IconifyIcon icon="bx:download" className="me-1" />
// //                                       View
// //                                     </Button>
// //                                   </div>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       ) : (
// //                         <div className="text-center py-4">
// //                           <IconifyIcon icon="bx:message-detail" className="text-muted fs-1 mb-2" />
// //                           <p className="text-muted mb-3">No responses yet for this complaint</p>
// //                           <Button 
// //                             variant="primary"
// //                             onClick={handleCreateResponse}
// //                           >
// //                             <IconifyIcon icon="bx:plus" className="me-1" />
// //                             Add First Response
// //                           </Button>
// //                         </div>
// //                       )}
// //                     </Card.Body>
// //                   </Card>
// //                 </Col>
// //               </Row>
// //             </div>
// //           )}

// //           {!loadingComplaint && !selectedComplaint && !complaintError && (
// //             <div className="text-center py-4">
// //               <p>No complaint data available</p>
// //             </div>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleViewModalClose}>
// //             Close
// //           </Button>
// //           {selectedComplaint && (
// //             <Button 
// //               variant="primary"
// //               onClick={() => {
// //                 // Print functionality
// //                 window.print();
// //               }}
// //             >
// //               <IconifyIcon icon="bx:printer" className="me-1" />
// //               Print
// //             </Button>
// //           )}
// //         </Modal.Footer>
// //       </Modal>
// //     );
// //   };

// //   return (
// //     <div>
// //       {/* Your existing table and pagination code remains the same */}
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
// //                       disabled={loadingComplaint}
// //                     >
// //                       {loadingComplaint && selectedComplaint?.id === (complaint.id || complaint.complaint_id) ? (
// //                         <Spinner animation="border" size="sm" />
// //                       ) : (
// //                         <IconifyIcon icon="bx:show" className="fs-16" />
// //                       )}
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

// //       {/* Pagination - Keep your existing pagination code */}
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
// //               {/* Your existing pagination code */}
// //             </ul>
// //           </div>
// //         </div>
// //       )}

// //       {/* View Complaint Modal */}
// //       <ViewComplaintModal />

// //       {/* Response Management Modal */}
// //       <ResponseModal />
// //     </div>
// //   );
// // };

// // export default ComplaintsListView;




// import { Link } from 'react-router-dom';
// import { Button, Badge, Spinner, Modal, Row, Col, Alert, Card, Form } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';

// const MaintenanceListView = ({ 
//   maintenance, 
//   currentPage, 
//   totalPages, 
//   totalMaintenance, 
//   itemsPerPage,
//   onPageChange,
//   onDeleteMaintenance,
//   onEditMaintenance,
//   deletingId,
//   tenantSlug
// }) => {
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedMaintenance, setSelectedMaintenance] = useState(null);
//   const [loadingMaintenance, setLoadingMaintenance] = useState(false);
//   const [maintenanceError, setMaintenanceError] = useState(null);
//   const { user } = useAuthContext();

//   // Response management states
//   const [showResponseModal, setShowResponseModal] = useState(false);
//   const [responseAction, setResponseAction] = useState('create'); // 'create', 'edit'
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [responseForm, setResponseForm] = useState({
//     message: '',
//     attachment: null
//   });
//   const [responseLoading, setResponseLoading] = useState(false);
//   const [responseError, setResponseError] = useState(null);
//   const [responseSuccess, setResponseSuccess] = useState('');

//   // Fetch individual maintenance details
//   const fetchMaintenanceDetails = async (maintenanceId) => {
//     if (!maintenanceId) {
//       setMaintenanceError('No maintenance ID provided');
//       return;
//     }

//     setLoadingMaintenance(true);
//     setMaintenanceError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view/${maintenanceId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched maintenance details:', response.data);
      
//       // Use the data from the API response
//       const maintenanceData = response.data.data;
//       setSelectedMaintenance(maintenanceData);
      
//     } catch (error) {
//       console.error('Error fetching maintenance details:', error);
//       setMaintenanceError(error.response?.data?.message || error.message || 'Failed to fetch maintenance details');
//       setSelectedMaintenance(null);
//     } finally {
//       setLoadingMaintenance(false);
//     }
//   };

//   // Handle view button click
//   const handleViewClick = async (maintenance) => {
//     const maintenanceId = maintenance.id || maintenance.maintenance_id;
    
//     if (!maintenanceId) {
//       setMaintenanceError('No maintenance ID found');
//       return;
//     }

//     setShowViewModal(true);
    
//     // Fetch the detailed maintenance data
//     await fetchMaintenanceDetails(maintenanceId);
//   };

//   // Handle modal close
//   const handleViewModalClose = () => {
//     setShowViewModal(false);
//     setSelectedMaintenance(null);
//     setMaintenanceError(null);
//   };

//   // Response Management Functions
//   const handleCreateResponse = () => {
//     setResponseAction('create');
//     setSelectedResponse(null);
//     setResponseForm({
//       message: '',
//       attachment: null
//     });
//     setResponseError(null);
//     setResponseSuccess('');
//     setShowResponseModal(true);
//   };

//   const handleEditResponse = (response) => {
//     setResponseAction('edit');
//     setSelectedResponse(response);
//     setResponseForm({
//       message: response.message,
//       attachment: response.attachment
//     });
//     setResponseError(null);
//     setResponseSuccess('');
//     setShowResponseModal(true);
//   };

//   const handleDeleteResponse = async (responseId) => {
//     if (!responseId || !selectedMaintenance) return;

//     if (!window.confirm('Are you sure you want to delete this response?')) {
//       return;
//     }

//     setResponseLoading(true);
//     setResponseError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/delete/${responseId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setResponseSuccess('Response deleted successfully!');
      
//       // Refresh maintenance details to get updated responses
//       await fetchMaintenanceDetails(selectedMaintenance.id);
      
//       setTimeout(() => {
//         setResponseSuccess('');
//       }, 3000);
      
//     } catch (error) {
//       console.error('Error deleting response:', error);
//       setResponseError(error.response?.data?.message || error.message || 'Failed to delete response');
//     } finally {
//       setResponseLoading(false);
//     }
//   };

//   const handleResponseSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!responseForm.message.trim()) {
//       setResponseError('Message is required');
//       return;
//     }

//     setResponseLoading(true);
//     setResponseError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug || !selectedMaintenance) {
//         throw new Error('Required information missing');
//       }

//       let response;

//       if (responseAction === 'create') {
//         // Create new response
//         response = await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/create`,
//           {
//             maintenance_id: selectedMaintenance.id,
//             message: responseForm.message,
//             attachment: responseForm.attachment
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       } else {
//         // Update existing response
//         response = await axios.put(
//           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/update/${selectedResponse.id}`,
//           {
//             message: responseForm.message,
//             attachment: responseForm.attachment
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       }

//       setResponseSuccess(
//         responseAction === 'create' 
//           ? 'Response created successfully!' 
//           : 'Response updated successfully!'
//       );

//       // Refresh maintenance details to get updated responses
//       await fetchMaintenanceDetails(selectedMaintenance.id);
      
//       // Close modal after success
//       setTimeout(() => {
//         setShowResponseModal(false);
//         setResponseSuccess('');
//       }, 1500);
      
//     } catch (error) {
//       console.error('Error saving response:', error);
//       setResponseError(error.response?.data?.message || error.message || 'Failed to save response');
//     } finally {
//       setResponseLoading(false);
//     }
//   };

//   const handleResponseFormChange = (field, value) => {
//     setResponseForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleResponseModalClose = () => {
//     setShowResponseModal(false);
//     setResponseForm({
//       message: '',
//       attachment: null
//     });
//     setResponseError(null);
//     setResponseSuccess('');
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
//   const endItem = Math.min(currentPage * itemsPerPage, totalMaintenance);

//   // Get display values with fallbacks
//   const getDisplayValue = (value, fallback = 'N/A') => {
//     return value || fallback;
//   };

//   // Response Modal Component
//   const ResponseModal = () => (
//     <Modal show={showResponseModal} onHide={handleResponseModalClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           <IconifyIcon icon="bx:message" className="me-2" />
//           {responseAction === 'create' ? 'Add Response' : 'Edit Response'}
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleResponseSubmit}>
//         <Modal.Body>
//           {responseError && (
//             <Alert variant="danger" onClose={() => setResponseError(null)} dismissible>
//               {responseError}
//             </Alert>
//           )}
          
//           {responseSuccess && (
//             <Alert variant="success">
//               {responseSuccess}
//             </Alert>
//           )}

//           <Form.Group className="mb-3">
//             <Form.Label>Message *</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={4}
//               value={responseForm.message}
//               onChange={(e) => handleResponseFormChange('message', e.target.value)}
//               placeholder="Enter your response message..."
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Attachment</Form.Label>
//             <Form.Control
//               type="text"
//               value={responseForm.attachment || ''}
//               onChange={(e) => handleResponseFormChange('attachment', e.target.value)}
//               placeholder="Attachment URL or filename..."
//             />
//             <Form.Text className="text-muted">
//               Optional: Add attachment URL or filename
//             </Form.Text>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleResponseModalClose}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             type="submit" 
//             disabled={responseLoading || !responseForm.message.trim()}
//           >
//             {responseLoading ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-1" />
//                 {responseAction === 'create' ? 'Creating...' : 'Updating...'}
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon="bx:save" className="me-1" />
//                 {responseAction === 'create' ? 'Create Response' : 'Update Response'}
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );

//   // View Maintenance Modal Component
//   const ViewMaintenanceModal = () => {
//     return (
//       <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <IconifyIcon icon="bx:detail" className="me-2" />
//             Maintenance Request Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//           {loadingMaintenance && (
//             <div className="text-center py-4">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-2">Loading maintenance details...</p>
//             </div>
//           )}

//           {maintenanceError && (
//             <Alert variant="danger" onClose={() => setMaintenanceError(null)} dismissible>
//               {maintenanceError}
//             </Alert>
//           )}

//           {responseSuccess && (
//             <Alert variant="success" onClose={() => setResponseSuccess('')} dismissible>
//               {responseSuccess}
//             </Alert>
//           )}

//           {!loadingMaintenance && selectedMaintenance && (
//             <div className="maintenance-details">
//               {/* Header Section */}
//               <div className="d-flex justify-content-between align-items-start mb-4">
//                 <div>
//                   <h4 className="text-primary mb-1">
//                     {getDisplayValue(selectedMaintenance.title, 'No Title')}
//                   </h4>
//                   <p className="text-muted mb-0">
//                     Maintenance ID: #{selectedMaintenance.maintenance_id}
//                   </p>
//                 </div>
//                 <div className="text-end">
//                   <Badge bg={getStatusVariant(selectedMaintenance.status)} className="fs-6 mb-2">
//                     {getDisplayValue(selectedMaintenance.status)}
//                   </Badge>
//                   <br />
//                   <Badge bg={getPriorityVariant(selectedMaintenance.priority)}>
//                     Priority: {getDisplayValue(selectedMaintenance.priority)}
//                   </Badge>
//                 </div>
//               </div>

//               <Row className="g-3">
//                 {/* Basic Maintenance Information */}
//                 <Col md={6}>
//                   <Card className="h-100">
//                     <Card.Header className="bg-light">
//                       <h6 className="mb-0">Maintenance Information</h6>
//                     </Card.Header>
//                     <Card.Body>
//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Title</label>
//                         <p className="mb-0">{selectedMaintenance.title}</p>
//                       </div>
                      
//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Description</label>
//                         <p className="mb-0">{selectedMaintenance.description}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Resolution Notes</label>
//                         <p className="mb-0">
//                           {getDisplayValue(selectedMaintenance.resolution_notes, 'No resolution notes provided')}
//                         </p>
//                       </div>

//                       <div className="detail-item">
//                         <label className="fw-semibold text-muted small">Evidence/Attachment</label>
//                         <div className="d-flex align-items-center gap-2 mt-1">
//                           {selectedMaintenance.evidence ? (
//                             <>
//                               <IconifyIcon icon="mdi:paperclip" className="text-muted" />
//                               <span className="text-primary">{selectedMaintenance.evidence}</span>
//                               <Button 
//                                 variant="outline-primary" 
//                                 size="sm" 
//                                 className="ms-2"
//                                 onClick={() => {
//                                   // Handle evidence download/view
//                                   console.log('View evidence:', selectedMaintenance.evidence);
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
//                         <p className="mb-0">{formatDateTime(selectedMaintenance.created_at)}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Last Updated</label>
//                         <p className="mb-0">{formatDateTime(selectedMaintenance.updated_at)}</p>
//                       </div>

//                       <div className="detail-item mb-3">
//                         <label className="fw-semibold text-muted small">Status</label>
//                         <div>
//                           <Badge bg={getStatusVariant(selectedMaintenance.status)} className="text-capitalize">
//                             {selectedMaintenance.status}
//                           </Badge>
//                         </div>
//                       </div>

//                       <div className="detail-item">
//                         <label className="fw-semibold text-muted small">Priority</label>
//                         <div>
//                           <Badge bg={getPriorityVariant(selectedMaintenance.priority)} className="text-capitalize">
//                             {selectedMaintenance.priority}
//                           </Badge>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>

//                 {/* Apartment Information */}
//                 {selectedMaintenance.apartment && (
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
//                               <p className="mb-0">{selectedMaintenance.apartment.number_item}</p>
//                             </div>
//                           </Col>
//                           <Col md={3}>
//                             <div className="detail-item">
//                               <label className="fw-semibold text-muted small">Location</label>
//                               <p className="mb-0">{selectedMaintenance.apartment.location}</p>
//                             </div>
//                           </Col>
//                           <Col md={6}>
//                             <div className="detail-item">
//                               <label className="fw-semibold text-muted small">Address</label>
//                               <p className="mb-0">{selectedMaintenance.apartment.address}</p>
//                             </div>
//                           </Col>
//                           {selectedMaintenance.apartment.apartment_category && (
//                             <>
//                               <Col md={6}>
//                                 <div className="detail-item">
//                                   <label className="fw-semibold text-muted small">Category</label>
//                                   <p className="mb-0">
//                                     {selectedMaintenance.apartment.apartment_category.name}
//                                   </p>
//                                 </div>
//                               </Col>
//                               <Col md={6}>
//                                 <div className="detail-item">
//                                   <label className="fw-semibold text-muted small">Category Description</label>
//                                   <p className="mb-0">
//                                     {getDisplayValue(
//                                       selectedMaintenance.apartment.apartment_category.description,
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

//                 {/* Maintenance Responses Section */}
//                 <Col xs={12}>
//                   <Card>
//                     <Card.Header className="bg-light d-flex justify-content-between align-items-center">
//                       <h6 className="mb-0">
//                         Responses ({selectedMaintenance.maintenance_responses?.length || 0})
//                       </h6>
//                       <Button 
//                         variant="primary" 
//                         size="sm"
//                         onClick={handleCreateResponse}
//                       >
//                         <IconifyIcon icon="bx:plus" className="me-1" />
//                         Add Response
//                       </Button>
//                     </Card.Header>
//                     <Card.Body>
//                       {selectedMaintenance.maintenance_responses && selectedMaintenance.maintenance_responses.length > 0 ? (
//                         <div className="response-timeline">
//                           {selectedMaintenance.maintenance_responses.map((response, index) => (
//                             <div key={response.id} className="response-item mb-4 pb-4 border-bottom">
//                               <div className="d-flex justify-content-between align-items-start mb-2">
//                                 <div className="d-flex align-items-center">
//                                   <div className="timeline-dot bg-primary rounded-circle me-3" 
//                                        style={{width: '12px', height: '12px'}}></div>
//                                   <h6 className="mb-0">Response #{index + 1}</h6>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <small className="text-muted">
//                                     {formatDateTime(response.created_at)}
//                                   </small>
//                                   <Button 
//                                     variant="outline-secondary" 
//                                     size="sm"
//                                     onClick={() => handleEditResponse(response)}
//                                     title="Edit Response"
//                                   >
//                                     <IconifyIcon icon="bx:edit" className="fs-14" />
//                                   </Button>
//                                   <Button 
//                                     variant="outline-danger" 
//                                     size="sm"
//                                     onClick={() => handleDeleteResponse(response.id)}
//                                     disabled={responseLoading}
//                                     title="Delete Response"
//                                   >
//                                     {responseLoading ? (
//                                       <Spinner animation="border" size="sm" />
//                                     ) : (
//                                       <IconifyIcon icon="bx:trash" className="fs-14" />
//                                     )}
//                                   </Button>
//                                 </div>
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
//                       ) : (
//                         <div className="text-center py-4">
//                           <IconifyIcon icon="bx:message-detail" className="text-muted fs-1 mb-2" />
//                           <p className="text-muted mb-3">No responses yet for this maintenance request</p>
//                           <Button 
//                             variant="primary"
//                             onClick={handleCreateResponse}
//                           >
//                             <IconifyIcon icon="bx:plus" className="me-1" />
//                             Add First Response
//                           </Button>
//                         </div>
//                       )}
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </div>
//           )}

//           {!loadingMaintenance && !selectedMaintenance && !maintenanceError && (
//             <div className="text-center py-4">
//               <p>No maintenance data available</p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleViewModalClose}>
//             Close
//           </Button>
//           {selectedMaintenance && (
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
//       {/* Your existing table and pagination code remains the same */}
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
//             {maintenance.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No maintenance requests found
//                 </td>
//               </tr>
//             ) : (
//               maintenance.map((maintenance, idx) => (
//                 <tr key={maintenance.id || maintenance.maintenance_id || idx}>
//                   <td>
//                     <span className="fw-semibold">#{maintenance.maintenance_id || maintenance.id || 'N/A'}</span>
//                   </td>
//                   <td>
//                     <div className="d-flex align-items-center gap-2">
//                       <div>
//                         <h6 className="mb-0">{maintenance.maintenance_title || 'No Title'}</h6>
//                         <small className="text-muted">
//                           {maintenance.maintenance_description ? `${maintenance.maintenance_description.substring(0, 50)}...` : 'No description'}
//                         </small>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <Badge bg="light" text="dark" className="text-capitalize">
//                       {maintenance.category || 'General'}
//                     </Badge>
//                   </td>
//                   <td>
//                     {maintenance.created_at ? (
//                       <>
//                         {formatDate(maintenance.created_at)}
//                         <br />
//                         <small className="text-muted">
//                           {new Date(maintenance.created_at).toLocaleTimeString()}
//                         </small>
//                       </>
//                     ) : 'N/A'}
//                   </td>
//                   <td>
//                     <Badge bg={getPriorityVariant(maintenance.priority)} className="text-capitalize">
//                       {maintenance.priority || 'Medium'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Badge bg={getStatusVariant(maintenance.status)} className="text-capitalize">
//                       {maintenance.status || 'Open'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Button 
//                       variant="soft-primary" 
//                       size="sm" 
//                       className="me-2"
//                       onClick={() => handleViewClick(maintenance)}
//                       title="View Details"
//                       disabled={loadingMaintenance}
//                     >
//                       {loadingMaintenance && selectedMaintenance?.id === (maintenance.id || maintenance.maintenance_id) ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         <IconifyIcon icon="bx:show" className="fs-16" />
//                       )}
//                     </Button>
//                     <Button 
//                       variant="soft-secondary" 
//                       size="sm" 
//                       className="me-2"
//                       onClick={() => onEditMaintenance(maintenance)}
//                       title="Edit Maintenance Request"
//                     >
//                       <IconifyIcon icon="bx:edit" className="fs-16" />
//                     </Button>
//                     <Button 
//                       variant="soft-danger" 
//                       size="sm" 
//                       onClick={() => onDeleteMaintenance(maintenance.id || maintenance.maintenance_id)}
//                       disabled={deletingId === (maintenance.id || maintenance.maintenance_id)}
//                       title="Delete Maintenance Request"
//                     >
//                       {deletingId === (maintenance.id || maintenance.maintenance_id) ? (
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
//       {maintenance.length > 0 && (
//         <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
//           <div className="col-sm">
//             <div className="text-muted">
//               Showing&nbsp;
//               <span className="fw-semibold">{startItem}</span>&nbsp; to&nbsp;
//               <span className="fw-semibold">{endItem}</span>&nbsp; of&nbsp;
//               <span className="fw-semibold">{totalMaintenance}</span>&nbsp; maintenance requests
//             </div>
//           </div>
//           <div className="col-sm-auto mt-3 mt-sm-0">
//             <ul className="pagination pagination-rounded m-0">
//               {/* Your existing pagination code */}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* View Maintenance Modal */}
//       <ViewMaintenanceModal />

//       {/* Response Management Modal */}
//       <ResponseModal />
//     </div>
//   );
// };

// export default MaintenanceListView;


import { Button, Badge, Spinner, Modal, Row, Col, Alert, Card, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const { user } = useAuthContext();

  // Response management states
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState('create');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseForm, setResponseForm] = useState({
    message: '',
    attachment: null
  });
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState('');

  // Fetch individual maintenance details
  const fetchMaintenanceDetails = async (maintenanceId) => {
    if (!maintenanceId) {
      setMaintenanceError('No maintenance ID provided');
      return;
    }

    setLoadingMaintenance(true);
    setMaintenanceError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      console.log('Fetching maintenance details for ID:', maintenanceId);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view/${maintenanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Maintenance details API response:', response);
      console.log('Maintenance details data:', response.data);
      
      // Handle different possible response structures
      let maintenanceData = null;
      
      if (response.data?.data) {
        maintenanceData = response.data.data;
      } else if (response.data) {
        maintenanceData = response.data;
      }
      
      console.log('Final maintenance details:', maintenanceData);
      
      if (!maintenanceData) {
        throw new Error('No maintenance data received from API');
      }
      
      setSelectedMaintenance(maintenanceData);
      
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch maintenance details';
      
      setMaintenanceError(errorMessage);
      setSelectedMaintenance(null);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  // Handle view button click
  const handleViewClick = async (maintenanceItem) => {
    console.log('View clicked for maintenance:', maintenanceItem);
    
    // Try different possible ID fields
    const maintenanceId = maintenanceItem.id || maintenanceItem.maintenance_id || maintenanceItem._id;
    
    console.log('Maintenance ID to fetch:', maintenanceId);
    
    if (!maintenanceId) {
      setMaintenanceError('No maintenance ID found in the item');
      setShowViewModal(true);
      return;
    }

    setShowViewModal(true);
    
    // Fetch the detailed maintenance data
    await fetchMaintenanceDetails(maintenanceId);
  };

  // Handle modal close
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedMaintenance(null);
    setMaintenanceError(null);
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
    if (!responseId || !selectedMaintenance) return;

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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/delete/${responseId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponseSuccess('Response deleted successfully!');
      
      // Refresh maintenance details to get updated responses
      const maintenanceId = selectedMaintenance.id || selectedMaintenance.maintenance_id;
      if (maintenanceId) {
        await fetchMaintenanceDetails(maintenanceId);
      }
      
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

      if (!tenantSlug || !selectedMaintenance) {
        throw new Error('Required information missing');
      }

      const maintenanceId = selectedMaintenance.id || selectedMaintenance.maintenance_id;
      
      if (!maintenanceId) {
        throw new Error('Maintenance ID not found');
      }

      let response;

      if (responseAction === 'create') {
        // Create new response
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/create`,
          {
            maintenance_id: maintenanceId,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/response/update/${selectedResponse.id}`,
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

      // Refresh maintenance details to get updated responses
      await fetchMaintenanceDetails(maintenanceId);
      
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

  const getStatusVariant = (maintenance_status) => {
    if (!maintenance_status) return 'light';
    
    switch (maintenance_status?.toLowerCase()) {
      case 'open': return 'primary';
      case 'in progress': return 'warning';
      // case 'in_progress': 
      // case 'under_review': 
        // return 'warning';
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
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMaintenance);

  // Get display values with fallbacks
  const getDisplayValue = (value, fallback = 'N/A') => {
    return value || value === 0 ? value : fallback;
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  // View Maintenance Modal Component
  const ViewMaintenanceModal = () => {
    return (
      <Modal show={showViewModal} onHide={handleViewModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="bx:detail" className="me-2" />
            Maintenance Request Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loadingMaintenance && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading maintenance details...</p>
            </div>
          )}

          {maintenanceError && (
            <Alert variant="danger" onClose={() => setMaintenanceError(null)} dismissible>
              {maintenanceError}
            </Alert>
          )}

          {responseSuccess && (
            <Alert variant="success" onClose={() => setResponseSuccess('')} dismissible>
              {responseSuccess}
            </Alert>
          )}

          {!loadingMaintenance && selectedMaintenance && (
            <div className="maintenance-details">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="text-primary mb-1">
                    {getDisplayValue(selectedMaintenance.title, 'No Title')}
                  </h4>
                  <p className="text-muted mb-0">
                    Maintenance ID: #{selectedMaintenance.id || selectedMaintenance.maintenance_id}
                  </p>
                </div>
                <div className="text-end">
                  <Badge bg={getStatusVariant(selectedMaintenance.status)} className="fs-6 mb-2">
                    {formatStatus(selectedMaintenance.status)}
                  </Badge>
                  <br />
                  <Badge bg={getPriorityVariant(selectedMaintenance.priority)}>
                    Priority: {getDisplayValue(selectedMaintenance.priority)}
                  </Badge>
                </div>
              </div>

              <Row className="g-3">
                {/* Basic Maintenance Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Maintenance Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Title</label>
                        <p className="mb-0">{getDisplayValue(selectedMaintenance.title)}</p>
                      </div>
                      
                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Description</label>
                        <p className="mb-0">{getDisplayValue(selectedMaintenance.description)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Category</label>
                        <p className="mb-0">{getDisplayValue(selectedMaintenance.category)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Resolution Notes</label>
                        <p className="mb-0">
                          {getDisplayValue(selectedMaintenance.resolution_notes, 'No resolution notes provided')}
                        </p>
                      </div>

                      <div className="detail-item">
                        <label className="fw-semibold text-muted small">Evidence/Attachment</label>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          {selectedMaintenance.evidence ? (
                            <>
                              <IconifyIcon icon="mdi:paperclip" className="text-muted" />
                              <span className="text-primary">{selectedMaintenance.evidence}</span>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="ms-2"
                                onClick={() => {
                                  console.log('View evidence:', selectedMaintenance.evidence);
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
                        <p className="mb-0">{formatDateTime(selectedMaintenance.created_at)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Last Updated</label>
                        <p className="mb-0">{formatDateTime(selectedMaintenance.updated_at)}</p>
                      </div>

                      <div className="detail-item mb-3">
                        <label className="fw-semibold text-muted small">Status</label>
                        <div>
                          <Badge bg={getStatusVariant(selectedMaintenance.status)} className="text-capitalize">
                            {formatStatus(selectedMaintenance.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="detail-item">
                        <label className="fw-semibold text-muted small">Priority</label>
                        <div>
                          <Badge bg={getPriorityVariant(selectedMaintenance.priority)} className="text-capitalize">
                            {getDisplayValue(selectedMaintenance.priority)}
                          </Badge>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Apartment Information */}
                {selectedMaintenance.apartment && (
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
                              <p className="mb-0">{getDisplayValue(selectedMaintenance.apartment.number_item)}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="detail-item">
                              <label className="fw-semibold text-muted small">Location</label>
                              <p className="mb-0">{getDisplayValue(selectedMaintenance.apartment.location)}</p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="detail-item">
                              <label className="fw-semibold text-muted small">Address</label>
                              <p className="mb-0">{getDisplayValue(selectedMaintenance.apartment.address)}</p>
                            </div>
                          </Col>
                          {selectedMaintenance.apartment.apartment_category && (
                            <>
                              <Col md={6}>
                                <div className="detail-item">
                                  <label className="fw-semibold text-muted small">Category</label>
                                  <p className="mb-0">
                                    {getDisplayValue(selectedMaintenance.apartment.apartment_category.name)}
                                  </p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="detail-item">
                                  <label className="fw-semibold text-muted small">Category Description</label>
                                  <p className="mb-0">
                                    {getDisplayValue(
                                      selectedMaintenance.apartment.apartment_category.description,
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

                {/* Maintenance Responses Section */}
                <Col xs={12}>
                  <Card>
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        Responses ({selectedMaintenance.maintenance_responses?.length || 0})
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
                      {selectedMaintenance.maintenance_responses && selectedMaintenance.maintenance_responses.length > 0 ? (
                        <div className="response-timeline">
                          {selectedMaintenance.maintenance_responses.map((response, index) => (
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
                          <p className="text-muted mb-3">No responses yet for this maintenance request</p>
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

          {!loadingMaintenance && !selectedMaintenance && !maintenanceError && (
            <div className="text-center py-4">
              <p>No maintenance data available</p>
              <small className="text-muted">
                This could be due to API response format issues. Check the console for details.
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
          {selectedMaintenance && (
            <Button 
              variant="primary"
              onClick={() => {
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
      <div className="table-responsive table-centered">
        <table className="table text-nowrap mb-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="border-0 py-2">Maintenance ID</th>
              <th className="border-0 py-2">Title</th>
              <th className="border-0 py-2">Address</th>
              {/* <th className="border-0 py-2">Created Date</th> */}
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
              maintenance.map((maintenanceItem, idx) => {
                const maintenanceId = maintenanceItem.id || maintenanceItem.maintenance_id;
                const maintenanceTitle = maintenanceItem.maintenance_title || 'No Title';
                
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
                            {maintenanceItem.maintenance_description ? 
                              `${maintenanceItem.maintenance_description.substring(0, 50)}${maintenanceItem.maintenance_description.length > 50 ? '...' : ''}` : 
                              'No description'
                            }
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {/* <Badge bg="light" text="dark" className="text-capitalize"> */}
                        {maintenanceItem.maintenance_address || 'General'}
                      {/* </Badge> */}
                    </td>
                    {/* <td>
                      {maintenanceItem.created_at ? (
                        <>
                          {formatDate(maintenanceItem.created_at)}
                          <br />
                          <small className="text-muted">
                            {new Date(maintenanceItem.created_at).toLocaleTimeString()}
                          </small>
                        </>
                      ) : 'N/A'}
                    </td> */}
                    <td>
                      <Badge bg={getPriorityVariant(maintenanceItem.priority)} className="text-capitalize">
                        {maintenanceItem.priority || 'Medium'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(maintenanceItem.maintenance_status)} className="text-capitalize">
                        {formatStatus(maintenanceItem.maintenance_status)}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="soft-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleViewClick(maintenanceItem)}
                        title="View Details"
                        disabled={loadingMaintenance}
                      >
                        {loadingMaintenance && selectedMaintenance?.id === maintenanceId ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <IconifyIcon icon="bx:show" className="fs-16" />
                        )}
                      </Button>
                      <Button 
                        variant="soft-secondary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => onEditMaintenance(maintenanceItem)}
                        title="Edit Maintenance Request"
                      >
                        <IconifyIcon icon="bx:edit" className="fs-16" />
                      </Button>
                      <Button 
                        variant="soft-danger" 
                        size="sm" 
                        onClick={() => onDeleteMaintenance(maintenanceId)}
                        disabled={deletingId === maintenanceId}
                        title="Delete Maintenance Request"
                      >
                        {deletingId === maintenanceId ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <IconifyIcon icon="bx:trash" className="fs-16" />
                        )}
                      </Button>
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
            <ul className="pagination pagination-rounded m-0 justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button 
                  variant="link" 
                  className="page-link" 
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconifyIcon icon="bx:chevron-left" />
                </Button>
              </li>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show only relevant pages
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <Button 
                        variant="link" 
                        className="page-link" 
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Button>
                    </li>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <li key={page} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              })}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button 
                  variant="link" 
                  className="page-link" 
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <IconifyIcon icon="bx:chevron-right" />
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* View Maintenance Modal */}
      <ViewMaintenanceModal />

      {/* Response Management Modal */}
      <ResponseModal />
    </div>
  );
};

export default MaintenanceListView;