import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateAgentsModal = ({ 
  show, 
  handleClose, 
  refreshAgents,
  userTypes = [],
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Ensure userTypes is always an array
  const safeUserTypes = Array.isArray(userTypes) ? userTypes : [];

  useEffect(() => {
    // Reset form when modal opens
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      user_type: ''
    });
    setError(null);
    setSuccess(false);
  }, [show]);

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
      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.phone || !formData.user_type) {
        throw new Error('Please fill in all required fields');
      }

      // Validate user_type exists in userTypes
      if (!safeUserTypes.find(type => type.id == formData.user_type)) {
        throw new Error('Please select a valid user type');
      }

      // Validate email format if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone number format
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
        throw new Error('Please enter a valid phone number (10-15 digits)');
      }

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim() || null,
        phone: cleanedPhone,
        user_type: formData.user_type
      };

      console.log('Creating agent with payload:', payload);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/create`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Agent creation response:', response.data);

      setSuccess(true);
      refreshAgents();
      
      // Clear form on success
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        user_type: ''
      });
      
      // Close modal after delay
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating agent:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create agent';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Create New Agent
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
              Agent created successfully!
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                <Form.Text className="text-muted">
                  Optional
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>User Type *</Form.Label>
                <Form.Select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select user type</option>
                  {safeUserTypes.map((userType) => (
                    <option key={userType.id} value={userType.id}>
                      {userType.name || `User Type ${userType.id}`}
                    </option>
                  ))}
                </Form.Select>
                {safeUserTypes.length === 0 && (
                  <Form.Text className="text-warning">
                    No user types available. Please make sure user types are configured.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading || safeUserTypes.length === 0}>
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                Creating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bi:plus" className="me-1" />
                Create Agent
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateAgentsModal;