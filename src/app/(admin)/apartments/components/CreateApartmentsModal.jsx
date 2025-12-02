
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateApartmentsModal = ({ 
  show, 
  handleClose, 
  refreshApartments,
  editMode = false,
  apartmentToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    category_uuid: '',
    location: '',
    name: '',
    address: '',
    landlord_id: '',
    number_item: 1 // Initialize with 1 but allow user to change it
  });
  const [categories, setCategories] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch categories
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/apartment/categories`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Categories Response:', categoriesResponse.data);
        
        // Fetch landlords
        const landlordsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-landlords`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Landlords Response:', landlordsResponse.data.data);
        
        const categoriesData = categoriesResponse.data || [];
        const landlordsData = landlordsResponse.data.data || [];
        
        setCategories(categoriesData);
        setLandlords(landlordsData);
        
        // Set form data after categories are loaded
        if (editMode && apartmentToEdit) {
          // Find the matching category by name if UUID doesn't match
          let categoryUuid = apartmentToEdit.category_uuid;
          
          // If UUID doesn't match any category, try to find by name
          if (!categoriesData.find(cat => cat.uuid === apartmentToEdit.category_uuid)) {
            const matchingCategory = categoriesData.find(
              cat => cat.name === apartmentToEdit.category_name
            );
            if (matchingCategory) {
              categoryUuid = matchingCategory.uuid;
              console.log('Found category by name:', matchingCategory.name);
            }
          }
          
          setFormData({
            category_uuid: categoryUuid || '',
            location: apartmentToEdit.location || '',
            name: apartmentToEdit.name || '',
            address: apartmentToEdit.address || '',
            landlord_id: apartmentToEdit.landlord_id || '',
            number_item: apartmentToEdit.number_item || 1
          });
        } else {
          setFormData({
            category_uuid: '',
            location: '',
            name: '',
            address: '',
            landlord_id: '',
            number_item: 1
          });
        }
        
        setLoadingData(false);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
        setError('Failed to load required data');
        setLoadingData(false);
      }
    };

    if (show) {
      fetchDropdownData();
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, apartmentToEdit, user, tenantSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_item' ? parseInt(value) || 1 : value
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

      // Validate form data
      if (!formData.category_uuid) {
        throw new Error('Please select a category');
      }
      if (!formData.landlord_id) {
        throw new Error('Please select a landlord');
      }
      if (!formData.number_item || formData.number_item < 1) {
        throw new Error('Please enter a valid number of items (minimum 1)');
      }

      if (editMode && apartmentToEdit) {
        // Edit mode - use the correct endpoint and payload format
        const payload = {
          category_uuid: formData.category_uuid,
          location: formData.location,
          address: formData.address,
          landlord_id: parseInt(formData.landlord_id),
          apartment_uuid: apartmentToEdit.uuid,
          name: formData.name,
          number_item: formData.number_item
        };

        console.log('Edit payload:', payload);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create mode - use the original endpoint and payload
        const payload = {
          category_uuid: formData.category_uuid,
          number_item: formData.number_item, // Use the user-entered value
          location: formData.location,
          name: formData.name,
          address: formData.address,
          landlord_id: parseInt(formData.landlord_id)
        };

        console.log('Create payload:', payload);

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartment/create`,
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
      refreshApartments();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          (editMode ? 'Failed to update apartment' : 'Failed to create apartment');
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? 'Edit Apartment' : 'Create New Apartment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading required data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:edit" : "bi:plus"} className="me-2" />
          {editMode ? 'Edit Apartment' : 'Create New Apartment'}
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
              {editMode ? 'Apartment updated successfully!' : 'Apartment created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category_uuid"
                  value={formData.category_uuid}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.uuid} value={category.uuid}>
                      {category.name} {category.uuid === formData.category_uuid ? '(Current)' : ''}
                    </option>
                  ))}
                </Form.Select>
                {editMode && apartmentToEdit && (
                  <Form.Text className="text-muted">
                    Current category: {apartmentToEdit.category_name}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Landlord *</Form.Label>
                <Form.Select
                  name="landlord_id"
                  value={formData.landlord_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Landlord</option>
                  {landlords.map(landlord => (
                    <option key={landlord.id} value={landlord.id}>
                      {landlord.name} {landlord.id === parseInt(formData.landlord_id) ? '(Current)' : ''}
                    </option>
                  ))}
                </Form.Select>
                {editMode && apartmentToEdit && (
                  <Form.Text className="text-muted">
                    Current landlord ID: {apartmentToEdit.landlord_id}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter location (e.g., Lagos)"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apartment Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter apartment name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Items *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_item"
                  value={formData.number_item}
                  onChange={handleChange}
                  required
                  min="1"
                  disabled={loading || editMode} // Disable in edit mode if you don't want it to be editable
                />
                <Form.Text className="text-muted">
                  Number of units to create initially
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter full address"
                />
              </Form.Group>
            </Col>
          </Row>
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
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-2" />
                {editMode ? 'Save Changes' : 'Create Apartment'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateApartmentsModal;