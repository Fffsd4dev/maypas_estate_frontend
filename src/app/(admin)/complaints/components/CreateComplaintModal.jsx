import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateComplaintModal = ({ 
  show, 
  handleClose, 
  refreshComplaints, 
  tenantSlug,
  editMode = false,
  complaintToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    apartment_unit_uuid: ''
  });
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [apartmentUnits, setApartmentUnits] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch apartment units when modal opens and set form data for edit mode
  useEffect(() => {
    if (show) {
      fetchApartmentUnits();
      
      if (editMode && complaintToEdit) {
        const complaintId = complaintToEdit.id || complaintToEdit.complaint_id;
        
        setFormData({
          title: complaintToEdit.title || '',
          description: complaintToEdit.description || '',
          priority: complaintToEdit.priority || 'medium',
          apartment_unit_uuid: complaintToEdit.apartment_unit_uuid || ''
        });
      } else {
        resetForm();
      }
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, complaintToEdit]);

  const fetchApartmentUnits = async () => {
    try {
      setLoadingData(true);
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the data array from the response
      let unitsData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        unitsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        unitsData = response.data;
      } else {
        console.warn('Unexpected apartment units response structure:', response.data);
        unitsData = [];
      }
      
      setApartmentUnits(unitsData);
      
      // Set default apartment unit if available and not in edit mode
      if (unitsData.length > 0 && !editMode && !formData.apartment_unit_uuid) {
        const firstUnit = unitsData[0];
        const unitUuid = firstUnit.apartment_unit_uuid;
        
        setFormData(prev => ({
          ...prev,
          apartment_unit_uuid: unitUuid
        }));
      }
    } catch (err) {
      console.error('Failed to fetch apartment units:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load apartment units: ' + (err.response?.data?.message || err.message));
      setApartmentUnits([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEvidenceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setEvidence(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      // For edit mode, we don't require apartment_unit_uuid validation since it's pre-filled and disabled
      if (!editMode && !formData.apartment_unit_uuid) {
        throw new Error('Please select an apartment unit');
      }

      // Get the complaint ID for editing
      const complaintId = editMode ? (complaintToEdit.id || complaintToEdit.complaint_id) : null;
      
      if (editMode && !complaintId) {
        throw new Error('Complaint ID not found for editing');
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);
      
      if (evidence) {
        formDataToSend.append('evidence', evidence);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formDataToSend.entries()) {

      }

      let apiUrl;
      let method;

      if (editMode) {
        // Use PUT method for editing and include complaint ID in URL
        method = 'post';
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/update/${complaintId}`;
        
        // For edit, also send the apartment_unit_uuid in FormData
        formDataToSend.append('apartment_unit_uuid', formData.apartment_unit_uuid);
      } else {
        // Use POST method for creating new complaint
        method = 'post';
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/create/${formData.apartment_unit_uuid}`;
      }

      const response = await axios({
        method: method,
        url: apiUrl,
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      refreshComplaints();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        resetForm();
      }, 1500);
    } catch (err) {
      console.error('Complaint operation error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.message || 
        (editMode ? 'Failed to update complaint' : 'Failed to create complaint'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const firstUnit = apartmentUnits[0];
    
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      apartment_unit_uuid: firstUnit ? firstUnit.apartment_unit_uuid : ''
    });
    setEvidence(null);
    setError(null);
    setSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const removeEvidence = () => {
    setEvidence(null);
  };

  // Helper function to get display name for apartment unit
  const getApartmentDisplayName = (unit) => {
    if (!unit) return 'Unknown Unit';
    
    // Use apartment_unit_name from the API response
    if (unit.apartment_unit_name) return unit.apartment_unit_name;
    
    // Fallback to other possible fields
    if (unit.name) return unit.name;
    if (unit.unitNumber) return `Unit ${unit.unitNumber}`;
    if (unit.apartmentNumber) return `Apartment ${unit.apartmentNumber}`;
    
    return `Unit ${unit.apartment_unit_uuid || 'Unknown'}`;
  };

  // Helper function to get UUID for apartment unit
  const getApartmentValue = (unit) => {
    if (!unit) return '';
    
    // Use apartment_unit_uuid from the API response
    if (unit.apartment_unit_uuid) {
      return unit.apartment_unit_uuid;
    }
    
    // Fallback to other possible UUID fields
    const possibleUuidFields = ['uuid', 'id', '_id', 'unit_id'];
    for (const field of possibleUuidFields) {
      if (unit[field]) {
        return unit[field];
      }
    }
    
    return '';
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Complaint' : 'Create New Complaint'}
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
              {editMode ? 'Complaint updated successfully!' : 'Complaint created successfully!'}
            </Alert>
          )}

          {loadingData && (
            <Alert variant="info">
              <IconifyIcon icon="eos-icons:loading" className="me-2" />
              Loading data...
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apartment Unit {!editMode && '*'}</Form.Label>
                <Form.Select
                  name="apartment_unit_uuid"
                  value={formData.apartment_unit_uuid}
                  onChange={handleChange}
                  required={!editMode} // Only require for create mode
                  disabled={loadingData || apartmentUnits.length === 0 || editMode}
                >
                  <option value="">Select Apartment Unit</option>
                  {apartmentUnits.map((unit, index) => {
                    const unitValue = getApartmentValue(unit);
                    const displayName = getApartmentDisplayName(unit);
                    
                    return (
                      <option 
                        key={unitValue || index} 
                        value={unitValue}
                      >
                        {displayName}
                      </option>
                    );
                  })}
                </Form.Select>
                {apartmentUnits.length === 0 && !loadingData && (
                  <Form.Text className="text-danger">
                    No apartment units available
                  </Form.Text>
                )}
                {editMode && (
                  <Form.Text className="text-muted">
                    Apartment unit cannot be changed when editing a complaint
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Complaint Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter complaint title"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint in detail..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Evidence (Image - Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleEvidenceChange}
            />
            <Form.Text className="text-muted">
              Upload an image as evidence (JPEG, PNG, GIF, WebP, max 5MB)
            </Form.Text>
            {editMode && complaintToEdit?.evidence && (
              <Form.Text className="text-info">
                Current evidence: {complaintToEdit.evidence}
              </Form.Text>
            )}
          </Form.Group>

          {evidence && (
            <Alert variant="info" className="d-flex justify-content-between align-items-center">
              <div>
                <IconifyIcon icon="mdi:file-image" className="me-2" />
                {evidence.name}
              </div>
              <Button variant="outline-danger" size="sm" onClick={removeEvidence}>
                <IconifyIcon icon="mdi:close" />
              </Button>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || loadingData || (!editMode && apartmentUnits.length === 0)}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bx:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Complaint'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateComplaintModal;