import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateEstateManagersModal = ({ 
  show, 
  handleClose, 
  refreshManagers,
  editMode = false,
  managerId = null,
  managerToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    estate_name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to fetch manager details
  const fetchManagerDetails = async (id) => {
    if (!id) return;
    
    setFetching(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-estate-manager/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const manager = response.data.data || response.data;
      
      // In edit mode, we only care about estate_name
      // But we still fetch all data to populate form if needed
      setFormData({
        first_name: manager.first_name || '',
        last_name: manager.last_name || '',
        phone: manager.phone || '',
        estate_name: manager.estate_name || '',
        email: manager.email || ''
      });
      
    } catch (err) {
      setError('Failed to fetch manager details. Please try again.');
      console.error('Error fetching manager:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(false);
      
      if (editMode) {
        if (managerId) {
          fetchManagerDetails(managerId);
        } else if (managerToEdit) {
          setFormData({
            first_name: managerToEdit.first_name || '',
            last_name: managerToEdit.last_name || '',
            phone: managerToEdit.phone || '',
            estate_name: managerToEdit.estate_name || '',
            email: managerToEdit.email || ''
          });
        }
      } else {
        // Reset form for create mode
        setFormData({
          first_name: '',
          last_name: '',
          phone: '',
          estate_name: '',
          email: ''
        });
      }
    }
  }, [show, editMode, managerId, managerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // In edit mode, only allow changes to estate_name
    if (editMode && name !== 'estate_name') {
      return;
    }
    
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
      const payload = editMode 
        ? { estate_name: formData.estate_name } // Only send estate_name in edit mode
        : {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            estate_name: formData.estate_name,
            email: formData.email
          };

      if (editMode) {
        const idToUse = managerId || managerToEdit?.id;
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/update-estate-manager/${idToUse}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/create-estate-manager`,
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
      refreshManagers();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update estate manager' : 'Failed to create estate manager'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size={editMode ? "md" : "lg"}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Update Estate Name' : 'Create New Estate Manager'}
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
              {editMode ? 'Estate name updated successfully!' : 'Estate manager created successfully!'}
            </Alert>
          )}

          {fetching ? (
            <div className="text-center py-4">
              <IconifyIcon icon="eos-icons:loading" className="me-1" />
              Loading manager details...
            </div>
          ) : (
            <>
              {/* CREATE MODE: Show all form fields */}
              {!editMode && (
                <>
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
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              {/* Estate Name field - always shown for both create and edit */}
              <Form.Group className="mb-3">
                <Form.Label>Estate Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="estate_name"
                  value={formData.estate_name}
                  onChange={handleChange}
                  required
                  disabled={fetching}
                  placeholder="Enter estate name"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || fetching}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Update Estate Name' : 'Create Manager'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateEstateManagersModal;