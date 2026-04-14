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
    location_uuid: '',
    branch_uuid: '',
    name: '',
    address: '',
    landlord_id: '',
    number_item: 1
  });
  const [categories, setCategories] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch branches when location is selected
  useEffect(() => {
    const fetchBranches = async () => {
      if (!formData.location_uuid) {
        setBranches([]);
        return;
      }

      try {
        setLoadingBranches(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/view-all/${formData.location_uuid}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const branchesData = response.data || [];
        setBranches(branchesData);
        
        // Reset branch selection when location changes
        setFormData(prev => ({
          ...prev,
          branch_uuid: ''
        }));
      } catch (err) {
        console.error('Error fetching branches:', err);
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };

    if (show && formData.location_uuid) {
      fetchBranches();
    }
  }, [formData.location_uuid, tenantSlug, user, show]);

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
          
        // Fetch locations
        const locationsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/location/view-all`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const categoriesData = categoriesResponse.data || [];
        const landlordsData = landlordsResponse.data.data || [];
        const locationsData = locationsResponse.data || [];
        
        setCategories(categoriesData);
        setLandlords(landlordsData);
        setLocations(locationsData);
        
        // Set form data after data is loaded
        if (editMode && apartmentToEdit) {
          // Map the apartment data to form fields
          setFormData({
            category_uuid: apartmentToEdit.category_uuid || String(apartmentToEdit.category_id || ''),
            location_uuid: apartmentToEdit.location_uuid || String(apartmentToEdit.location_id || ''),
            branch_uuid: apartmentToEdit.branch_uuid || '',
            name: apartmentToEdit.name || '',
            address: apartmentToEdit.address || '',
            landlord_id: apartmentToEdit.landlord_id || String(apartmentToEdit.land_lord?.id || ''),
            number_item: parseInt(apartmentToEdit.number_apartment_units || apartmentToEdit.number_item || 1)
          });

          // If there's a location_uuid, fetch branches for it
          if (apartmentToEdit.location_id || apartmentToEdit.location_uuid) {
            const locationId = apartmentToEdit.location_uuid || String(apartmentToEdit.location_id);
            setTimeout(() => {
              fetchBranchesForLocation(locationId);
            }, 100);
          }
        } else {
          setFormData({
            category_uuid: '',
            location_uuid: '',
            branch_uuid: '',
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

    const fetchBranchesForLocation = async (locationUuid) => {
      try {
        setLoadingBranches(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/view-all/${locationUuid}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const branchesData = response.data || [];
        setBranches(branchesData);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setBranches([]);
      } finally {
        setLoadingBranches(false);
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
      if (!formData.location_uuid) {
        throw new Error('Please select a location');
      }
      if (!formData.branch_uuid) {
        throw new Error('Please select a branch');
      }
      if (!formData.number_item || formData.number_item < 1) {
        throw new Error('Please enter a valid number of items (minimum 1)');
      }

      if (editMode && apartmentToEdit) {
        // Edit mode
        const payload = {
          category_uuid: formData.category_uuid,
          location_uuid: formData.location_uuid,
          branch_uuid: formData.branch_uuid,
          address: formData.address,
          landlord_id: parseInt(formData.landlord_id),
          apartment_uuid: apartmentToEdit.uuid,
          name: formData.name,
          number_item: formData.number_item
        };

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
        // Create mode
        const payload = {
          name: formData.name,
          category_uuid: formData.category_uuid,
          number_item: formData.number_item,
          location_uuid: formData.location_uuid,
          branch_uuid: formData.branch_uuid,
          address: formData.address,
          landlord_id: parseInt(formData.landlord_id)
        };

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
                      {category.name}
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
                  required
                  disabled={loading}
                >
                  <option value="">Select Landlord</option>
                  {landlords.map(landlord => (
                    <option key={landlord.id} value={landlord.id}>
                      {landlord.name}
                    </option>
                  ))}
                </Form.Select>
                {editMode && apartmentToEdit && (
                  <Form.Text className="text-muted">
                    Current landlord: {apartmentToEdit.land_lord?.name}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Select
                  name="location_uuid"
                  value={formData.location_uuid}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.uuid} value={location.uuid}>
                      {location.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Branch *</Form.Label>
                <Form.Select
                  name="branch_uuid"
                  value={formData.branch_uuid}
                  onChange={handleChange}
                  required
                  disabled={loading || loadingBranches || !formData.location_uuid}
                >
                  <option value="">
                    {loadingBranches ? 'Loading branches...' : 
                     !formData.location_uuid ? 'Select location first' : 
                     'Select Branch'}
                  </option>
                  {branches.map(branch => (
                    <option key={branch.uuid} value={branch.uuid}>
                      {branch.name}
                    </option>
                  ))}
                </Form.Select>
                {loadingBranches && (
                  <Form.Text className="text-muted">
                    <Spinner animation="border" size="sm" /> Loading branches...
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
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
                  disabled={loading || editMode}
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