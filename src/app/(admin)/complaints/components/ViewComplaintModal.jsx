import { useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ViewComplaintModal = ({ show, handleClose, complaint, tenantSlug }) => {
  const { user } = useAuthContext();
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && complaint) {
      fetchComplaintDetails();
    }
  }, [show, complaint]);

  const fetchComplaintDetails = async () => {
    if (!complaint) return;

    setLoading(true);
    setError(null);

    try {
      const complaintId = complaint.id || complaint.complaint_id;
      
      if (!complaintId) {
        throw new Error('Complaint ID not found');
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/view/${complaintId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the complaint data from the response
      const details = response.data.complaint || response.data.data || response.data;
      setComplaintDetails(details);

    } catch (err) {
      console.error('Failed to fetch complaint details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
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
      case 'urgent': return 'danger';
      default: return 'secondary';
    }
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

  const getDisplayValue = (value, fallback = 'N/A') => {
    return value || fallback;
  };

  // Use either the fetched details or the passed complaint prop as fallback
  const displayData = complaintDetails || complaint;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:detail" className="me-2" />
          Complaint Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading complaint details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        ) : displayData ? (
          <div className="complaint-details">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="text-primary mb-1">
                  {getDisplayValue(displayData.title, 'No Title')}
                </h4>
                <p className="text-muted mb-0">
                  ID: #{displayData.complaint_id || displayData.id || 'N/A'}
                </p>
              </div>
              <div className="text-end">
                <Badge bg={getStatusVariant(displayData.status)} className="fs-6">
                  {getDisplayValue(displayData.status, 'Open')}
                </Badge>
                <br />
                <Badge bg={getPriorityVariant(displayData.priority)} className="mt-1">
                  {getDisplayValue(displayData.priority, 'Medium')}
                </Badge>
              </div>
            </div>

            <Row className="g-3">
              {/* Basic Information */}
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Category</label>
                  <p className="mb-0">
                    {getDisplayValue(displayData.category, 'General')}
                  </p>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Apartment Unit</label>
                  <p className="mb-0">
                    {getDisplayValue(displayData.apartment_unit_name, 'Not specified')}
                  </p>
                </div>
              </Col>

              {/* Dates */}
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Created Date</label>
                  <p className="mb-0">
                    {formatDateTime(displayData.created_at)}
                  </p>
                </div>
              </Col>

              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Last Updated</label>
                  <p className="mb-0">
                    {formatDateTime(displayData.updated_at || displayData.created_at)}
                  </p>
                </div>
              </Col>

              {/* Description */}
              <Col xs={12}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Description</label>
                  <div className="border rounded p-3 bg-light">
                    {getDisplayValue(displayData.description, 'No description provided')}
                  </div>
                </div>
              </Col>

              {/* Additional Information if available */}
              {displayData.assigned_to && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Assigned To</label>
                    <p className="mb-0">
                      {displayData.assigned_to}
                    </p>
                  </div>
                </Col>
              )}

              {displayData.resolved_at && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Resolved At</label>
                    <p className="mb-0">
                      {formatDateTime(displayData.resolved_at)}
                    </p>
                  </div>
                </Col>
              )}

              {/* Evidence/Attachment */}
              {(displayData.evidence || displayData.attachment) && (
                <Col xs={12}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Evidence</label>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <IconifyIcon icon="mdi:file-image" className="text-muted" />
                      <span className="text-primary">
                        {displayData.evidence || displayData.attachment}
                      </span>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => {
                          // Handle evidence download/view
                          const evidenceUrl = displayData.evidence_url || 
                            `${import.meta.env.VITE_BACKEND_URL}/uploads/${displayData.evidence || displayData.attachment}`;
                          window.open(evidenceUrl, '_blank');
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
              {displayData.status_history && Array.isArray(displayData.status_history) && (
                <Col xs={12}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Status History</label>
                    <div className="status-timeline mt-2">
                      {displayData.status_history.map((history, index) => (
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
        ) : (
          <Alert variant="warning">
            No complaint details available
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button 
          variant="primary"
          onClick={() => window.print()}
        >
          <IconifyIcon icon="bx:printer" className="me-1" />
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewComplaintModal;