import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SubscriptionPlansListView from './SubscriptionPlansListView';
import CreateSubscriptionPlanModal from './CreateSubscriptionPlanModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const SubscriptionPlansList = ({ plans, refreshPlans }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure plans is always an array
  const plansArray = Array.isArray(plans) ? plans : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedPlan(null);
    setShowModal(true);
  };

  const handleEditClick = (plan) => {
    setEditMode(true);
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
    // Clear any previous errors when opening delete modal
    setError(null);
    setSuccess(false);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if user and token exist
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!user.token) {
        throw new Error('Authentication token not found');
      }

      // Make sure we're using the correct ID field
      const planId = selectedPlan.id || selectedPlan.uuid;
      
      if (!planId) {
        throw new Error('Plan ID not found');
      }

      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/plan/delete/${planId}`,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      setSuccess('Subscription plan deleted successfully!');
      refreshPlans();
      
      // Close modal after success
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          setError('Authentication failed. Please log out and log in again.');
        } else {
          setError(error.response.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message || 'Failed to delete subscription plan');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plansArray.filter(plan => 
    plan.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search plans..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Plan
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {plansArray.length > 0 ? (
        <SubscriptionPlansListView 
          plans={filteredPlans}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info">No subscription plans found</div>
      )}

      <CreateSubscriptionPlanModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshPlans={refreshPlans}
        editMode={editMode}
        planToEdit={selectedPlan}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              {error.includes('Authentication') && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => {
                    // Optionally redirect to login or refresh token
                    window.location.reload();
                  }}
                >
                  Refresh Page
                </Button>
              )}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <Alert.Heading>Success</Alert.Heading>
              <p>{success}</p>
            </Alert>
          )}
          
          {!success && !error && (
            <>
              <p>Are you sure you want to delete the <strong>{selectedPlan?.name}</strong> plan?</p>
              <p className="text-danger mb-0">
                <small>This action cannot be undone. All associated data will be permanently removed.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          {!success && (
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Deleting...
                </>
              ) : (
                <>
                  <IconifyIcon icon="bx:trash" className="me-1" />
                  Delete Plan
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubscriptionPlansList;