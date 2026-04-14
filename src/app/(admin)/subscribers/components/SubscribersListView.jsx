import { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const getStatusBadge = (status) => {
  switch(status?.toLowerCase()) {
    case 'active':
      return <Badge bg="success">Active</Badge>;
    case 'inactive':
      return <Badge bg="danger">Inactive</Badge>;
    case 'pending':
      return <Badge bg="warning">Pending</Badge>;
    case 'cancelled':
      return <Badge bg="danger">Cancelled</Badge>;
    case 'suspended':
      return <Badge bg="warning">Suspended</Badge>;
    default:
      return <Badge bg="secondary">{status || 'N/A'}</Badge>;
  }
};

const SubscribersListView = ({ subscribers, refreshSubscribers }) => {
  const { user } = useAuthContext();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleStatusChangeClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setNewStatus(subscriber.account_status || 'active');
    setShowStatusModal(true);
    setError(null);
    setSuccess(false);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      // Use subscription_tracker_id or fallback to account_id
      const subscriptionId = selectedSubscriber.subscription_tracker_id;
      
      if (!subscriptionId) {
        throw new Error('Subscription ID not found');
      }

      const payload = {
        subscription_tracker_id: parseInt(subscriptionId),
        status: newStatus
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/alter`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setSuccess(true);
      
      // Refresh the subscribers list
      refreshSubscribers();
      
      // Close modal after success
      setTimeout(() => {
        setShowStatusModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating subscription status:', err);
      
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(err.message || 'Failed to update subscription status');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden mt-3">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>S/N</th>
                <th>Estate Name</th>
                <th>Plan Name</th>
                <th>Fee</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber.account_id || index}>
                  <td>
                    <span className="fw-semibold">{index + 1}</span>
                  </td>
                  <td>
                    <span className="fw-semibold">{subscriber.estate_name || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="fw-semibold">{subscriber.name || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-success">
                      ₦{parseFloat(subscriber.fee || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </td>
                  <td>
                    {subscriber.discount && parseFloat(subscriber.discount) > 0 ? (
                      <span className="badge bg-warning">{subscriber.discount}%</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {getStatusBadge(subscriber.account_status)}
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleStatusChangeClick(subscriber)}
                      title="Change Subscription Status"
                    >
                      <IconifyIcon icon="bx:edit" />
                      <span className="ms-1">Change Status</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Status Change Modal */}
      <Modal show={showStatusModal} onHide={() => !loading && setShowStatusModal(false)} centered>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>
            <IconifyIcon icon="bx:edit" className="me-2" />
            Change Subscription Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <Alert.Heading>Success!</Alert.Heading>
              <p>Subscription status has been updated successfully.</p>
            </Alert>
          )}
          
          {!success && selectedSubscriber && (
            <>
              <div className="mb-3">
                <strong>Estate:</strong> {selectedSubscriber.estate_name}
              </div>
              <div className="mb-3">
                <strong>Plan:</strong> {selectedSubscriber.name}
              </div>
              <div className="mb-3">
                <strong>Current Status:</strong>{' '}
                {getStatusBadge(selectedSubscriber.account_status)}
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>New Status *</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  <small>
                    • Active - Subscription is active and user has full access<br/>
                    • Suspended - Temporarily disabled, can be reactivated<br/>
                    • Cancelled - Permanently terminated
                  </small>
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowStatusModal(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          {!success && (
            <Button 
              variant="primary" 
              onClick={handleStatusUpdate}
              disabled={loading || !newStatus}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Updating...
                </>
              ) : (
                <>
                  <IconifyIcon icon="bx:save" className="me-1" />
                  Update Status
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubscribersListView;



