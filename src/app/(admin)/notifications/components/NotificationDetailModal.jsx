import { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const NotificationDetailModal = ({ 
  show, 
  handleClose, 
  notification,
  tenantSlug,
  userType
}) => {
  const { user } = useAuthContext();
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotificationDetails = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.token || !tenantSlug || !notificationId) {
        throw new Error('Missing required information');
      }

      let endpoint = '';
      if (userType === 'landlord') {
        
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/notification/show/${notificationId}`;
      } else {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/notification/show/${notificationId}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setNotificationDetails(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch notification details');
      setLoading(false);
      console.error('Error fetching notification details:', err);
    }
  };

  useEffect(() => {
    if (show && notification?.id) {
      fetchNotificationDetails(notification.id);
    } else {
      setNotificationDetails(null);
    }
    
    return () => {
      setNotificationDetails(null);
      setError(null);
    };
  }, [show, notification]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'maintenance':
        return 'bx:wrench';
      case 'complaint':
        return 'bx:message-alt-error';
      default:
        return 'bx:bell';
    }
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'open':
        return 'danger';
      case 'in_progress':
      case 'pending':
        return 'warning';
      case 'resolved':
      case 'closed':
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    if (!priority) return 'secondary';
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const renderMaintenanceDetails = () => {
    if (!notificationDetails?.maintenance) return null;
    
    const maintenance = notificationDetails.maintenance;
    
    return (
      <div className="mb-3">
        <strong>Maintenance Details:</strong>
        <div className="mt-2 p-3 bg-light rounded">
          <div className="mb-2">
            <strong>Title:</strong> {maintenance.title || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Description:</strong> {maintenance.description || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Status:</strong>{' '}
            <Badge bg={getStatusBadgeColor(maintenance.status)}>
              {maintenance.status?.toUpperCase() || 'N/A'}
            </Badge>
          </div>
          <div className="mb-2">
            <strong>Priority:</strong>{' '}
            <Badge bg={getPriorityBadgeColor(maintenance.priority)}>
              {maintenance.priority?.toUpperCase() || 'N/A'}
            </Badge>
          </div>
          {maintenance.attachment && (
            <div className="mb-2">
              <strong>Attachment:</strong> {maintenance.attachment}
            </div>
          )}
          {maintenance.expected_visit_date && (
            <div className="mb-2">
              <strong>Expected Visit Date:</strong> {formatDate(maintenance.expected_visit_date)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderComplaintDetails = () => {
    if (!notificationDetails?.complain) return null;
    
    const complain = notificationDetails.complain;
    
    return (
      <div className="mb-3">
        <strong>Complaint Details:</strong>
        <div className="mt-2 p-3 bg-light rounded">
          <div className="mb-2">
            <strong>Title:</strong> {complain.title || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Description:</strong> {complain.description || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Status:</strong>{' '}
            <Badge bg={getStatusBadgeColor(complain.status)}>
              {complain.status?.toUpperCase() || 'N/A'}
            </Badge>
          </div>
          <div className="mb-2">
            <strong>Priority:</strong>{' '}
            <Badge bg={getPriorityBadgeColor(complain.priority)}>
              {complain.priority?.toUpperCase() || 'N/A'}
            </Badge>
          </div>
          {complain.evidence && (
            <div className="mb-2">
              <strong>Evidence:</strong> {complain.evidence}
            </div>
          )}
          {complain.resolution_notes && (
            <div className="mb-2">
              <strong>Resolution Notes:</strong> {complain.resolution_notes}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApartmentDetails = () => {
    if (!notificationDetails?.apartment) return null;
    
    return (
      <div className="mb-3">
        <strong>Property Information:</strong>
        <div className="mt-2 p-3 bg-light rounded">
          <div className="mb-2">
            <strong>Location:</strong> {notificationDetails.apartment.location || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Address:</strong> {notificationDetails.apartment.address || 'N/A'}
          </div>
          {notificationDetails.apartment_unit && (
            <div className="mb-2">
              <strong>Unit:</strong> {notificationDetails.apartment_unit.name || 'N/A'}
            </div>
          )}
        </div>
      </div>
    );
  };

  

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon 
            icon={getNotificationIcon(notificationDetails?.type)} 
            className="me-2"
          />
          Notification Details
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading notification details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
          </Alert>
        ) : notificationDetails ? (
          <div className="notification-details">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="mb-1">
                  {notificationDetails.data?.message || 
                   (notificationDetails.type === 'complaint' ? 'Complaint Notification' : 
                    notificationDetails.type === 'maintenance' ? 'Maintenance Notification' : 
                    'Notification')}
                </h5>
                <small className="text-muted">
                  ID: {notificationDetails.id} • Created: {formatDate(notificationDetails.created_at)}
                </small>
              </div>
              <div>
                <span className={`badge ${notificationDetails.is_read === 'yes' ? 'bg-success' : 'bg-danger'}`}>
                  {notificationDetails.is_read === 'yes' ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <strong>Type:</strong>{' '}
              <span className={`badge ${
                notificationDetails.type === 'complaint' ? 'bg-warning' : 
                notificationDetails.type === 'maintenance' ? 'bg-info' : 
                'bg-secondary'
              }`}>
                {notificationDetails.type?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            
            {renderApartmentDetails()}
            
            {notificationDetails.type === 'maintenance' && renderMaintenanceDetails()}
            {notificationDetails.type === 'complaint' && renderComplaintDetails()}
            
            
          </div>
        ) : (
          <div className="alert alert-warning">No notification details available</div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationDetailModal;