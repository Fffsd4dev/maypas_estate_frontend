import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateTechniciansModal = ({ 
  show, 
  handleClose, 
  refreshTechnicians,
  editMode = false,
  technicianToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty_id: ''
  });
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch specialties
  const fetchSpecialties = async () => {
    try {
      if (!user?.token || !tenantSlug) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-specialties`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSpecialties(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch specialties:', err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchSpecialties();
      
      if (editMode && technicianToEdit) {
        setFormData({
          name: technicianToEdit.name || '',
          phone: technicianToEdit.phone || '',
          specialty_id: technicianToEdit.specialty_id || ''
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          specialty_id: ''
        });
      }
      
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, technicianToEdit]);

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

      let url;
      let method;

      if (editMode && technicianToEdit) {
        // Update technician
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/technician/update/${technicianToEdit.id}`;
        method = 'put';
      } else {
        // Create technician
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/technician/create`;
        method = 'post';
      }

      await axios[method](
        url,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      refreshTechnicians();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update technician' : 'Failed to create technician'));
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Technician' : 'Create New Technician'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Technician updated successfully!' : 'Technician created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter technician's full name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
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
                <Form.Label>Specialty *</Form.Label>
                <Form.Select
                  name="specialty_id"
                  value={formData.specialty_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <>
              <IconifyIcon icon="eos-icons:loading" className="me-1" />
              {editMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
              {editMode ? 'Save Changes' : 'Create Technician'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTechniciansModal;