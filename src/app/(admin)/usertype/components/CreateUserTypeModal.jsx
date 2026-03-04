import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateUserTypeModal = ({ 
  show, 
  handleClose, 
  refreshUserTypes,
  editMode = false,
  userTypeToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    admin_management: false,
    user_management: false,
    complaint_management: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && userTypeToEdit) {
      setFormData({
        name: userTypeToEdit.name || '',
        admin_management: userTypeToEdit.admin_management === 'yes' || userTypeToEdit.admin_management === true,
        user_management: userTypeToEdit.user_management === 'yes' || userTypeToEdit.user_management === true,
        complaint_management: userTypeToEdit.complaint_management === 'yes' || userTypeToEdit.complaint_management === true
      });
    } else {
      setFormData({
        name: '',
        admin_management: false,
        user_management: false,
        complaint_management: false
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, userTypeToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // if (!tenantSlug) {
      //   throw new Error('Tenant slug not found');
      // }
      
      const payload = {
        name: formData.name,
        admin_management: formData.admin_management ? 'yes' : 'no',
        user_management: formData.user_management ? 'yes' : 'no',
        complaint_management: formData.complaint_management ? 'yes' : 'no'
      };

      if (editMode && userTypeToEdit) {
        // Update user type
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/user-type/update/${userTypeToEdit.id}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new user type
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/user-type/create`,
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
      refreshUserTypes();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update user type' : 'Failed to create user type'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit User Type' : 'Create New User Type'}
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
              {editMode ? 'User type updated successfully!' : 'User type created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>User Type Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter user type name (e.g., Super Admin, Manager)"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Admin Management"
                  name="admin_management"
                  checked={formData.admin_management}
                  onChange={handleChange}
                  helpText="Can manage administrator accounts and permissions"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="User Management"
                  name="user_management"
                  checked={formData.user_management}
                  onChange={handleChange}
                  helpText="Can manage regular user accounts"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Complaint Management"
                  name="complaint_management"
                  checked={formData.complaint_management}
                  onChange={handleChange}
                  helpText="Can manage and resolve user complaints"
                />
              </Form.Group>
            </Col>
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
                {editMode ? 'Save Changes' : 'Create User Type'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUserTypeModal;