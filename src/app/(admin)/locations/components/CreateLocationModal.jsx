import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateLocationModal = ({ 
  show, 
  handleClose, 
  refreshLocations,
  editMode = false,
  locationToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      if (editMode && locationToEdit) {
        setName(locationToEdit.name || '');
      } else {
        setName('');
      }
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, locationToEdit]);

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

      if (!name.trim()) {
        throw new Error('Location name is required');
      }

      if (editMode && locationToEdit) {
        // Update location
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/location/update/${locationToEdit.uuid}`,
          { name: name.trim() },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new location
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/location/create`,
          { name: name.trim() },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setSuccess(true);
      refreshLocations();
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          (editMode ? 'Failed to update location' : 'Failed to create location');
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:edit" : "bi:plus"} className="me-2" />
          {editMode ? 'Edit Location' : 'Create New Location'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <IconifyIcon icon="bx:error" className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <IconifyIcon icon="bx:check-circle" className="me-2" />
              {editMode ? 'Location updated successfully!' : 'Location created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Location Name *</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || success}
              placeholder="Enter location name (e.g., Lagos State)"
              autoFocus
            />
            <Form.Text className="text-muted">
              Enter a unique name for this location
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-2" />
                {editMode ? 'Save Changes' : 'Create Location'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateLocationModal;