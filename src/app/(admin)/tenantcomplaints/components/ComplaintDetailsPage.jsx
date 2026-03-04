import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Button, 
  Badge, 
  Spinner, 
  Alert, 
  Card, 
  Row, 
  Col, 
  Container,
  Modal,
  Form
} from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';

const ComplaintDetailsPage = () => {
  const { complaintId, tenantSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Response modal states
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState('create');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseForm, setResponseForm] = useState({ message: '' });
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState('');

  useEffect(() => {
    if (complaintId && tenantSlug && user?.token) {
      fetchComplaintDetails();
    }
  }, [complaintId, tenantSlug, user]);

  const fetchComplaintDetails = async () => {
    setLoading(true);
    setError(null);

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

      setComplaint(response.data.data);
      
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch complaint details');
    } finally {
      setLoading(false);
    }
  };

  // Response Management Functions
  const handleCreateResponse = () => {
    setResponseAction('create');
    setSelectedResponse(null);
    setResponseForm({ message: '' });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleEditResponse = (response) => {
    setResponseAction('edit');
    setSelectedResponse(response);
    setResponseForm({ message: response.message });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleDeleteResponse = async (responseId) => {
    if (!responseId) return;

    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }

    setResponseLoading(true);
    setResponseError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      // Delete endpoint uses just response_id
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint-response/delete/${responseId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponseSuccess('Response deleted successfully!');
      await fetchComplaintDetails();
      
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
      let response;

      if (responseAction === 'create') {
        // CREATE response - uses complaint_id only
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint-response/create`,
          {
            complaint_id: complaintId,
            message: responseForm.message
          },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // UPDATE response - needs both complaint_id and response_id
        if (!selectedResponse?.id) {
          throw new Error('Response ID is required for update');
        }

        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint-response/update/${complaintId}/${selectedResponse.id}`,
          {
            message: responseForm.message
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

      await fetchComplaintDetails();
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowResponseModal(false);
        setResponseForm({ message: '' });
        setResponseSuccess('');
        setResponseAction('create');
        setSelectedResponse(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error saving response:', error);
      setResponseError(error.response?.data?.message || error.message || 'Failed to save response');
    } finally {
      setResponseLoading(false);
    }
  };

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

  const goBack = () => {
    // Navigate back to the complaints list
    navigate(`/${tenantSlug}/properties/tenant-complaints`);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Loading complaint details...</h5>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <IconifyIcon icon="bx:error-circle" className="me-2" />
          {error}
        </Alert>
        <Button variant="primary" onClick={goBack} className="mt-3">
          <IconifyIcon icon="bx:arrow-back" className="me-2" />
          Back to Complaints
        </Button>
      </Container>
    );
  }

  if (!complaint) {
    return (
      <Container>
        <Alert variant="warning">
          <IconifyIcon icon="bx:error" className="me-2" />
          Complaint not found
        </Alert>
        <Button variant="primary" onClick={goBack} className="mt-3">
          <IconifyIcon icon="bx:arrow-back" className="me-2" />
          Back to Complaints
        </Button>
      </Container>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Properties" 
        title="Tenant Complaints"
        items={[
          { 
            label: 'Tenant Complaints', 
            link: `/${tenantSlug}/properties/tenant-complaints` 
          },
          { 
            label: `Complaint #${complaint.id}`, 
            active: true 
          }
        ]}
      />
      <PageMetaData title={`Complaint #${complaint.id} - ${complaint.title}`} />
      
      <Container>
        {/* Header with Back Button */}
        <div className="mb-4">
          <Button variant="light" onClick={goBack} className="mb-3">
            <IconifyIcon icon="bx:arrow-back" className="me-2" />
            Back to Complaints List
          </Button>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Complaint #{complaint.id}</h2>
              <p className="text-muted mb-0">{complaint.title}</p>
            </div>
            <div className="d-flex gap-2">
              <Badge 
                bg={getStatusVariant(complaint.status)} 
                className="fs-6 px-3 py-2"
              >
                {getDisplayValue(complaint.status)}
              </Badge>
              <Badge 
                bg={getPriorityVariant(complaint.priority)} 
                className="px-3 py-2"
              >
                <IconifyIcon icon="bx:flag" className="me-1" />
                {getDisplayValue(complaint.priority)} Priority
              </Badge>
            </div>
          </div>
        </div>

        {/* Success Alert for Responses */}
        {responseSuccess && (
          <Alert variant="success" className="mb-4" onClose={() => setResponseSuccess('')} dismissible>
            <IconifyIcon icon="bx:check-circle" className="me-2" />
            {responseSuccess}
          </Alert>
        )}

        {/* Main Content */}
        <Row className="g-4">
          {/* Left Column - Complaint Details */}
          <Col lg={8}>
            {/* Complaint Information Card */}
            <Card className="border mb-4">
              <Card.Header className="bg-light py-3">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:info-circle" className="me-2 text-primary" />
                  Complaint Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Title</label>
                      <p className="mb-0 fw-semibold fs-5">{complaint.title}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Category</label>
                      <p className="mb-0 fw-semibold fs-5">{complaint.category || 'General'}</p>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Description</label>
                      <div className="bg-light bg-opacity-25 p-3 rounded">
                        <p className="mb-0 fs-6">{complaint.description}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Resolution Notes</label>
                      <div className={`p-3 rounded ${complaint.resolution_notes ? 'bg-light bg-opacity-25' : 'bg-light'}`}>
                        <p className="mb-0">
                          {getDisplayValue(complaint.resolution_notes, 'No resolution notes provided')}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Responses Section */}
            <Card className="border">
              <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:message-detail" className="me-2 text-primary" />
                  Responses ({complaint.complaint_responses?.length || 0})
                </h5>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={handleCreateResponse}
                  className="px-3"
                >
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add Response
                </Button>
              </Card.Header>
              <Card.Body>
                {complaint.complaint_responses && complaint.complaint_responses.length > 0 ? (
                  <div className="responses-timeline">
                    {complaint.complaint_responses
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((response, index, array) => (
                        <div 
                          key={response.id} 
                          className={`response-item ${index < array.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}`}
                        >
                          <div className="d-flex">
                            {/* Timeline indicator */}
                            <div className="timeline-indicator me-3 position-relative">
                              <div className="avatar-sm rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                                <IconifyIcon icon="bx:message" className="text-primary fs-16" />
                              </div>
                            </div>
                            
                            {/* Response content */}
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-0 fw-semibold">Response #{array.length - index}</h6>
                                  <small className="text-muted">
                                    {formatDateTime(response.created_at)}
                                  </small>
                                </div>
                                <div className="d-flex gap-2">
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => handleEditResponse(response)}
                                    title="Edit Response"
                                    disabled={responseLoading}
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
                                    {responseLoading && selectedResponse?.id === response.id ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <IconifyIcon icon="bx:trash" className="fs-14" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="response-content bg-light bg-opacity-25 p-3 rounded mb-2">
                                <p className="mb-0">{response.message}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="avatar-xl mx-auto mb-3">
                      <div className="avatar-title bg-light rounded-circle">
                        <IconifyIcon icon="bx:message-detail" className="text-muted fs-1" />
                      </div>
                    </div>
                    <h5 className="text-muted mb-3">No responses yet</h5>
                    <p className="text-muted mb-4">Be the first to respond to this complaint</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Timeline Card */}
              <Card className="border mb-4">
                <Card.Header className="bg-light py-3">
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:time-five" className="me-2 text-primary" />
                    Timeline
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3">
                        <IconifyIcon icon="bx:calendar-plus" className="text-primary" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold">Created</p>
                        <small className="text-muted">
                          {formatDate(complaint.created_at)}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center me-3">
                        <IconifyIcon icon="bx:refresh" className="text-warning" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold">Last Updated</p>
                        <small className="text-muted">
                          {formatDate(complaint.updated_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Apartment Information */}
              {complaint.apartment && (
                <Card className="border">
                  <Card.Header className="bg-light py-3">
                    <h5 className="mb-0">
                      <IconifyIcon icon="bx:building" className="me-2 text-primary" />
                      Apartment Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center">
                        <IconifyIcon icon="bx:hash" className="text-muted me-3" />
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-semibold">Unit Number</p>
                          <small className="text-muted">{complaint.apartment.number_item}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <IconifyIcon icon="bx:map" className="text-muted me-3" />
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-semibold">Location</p>
                          <small className="text-muted">{complaint.apartment.location}</small>
                        </div>
                      </div>
                      {complaint.apartment.address && (
                        <div className="d-flex align-items-center">
                          <IconifyIcon icon="bx:map-pin" className="text-muted me-3" />
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-semibold">Address</p>
                            <small className="text-muted">{complaint.apartment.address}</small>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Actions Card */}
              <Card className="border">
                <Card.Header className="bg-light py-3">
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:menu" className="me-2 text-primary" />
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary"
                      onClick={handleCreateResponse}
                      disabled={showResponseModal}
                    >
                      <IconifyIcon icon="bx:message-add" className="me-2" />
                      Add Response
                    </Button>
                    <Button 
                      as={Link}
                      to={`/${tenantSlug}/properties/tenant-complaints`}
                      variant="light"
                    >
                      <IconifyIcon icon="bx:list-ul" className="me-2" />
                      View All Complaints
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Response Modal (Popup) */}
      <ResponseModal 
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        onSubmit={handleResponseSubmit}
        formData={responseForm}
        onFormChange={(value) => setResponseForm({ message: value })}
        action={responseAction}
        loading={responseLoading}
        error={responseError}
        success={responseSuccess}
      />
    </>
  );
};

// Separate Response Modal Component
const ResponseModal = ({ 
  show, 
  onHide, 
  onSubmit, 
  formData, 
  onFormChange, 
  action, 
  loading, 
  error, 
  success 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {action === 'create' ? 'Add Response' : 'Edit Response'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => onHide()} dismissible>
              <IconifyIcon icon="bx:error-circle" className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <IconifyIcon icon="bx:check-circle" className="me-2" />
              {success}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={formData.message}
              onChange={(e) => onFormChange(e.target.value)}
              placeholder="Type your response message here..."
              required
              disabled={loading || success}
              autoFocus
            />
            <Form.Text className="text-muted">
              Your response will be visible to the tenant.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !formData.message.trim() || success}
            className="px-4"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {action === 'create' ? 'Saving...' : 'Updating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:save" className="me-1" />
                {action === 'create' ? 'Save Response' : 'Update Response'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ComplaintDetailsPage;