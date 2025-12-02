import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateRoleModal = ({ 
  show, 
  handleClose, 
  refreshRoles,
  editMode = false,
  roleToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    manage_properties: false,
    manage_accounts: false,
    manage_estate_manager: false,
    manage_admins: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && roleToEdit) {
      setFormData({
        name: roleToEdit.name,
        manage_properties: roleToEdit.manage_properties === 'yes',
        manage_accounts: roleToEdit.manage_accounts === 'yes',
        manage_estate_manager: roleToEdit.manage_estate_manager === 'yes',
        manage_admins: roleToEdit.manage_admins === 'yes'
      });
    } else {
      setFormData({
        name: '',
        manage_properties: false,
        manage_accounts: false,
        manage_estate_manager: false,
        manage_admins: false
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, roleToEdit]);

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
      const payload = {
        name: formData.name,
        manage_properties: formData.manage_properties ? 'yes' : 'no',
        manage_accounts: formData.manage_accounts ? 'yes' : 'no',
        manage_estate_manager: formData.manage_estate_manager ? 'yes' : 'no',
        manage_admins: formData.manage_admins ? 'yes' : 'no',
      };

      if (editMode && roleToEdit) {
        // Updated endpoint with role ID in URL
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/update-role/${roleToEdit.id}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/create-role`,
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
      refreshRoles();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update role' : 'Failed to create role'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Role' : 'Create New Role'}
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
              {editMode ? 'Role updated successfully!' : 'Role created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Manage Properties"
                  name="manage_properties"
                  checked={formData.manage_properties}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Manage Accounts"
                  name="manage_accounts"
                  checked={formData.manage_accounts}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Manage Estate Managers"
                  name="manage_estate_manager"
                  checked={formData.manage_tenants}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Manage Admins"
                  name="manage_admins"
                  checked={formData.manage_admins}
                  onChange={handleChange}
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
                {editMode ? 'Save Changes' : 'Create Role'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateRoleModal;