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

const MaintenanceDetailsPage = () => {
  const { maintenanceId, tenantSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [maintenance, setMaintenance] = useState(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Response modal states
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState('create');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseForm, setResponseForm] = useState({
    technician_id: '',
    log_message: '',
    status_update: '',
    visit_date: '',
    next_expected_visit_date: ''
  });
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState('');

  // Technicians list state
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  useEffect(() => {
    if (maintenanceId && tenantSlug && user?.token) {
      fetchMaintenanceDetails();
      fetchTechnicians();
    }
  }, [maintenanceId, tenantSlug, user]);

  useEffect(() => {
    // Update status_update when maintenance data is loaded
    if (maintenance) {
      setResponseForm(prev => ({
        ...prev,
        status_update: maintenance.maintenance_status || 'open'
      }));
    }
  }, [maintenance]);

  const fetchMaintenanceDetails = async () => {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view/${maintenanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract data based on your API structure
      const maintenanceData = response.data?.maintenance;
      const logsData = response.data?.logs?.data || [];
      
      if (!maintenanceData) {
        throw new Error('No maintenance data received from API');
      }
      
      setMaintenance(maintenanceData);
      setMaintenanceLogs(logsData);
      
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch maintenance details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    setLoadingTechnicians(true);
    
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-technicians`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract technicians data from API response
      let techniciansData = [];
      
      if (Array.isArray(response.data?.data)) {
        techniciansData = response.data.data;
      } else if (Array.isArray(response.data)) {
        techniciansData = response.data;
      }
      
      setTechnicians(techniciansData);
      
    } catch (error) {
      console.error('Error fetching technicians:', error);
      // Don't set error state here, just log it
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // Response Management Functions
  const handleCreateResponse = () => {
    setResponseAction('create');
    setSelectedResponse(null);
    setResponseForm({
      technician_id: '',
      log_message: '',
      status_update: maintenance?.maintenance_status || 'open',
      visit_date: '',
      next_expected_visit_date: ''
    });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleEditResponse = (log) => {
    setResponseAction('edit');
    setSelectedResponse(log);
    setResponseForm({
      technician_id: log.technician_id || '',
      log_message: log.log_message || log.message || log.comment || '',
      status_update: log.status_update || maintenance?.maintenance_status || 'open',
      visit_date: log.visit_date || '',
      next_expected_visit_date: log.next_expected_visit_date || ''
    });
    setResponseError(null);
    setResponseSuccess('');
    setShowResponseModal(true);
  };

  const handleDeleteResponse = async (logId) => {
    if (!logId) return;

    if (!window.confirm('Are you sure you want to delete this log entry?')) {
      return;
    }

    setResponseLoading(true);
    setResponseError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      // DELETE maintenance log
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance-log/delete/${logId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponseSuccess('Log entry deleted successfully!');
      await fetchMaintenanceDetails();
      
      setTimeout(() => {
        setResponseSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting log entry:', error);
      setResponseError(error.response?.data?.message || error.message || 'Failed to delete log entry');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    
    if (!responseForm.log_message.trim()) {
      setResponseError('Log message is required');
      return;
    }

    setResponseLoading(true);
    setResponseError(null);

    try {
      let response;

      if (responseAction === 'create') {

        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance-log/create/${maintenanceId}`,
          {
            technician_id: responseForm.technician_id ? parseInt(responseForm.technician_id) : null,
            log_message: responseForm.log_message,
            status_update: responseForm.status_update,
            visit_date: responseForm.visit_date || null,
            next_expected_visit_date: responseForm.next_expected_visit_date || null
          },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // UPDATE maintenance log - using just logId
        if (!selectedResponse?.id) {
          throw new Error('Log ID is required for update');
        }

        const logId = selectedResponse.id || selectedResponse.log_id;

        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance-log/update/${logId}`,
          {
            technician_id: responseForm.technician_id ? parseInt(responseForm.technician_id) : null,
            log_message: responseForm.log_message,
            status_update: responseForm.status_update,
            visit_date: responseForm.visit_date || null,
            next_expected_visit_date: responseForm.next_expected_visit_date || null
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
          ? 'Log entry created successfully!' 
          : 'Log entry updated successfully!'
      );

      // IMPORTANT: Refresh maintenance details to get updated status
      await fetchMaintenanceDetails();
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowResponseModal(false);
        setResponseForm({
          technician_id: '',
          log_message: '',
          status_update: maintenance?.maintenance_status || 'open',
          visit_date: '',
          next_expected_visit_date: ''
        });
        setResponseSuccess('');
        setResponseAction('create');
        setSelectedResponse(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error saving log entry:', error);
      console.error('Error response:', error.response?.data);
      setResponseError(error.response?.data?.message || error.message || 'Failed to save log entry');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setResponseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions
  const getStatusVariant = (status) => {
    if (!status) return 'light';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
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
    
    const priorityLower = priority.toLowerCase();
    switch (priorityLower) {
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

  const getDisplayValue = (value, fallback = 'N/A') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return value;
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const goBack = () => {
    navigate(`/${tenantSlug}/properties/tenant-maintenance`);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Loading maintenance details...</h5>
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
          Back to Maintenance
        </Button>
      </Container>
    );
  }

  if (!maintenance) {
    return (
      <Container>
        <Alert variant="warning">
          <IconifyIcon icon="bx:error" className="me-2" />
          Maintenance request not found
        </Alert>
        <Button variant="primary" onClick={goBack} className="mt-3">
          <IconifyIcon icon="bx:arrow-back" className="me-2" />
          Back to Maintenance
        </Button>
      </Container>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Properties" 
        title="Maintenance"
        items={[
          { 
            label: 'Maintenance', 
            link: `/${tenantSlug}/properties/tenant-maintenance` 
          },
          { 
            label: `Maintenance #${maintenance.maintenance_id}`, 
            active: true 
          }
        ]}
      />
      <PageMetaData title={`Maintenance #${maintenance.maintenance_id}`} />
      
      <Container>
        {/* Header with Back Button */}
        <div className="mb-4">
          <Button variant="light" onClick={goBack} className="mb-3">
            <IconifyIcon icon="bx:arrow-back" className="me-2" />
            Back to Maintenance List
          </Button>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Maintenance #{maintenance.maintenance_id}</h2>
              <p className="text-muted mb-0">{getDisplayValue(maintenance.maintenance_title)}</p>
            </div>
            <div className="d-flex gap-2">
              <Badge 
                bg={getStatusVariant(maintenance.maintenance_status)} 
                className="fs-6 px-3 py-2"
              >
                {formatStatus(maintenance.maintenance_status)}
              </Badge>
              <Badge 
                bg={getPriorityVariant(maintenance.maintenance_priority)} 
                className="px-3 py-2"
              >
                <IconifyIcon icon="bx:flag" className="me-1" />
                {getDisplayValue(maintenance.maintenance_priority)} Priority
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
          {/* Left Column - Maintenance Details */}
          <Col lg={8}>
            {/* Maintenance Information Card */}
            <Card className="border mb-4">
              <Card.Header className="bg-light py-3">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:info-circle" className="me-2 text-primary" />
                  Maintenance Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Title</label>
                      <p className="mb-0 fw-semibold fs-5">
                        {getDisplayValue(maintenance.maintenance_title)}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Priority</label>
                      <p className="mb-0 fw-semibold fs-5 text-capitalize">
                        {getDisplayValue(maintenance.maintenance_priority)}
                      </p>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Description</label>
                      <div className="bg-light bg-opacity-25 p-3 rounded">
                        <p className="mb-0 fs-6">
                          {getDisplayValue(maintenance.maintenance_description)}
                        </p>
                      </div>
                    </div>
                  </Col>
                  {maintenance.maintenance_expected_visit_date && (
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Expected Visit Date</label>
                        <p className="mb-0 fw-semibold">
                          {formatDate(maintenance.maintenance_expected_visit_date)}
                        </p>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>

            {/* Tenant Information Card */}
            <Card className="border mb-4">
              <Card.Header className="bg-light py-3">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:user" className="me-2 text-primary" />
                  Tenant Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Tenant Name</label>
                      <p className="mb-0 fw-semibold">
                        {getDisplayValue(maintenance.tenant_first_name)} {getDisplayValue(maintenance.tenant_last_name)}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Tenant ID</label>
                      <p className="mb-0 fw-semibold">
                        #{getDisplayValue(maintenance.tenant_id)}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Location Information Card */}
            <Card className="border mb-4">
              <Card.Header className="bg-light py-3">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:map-pin" className="me-2 text-primary" />
                  Location Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12}>
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Apartment Address</label>
                      <p className="mb-0 fw-semibold">
                        {getDisplayValue(maintenance.apartment_address)}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Activity Logs Section */}
            <Card className="border">
              <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <IconifyIcon icon="bx:message-detail" className="me-2 text-primary" />
                  Activity Logs ({maintenanceLogs.length})
                </h5>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={handleCreateResponse}
                  className="px-3"
                >
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add Log Entry
                </Button>
              </Card.Header>
              <Card.Body>
                {maintenanceLogs.length > 0 ? (
                  <div className="responses-timeline">
                    {maintenanceLogs
                      .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
                      .map((log, index, array) => (
                        <div 
                          key={log.id || log.log_id || index} 
                          className={`response-item ${index < array.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}`}
                        >
                          <div className="d-flex">
                            {/* Timeline indicator */}
                            <div className="timeline-indicator me-3 position-relative">
                              <div className="avatar-sm rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                                <IconifyIcon icon="bx:message" className="text-primary fs-16" />
                              </div>
                            </div>
                            
                            {/* Log content */}
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-0 fw-semibold">Log #{array.length - index}</h6>
                                  <small className="text-muted">
                                    {formatDateTime(log.created_at || log.date || log.timestamp)}
                                  </small>
                                  {log.technician_name && (
                                    <div className="mt-1">
                                      <Badge bg="info" className="text-capitalize">
                                        <IconifyIcon icon="bx:user" className="me-1" />
                                        {log.technician_name}
                                      </Badge>
                                    </div>
                                  )}
                                  {log.status_update && (
                                    <div className="mt-1">
                                      <Badge bg={getStatusVariant(log.status_update)} className="text-capitalize">
                                        Status: {formatStatus(log.status_update)}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="d-flex gap-2">
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => handleEditResponse(log)}
                                    title="Edit Log Entry"
                                    disabled={responseLoading}
                                  >
                                    <IconifyIcon icon="bx:edit" className="fs-14" />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeleteResponse(log.id || log.log_id)}
                                    disabled={responseLoading}
                                    title="Delete Log Entry"
                                  >
                                    {responseLoading && selectedResponse?.id === log.id ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <IconifyIcon icon="bx:trash" className="fs-14" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="response-content bg-light bg-opacity-25 p-3 rounded mb-2">
                                <p className="mb-0">
                                  {log.log_message || log.message || log.comment || log.action || 'No message provided'}
                                </p>
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
                    <h5 className="text-muted mb-3">No activity logs yet</h5>
                    <p className="text-muted mb-4">Be the first to add a log entry to this maintenance request</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Status Card */}
              <Card className="border mb-4">
                <Card.Header className="bg-light py-3">
                  <h5 className="mb-0">
                    <IconifyIcon icon="bx:info-circle" className="me-2 text-primary" />
                    Maintenance Status
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column align-items-center">
                    <Badge 
                      bg={getStatusVariant(maintenance.maintenance_status)} 
                      className="fs-5 px-4 py-2 mb-2"
                    >
                      {formatStatus(maintenance.maintenance_status)}
                    </Badge>
                    <p className="text-muted text-center mb-0">
                      Current status of the maintenance request
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Attachment Card */}
              {maintenance.maintenance_attachment && (
                <Card className="border mb-4">
                  <Card.Header className="bg-light py-3">
                    <h5 className="mb-0">
                      <IconifyIcon icon="bx:paperclip" className="me-2 text-primary" />
                      Attachments
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between p-3 bg-white border rounded">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3">
                          <IconifyIcon icon="bx:file" className="text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold">Maintenance Attachment</p>
                          <small className="text-muted">Click to view/download</small>
                        </div>
                      </div>
                      <Button 
                        variant="outline-primary"
                        onClick={() => window.open(maintenance.maintenance_attachment, '_blank')}
                        size="sm"
                      >
                        <IconifyIcon icon="bx:download" className="me-2" />
                        View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Quick Actions Card */}
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
                      Add Log Entry
                    </Button>
                    <Button 
                      as={Link}
                      to={`/${tenantSlug}/properties/tenant-maintenance`}
                      variant="light"
                    >
                      <IconifyIcon icon="bx:list-ul" className="me-2" />
                      View All Maintenance
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
        onFormChange={handleFormChange}
        action={responseAction}
        loading={responseLoading}
        error={responseError}
        success={responseSuccess}
        technicians={technicians}
        loadingTechnicians={loadingTechnicians}
        currentStatus={maintenance?.maintenance_status}
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
  success,
  technicians,
  loadingTechnicians,
  currentStatus = 'open'
}) => {
  // Calculate today's date in YYYY-MM-DD format for date inputs
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate tomorrow's date for next_expected_visit_date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // Set default status_update to current status
  useEffect(() => {
    if (formData.status_update === '' && currentStatus) {
      onFormChange('status_update', currentStatus);
    }
  }, [currentStatus, formData.status_update, onFormChange]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {action === 'create' ? 'Add Maintenance Log Entry' : 'Edit Maintenance Log Entry'}
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

          <Row className="g-3">
            {/* Technician Selection */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Technician <span className="text-muted">(Optional)</span></Form.Label>
                {loadingTechnicians ? (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading technicians...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={formData.technician_id}
                    onChange={(e) => onFormChange('technician_id', e.target.value)}
                    disabled={loading || success}
                  >
                    <option value="">Select a technician</option>
                    {technicians.map(tech => (
                      <option key={tech.id || tech.technician_id} value={tech.id || tech.technician_id}>
                        {tech.name || `${tech.first_name || ''} ${tech.last_name || ''}`.trim() || `Technician #${tech.id}`}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Text className="text-muted">
                  Assign this log entry to a technician
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Status Update */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status Update</Form.Label>
                <Form.Select
                  value={formData.status_update || currentStatus}
                  onChange={(e) => onFormChange('status_update', e.target.value)}
                  required
                  disabled={loading || success}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Update the maintenance request status
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Visit Date */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Visit Date <span className="text-muted">(Optional)</span></Form.Label>
                <Form.Control
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) => onFormChange('visit_date', e.target.value)}
                  min={today}
                  disabled={loading || success}
                />
                <Form.Text className="text-muted">
                  Date of technician's visit
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Next Expected Visit Date */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Next Expected Visit Date <span className="text-muted">(Optional)</span></Form.Label>
                <Form.Control
                  type="date"
                  value={formData.next_expected_visit_date}
                  onChange={(e) => onFormChange('next_expected_visit_date', e.target.value)}
                  min={tomorrowFormatted}
                  disabled={loading || success}
                />
                <Form.Text className="text-muted">
                  Date for next expected visit
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Log Message */}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Log Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.log_message}
                  onChange={(e) => onFormChange('log_message', e.target.value)}
                  placeholder="Enter details about the maintenance work, findings, or updates..."
                  required
                  disabled={loading || success}
                  autoFocus
                />
                <Form.Text className="text-muted">
                  Describe what was done or any important information about the maintenance
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !formData.log_message.trim() || success}
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
                {action === 'create' ? 'Save Log Entry' : 'Update Log Entry'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MaintenanceDetailsPage;