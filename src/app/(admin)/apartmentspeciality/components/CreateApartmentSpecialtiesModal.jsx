
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateApartmentSpecialtiesModal = ({ 
  show, 
  handleClose, 
  refreshSpecialties,
  editMode = false,
  specialtyToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && specialtyToEdit) {
      setFormData({
        name: specialtyToEdit.name || ''
      });
    } else {
      setFormData({
        name: ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, specialtyToEdit]);

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
      const payload = {
        name: formData.name
      };

      if (editMode && specialtyToEdit) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/specialty/update/${specialtyToEdit.id}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/specialty/create`,
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
      refreshSpecialties();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update apartment specialty' : 'Failed to create apartment specialty'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Apartment Specialty' : 'Create New Apartment Specialty'}
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
              {editMode ? 'Apartment specialty updated successfully!' : 'Apartment specialty created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Specialty Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter specialty name (e.g., Plumber, Tiler, Electrician)"
            />
          </Form.Group>

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
                {editMode ? 'Save Changes' : 'Create Specialty'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateApartmentSpecialtiesModal;