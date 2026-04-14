import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateBranchModal = ({ 
  show, 
  handleClose, 
  refreshBranches,
  editMode = false,
  branchToEdit = null,
  tenantSlug,
  selectedLocation
}) => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      if (editMode && branchToEdit) {
        setName(branchToEdit.name || '');
      } else {
        setName('');
      }
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, branchToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!tenantSlug) throw new Error('Tenant slug not found');
      if (!user?.token) throw new Error('Authentication required');
      if (!name.trim()) throw new Error('Branch name is required');
      if (!selectedLocation?.uuid) throw new Error('Location is required');

      const payload = {
        name: name.trim(),
        location_uuid: selectedLocation.uuid
      };

      if (editMode && branchToEdit) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/update/${branchToEdit.uuid}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/create`,
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
      refreshBranches();
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          (editMode ? 'Failed to update branch' : 'Failed to create branch');
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
          {editMode ? 'Edit Branch' : 'Create New Branch'}
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
              {editMode ? 'Branch updated successfully!' : 'Branch created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={selectedLocation?.name || 'No location selected'}
              disabled
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Branch Name *</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || success}
              placeholder="Enter branch name"
              autoFocus
            />
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
                {editMode ? 'Save Changes' : 'Create Branch'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateBranchModal;