import { useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ViewMaintenanceModal = ({ show, handleClose, maintenance, tenantSlug }) => {
  const { user } = useAuthContext();
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && maintenance) {
      fetchMaintenanceDetails();
    }
  }, [show, maintenance]);

  const fetchMaintenanceDetails = async () => {
    if (!maintenance) return;

    setLoading(true);
    setError(null);

    try {
      const maintenanceId = maintenance.id || maintenance.maintenance_id;
      
      if (!maintenanceId) {
        throw new Error('Maintenance ID not found');
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/maintenance/view/${maintenanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the maintenance data from the response
      const details = response.data.maintenance || response.data.data || response.data;
      setMaintenanceDetails(details);

    } catch (err) {
      console.error('Failed to fetch maintenance details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load maintenance details');
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

  // Use either the fetched details or the passed maintenance prop as fallback
  const displayData = maintenanceDetails || maintenance;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:detail" className="me-2" />
          Maintenance Request Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading maintenance details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        ) : displayData ? (
          <div className="maintenance-details">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="text-primary mb-1">
                  {getDisplayValue(displayData.maintenance_title, 'No Title')}
                </h4>
                <p className="text-muted mb-0">
                  ID: #{displayData.maintenance_id || displayData.id || 'N/A'}
                </p>
              </div>
              <div className="text-end">
                <Badge bg={getStatusVariant(displayData.maintenance_status)} className="fs-6">
                  {getDisplayValue(displayData.maintenance_status, 'Open')}
                </Badge>
                <br />
                <Badge bg={getPriorityVariant(displayData.maintenance_priority || displayData.priority)} className="mt-1">
                  {getDisplayValue(displayData.maintenance_priority || displayData.priority, 'Medium')}
                </Badge>
              </div>
            </div>

            <Row className="g-3">
              {/* Basic Information */}
              <Col md={6}>
                <div className="detail-item">
                  <label className="fw-semibold text-muted">Category</label>
                  <p className="mb-0">
                    {getDisplayValue(displayData.maintenance_category, 'General')}
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
                    {getDisplayValue(displayData.maintenance_description, 'No description provided')}
                  </div>
                </div>
              </Col>

              {/* Additional Information */}
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

              {displayData.estimated_completion && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Estimated Completion</label>
                    <p className="mb-0">
                      {formatDateTime(displayData.estimated_completion)}
                    </p>
                  </div>
                </Col>
              )}

              {displayData.completed_at && (
                <Col md={6}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Completed At</label>
                    <p className="mb-0">
                      {formatDateTime(displayData.completed_at)}
                    </p>
                  </div>
                </Col>
              )}

              {/* Attachment/Evidence */}
              {(displayData.attachment || displayData.evidence) && (
                <Col xs={12}>
                  <div className="detail-item">
                    <label className="fw-semibold text-muted">Attachment</label>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <IconifyIcon icon="mdi:paperclip" className="text-muted" />
                      <span className="text-primary">
                        {displayData.attachment || displayData.evidence}
                      </span>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => {
                          // Handle attachment download/view
                          const attachmentUrl = displayData.attachment_url || 
                            `${import.meta.env.VITE_BACKEND_URL}/uploads/${displayData.attachment}`;
                          window.open(attachmentUrl, '_blank');
                        }}
                      >
                        <IconifyIcon icon="bx:download" className="me-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <Alert variant="warning">
            No maintenance details available
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

export default ViewMaintenanceModal;