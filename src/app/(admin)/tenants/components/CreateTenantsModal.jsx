import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateTenantsModal = ({ 
  show, 
  handleClose, 
  refreshTenants,
  editMode = false,
  tenantToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  console.log('tenantSlug in CreateTenantsModal:', tenantSlug);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    email: '',
    dob: '',
    // Additional fields only for editing
    gender: '',
    nationality: '',
    state: '',
    address: '',
    other_phone: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    emergency_contact_email: '',
    next_of_kin_name: '',
    next_of_kin_number: '',
    next_of_kin_address: '',
    next_of_kin_email: '',
  });
  const [idCardFile, setIdCardFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && tenantToEdit) {
      // For edit mode, populate all available fields
      setFormData({
        first_name: tenantToEdit.first_name || '',
        last_name: tenantToEdit.last_name || '',
        middle_name: tenantToEdit.middle_name || '',
        phone: tenantToEdit.phone || '',
        email: tenantToEdit.email || '',
        dob: tenantToEdit.dob || '',
        gender: tenantToEdit.gender || '',
        nationality: tenantToEdit.nationality || '',
        state: tenantToEdit.state || '',
        address: tenantToEdit.address || '',
        other_phone: tenantToEdit.other_phone || '',
        emergency_contact_name: tenantToEdit.emergency_contact_name || '',
        emergency_contact_number: tenantToEdit.emergency_contact_number || '',
        emergency_contact_email: tenantToEdit.emergency_contact_email || '',
        next_of_kin_name: tenantToEdit.next_of_kin_name || '',
        next_of_kin_number: tenantToEdit.next_of_kin_number || '',
        next_of_kin_address: tenantToEdit.next_of_kin_address || '',
        next_of_kin_email: tenantToEdit.next_of_kin_email || '',
      });
    } else {
      // For create mode, only basic fields
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        email: '',
        dob: '',
        // Reset additional fields
        gender: '',
        nationality: '',
        state: '',
        address: '',
        other_phone: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_email: '',
        next_of_kin_name: '',
        next_of_kin_number: '',
        next_of_kin_address: '',
        next_of_kin_email: '',
      });
    }
    // Reset file inputs
    setIdCardFile(null);
    setPassportPhotoFile(null);
    setError(null);
    setSuccess(false);
  }, [show, editMode, tenantToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, setFileFunction) => {
    const file = e.target.files[0];
    setFileFunction(file);
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

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add basic fields to FormData (always included)
      const basicFields = ['first_name', 'last_name', 'middle_name', 'phone', 'email', 'dob'];
      basicFields.forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      let url;
      let method;

      if (editMode && tenantToEdit) {
        // For update - include all additional fields
        const additionalFields = [
          'gender', 'nationality', 'state', 'address', 'other_phone',
          'emergency_contact_name', 'emergency_contact_number', 'emergency_contact_email',
          'next_of_kin_name', 'next_of_kin_number', 'next_of_kin_address', 'next_of_kin_email'
        ];
        
        additionalFields.forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Add files if they exist
        if (idCardFile) {
          formDataToSend.append('identity_card', idCardFile);
        }
        if (passportPhotoFile) {
          formDataToSend.append('passport_photo', passportPhotoFile);
        }

        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/update/${tenantToEdit.uuid}`;
        method = 'post';
      } else {
        // For create - only basic fields + apartment_id
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/create`;
        method = 'post';
        // formDataToSend.append('apartment_id', 1);
      }

      await axios[method](
        url,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess(true);
      refreshTenants();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update tenant' : 'Failed to create tenant'));
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Tenant' : 'Create New Tenant'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Tenant updated successfully!' : 'Tenant created successfully!'}
            </Alert>
          )}

          <h6 className="mb-3">Basic Information</h6>
          <Row>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
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
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
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
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* {!editMode && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apartment ID</Form.Label>
                  <Form.Control
                    type="text"
                    value="1"
                    readOnly
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Default apartment ID set to 1
                  </Form.Text>
                </Form.Group>
              </Col>
            )} */}
          </Row>

          {/* Additional fields only shown in edit mode */}
          {editMode && (
            <>
              <h6 className="mb-3 mt-4">Additional Information</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Other Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="other_phone"
                      value={formData.other_phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Emergency Contact</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="emergency_contact_number"
                      value={formData.emergency_contact_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="emergency_contact_email"
                      value={formData.emergency_contact_email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Next of Kin</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Next of Kin Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="next_of_kin_name"
                      value={formData.next_of_kin_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Next of Kin Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="next_of_kin_number"
                      value={formData.next_of_kin_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Next of Kin Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="next_of_kin_email"
                      value={formData.next_of_kin_email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Next of Kin Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="next_of_kin_address"
                      value={formData.next_of_kin_address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Documents</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Card</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, setIdCardFile)}
                    />
                    <Form.Text className="text-muted">
                      {tenantToEdit?.identity_card ? 'Current file exists. Upload new to replace.' : 'Upload ID card image or PDF'}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Passport Photo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setPassportPhotoFile)}
                    />
                    <Form.Text className="text-muted">
                      {tenantToEdit?.passport_photo ? 'Current file exists. Upload new to replace.' : 'Upload passport photo'}
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
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
              {editMode ? 'Save Changes' : 'Create Tenant'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTenantsModal;