import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateSubscriptionPlanModal = ({ 
  show, 
  handleClose, 
  refreshPlans,
  editMode = false,
  planToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    number_of_staff: '',
    number_of_admins: '',
    number_of_agents: '',
    number_of_apartments: '',
    number_of_branches: '',
    number_of_locations: '',
    fee: '',
    discount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && planToEdit) {
      setFormData({
        name: planToEdit.name || '',
        number_of_staff: planToEdit.number_of_staff || '',
        number_of_admins: planToEdit.number_of_admins || planToEdit.number_of_admins || '',
        number_of_agents: planToEdit.number_of_agents || '',
        number_of_apartments: planToEdit.number_of_apartments || planToEdit.number_of_apartments || '',
        number_of_branches: planToEdit.number_of_branches || '',
        number_of_locations: planToEdit.number_of_locations || planToEdit.number_of_locations || '',
        fee: planToEdit.fee || '',
        discount: planToEdit.discount || ''
      });
    } else {
      setFormData({
        name: '',
        number_of_staff: '',
        number_of_admins: '',
        number_of_agents: '',
        number_of_apartments: '',
        number_of_branches: '',
        number_of_locations: '',
        fee: '',
        discount: ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, planToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare payload based on edit mode
      let payload;
      
      if (editMode && planToEdit) {
        payload = {
          name: formData.name,
          number_of_staff: parseInt(formData.number_of_staff) || 0,
          number_of_admins: parseInt(formData.number_of_admins) || 0,
          number_of_agents: parseInt(formData.number_of_agents) || 0,
          number_of_apartments: parseInt(formData.number_of_apartments) || 0,
          number_of_branches: parseInt(formData.number_of_branches) || 0,
          number_of_locations: parseInt(formData.number_of_locations) || 0,
          fee: parseFloat(formData.fee) || 0,
          discount: parseFloat(formData.discount) || 0
        };
      } else {
        payload = {
          name: formData.name,
          number_of_staff: parseInt(formData.number_of_staff) || 0,
          number_of_admins: parseInt(formData.number_of_admins) || 0,
          number_of_agents: parseInt(formData.number_of_agents) || 0,
          number_of_apartments: parseInt(formData.number_of_apartments) || 0,
          number_of_branches: parseInt(formData.number_of_branches) || 0,
          number_of_locations: parseInt(formData.number_of_locations) || 0,
          fee: parseFloat(formData.fee) || 0
        };
      }

      if (editMode && planToEdit) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/plan/update/${planToEdit.id}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/plan/create`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setSuccess(true);
      refreshPlans();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update subscription plan' : 'Failed to create subscription plan'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Subscription plan updated successfully!' : 'Subscription plan created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Plan Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter plan name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Staff *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_staff"
                  value={formData.number_of_staff}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of staff"
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Admins *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_admins"
                  value={formData.number_of_admins}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of admins"
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Agents *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_agents"
                  value={formData.number_of_agents}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of agents"
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Apartments *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_apartments"
                  value={formData.number_of_apartments}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of apartments"
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Branches *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_branches"
                  value={formData.number_of_branches}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of branches"
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Locations *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_of_locations"
                  value={formData.number_of_locations}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of locations"
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fee *</Form.Label>
                <Form.Control
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  required
                  placeholder="Enter fee amount"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            {editMode && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </Form.Group>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Plan'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateSubscriptionPlanModal;