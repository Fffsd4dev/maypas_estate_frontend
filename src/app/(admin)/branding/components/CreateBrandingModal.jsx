import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateBrandingModal = ({ 
  show, 
  handleClose, 
  refreshBranding,
  editMode = false,
  brandingToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    addresses: [''],
    phones: [''],
    social_links: [''],
    logo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [hasExistingLogo, setHasExistingLogo] = useState(false);

  // Initialize form data when modal opens or edit mode changes
  useEffect(() => {
    if (editMode && brandingToEdit) {
      setFormData({
        name: brandingToEdit.name || '',
        addresses: brandingToEdit.addresses?.length > 0 ? [...brandingToEdit.addresses] : [''],
        phones: brandingToEdit.phones?.length > 0 ? [...brandingToEdit.phones] : [''],
        social_links: brandingToEdit.social_links?.length > 0 ? [...brandingToEdit.social_links] : [''],
        logo: brandingToEdit.logo || null
      });
      
      if (brandingToEdit.logo) {
        setLogoPreview(`${brandingToEdit.logo}`);
        setHasExistingLogo(true);
        setLogoFile(null);
      } else {
        setLogoPreview(null);
        setHasExistingLogo(false);
        setLogoFile(null);
      }
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        addresses: [''],
        phones: [''],
        social_links: [''],
        logo: null
      });
      setLogoPreview(null);
      setLogoFile(null);
      setHasExistingLogo(false);
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, brandingToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      setHasExistingLogo(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setHasExistingLogo(false);
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
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

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      
      // Append arrays (filter out empty values)
      formData.addresses
        .filter(addr => addr.trim() !== '')
        .forEach(addr => payload.append('addresses[]', addr.trim()));
      
      formData.phones
        .filter(phone => phone.trim() !== '')
        .forEach(phone => payload.append('phones[]', phone.trim()));
      
      formData.social_links
        .filter(link => link.trim() !== '')
        .forEach(link => payload.append('social_links[]', link.trim()));

      // Handle logo
      if (logoFile instanceof File) {
        payload.append('logo', logoFile);
      } else if (editMode && !logoFile && !hasExistingLogo) {
        // User removed existing logo
        payload.append('logo', '');
      }

      const endpoint = editMode ? 'update' : 'create';
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/${endpoint}`;
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      refreshBranding();
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err) {
      console.error('Branding operation failed:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          (editMode ? 'Failed to update branding' : 'Failed to create branding');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:edit" : "bi:plus"} className="me-2" />
          {editMode ? 'Edit Branding' : 'Create New Branding'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <strong>Success!</strong> {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Estate Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter estate name"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Logo Upload */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Logo</Form.Label>
                <div className="border rounded p-3">
                  {logoPreview ? (
                    <div className="text-center">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                        className="mb-3"
                      />
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-secondary"
                          onClick={() => document.getElementById('logo-upload').click()}
                          type="button"
                          disabled={loading}
                        >
                          <IconifyIcon icon="bx:edit" className="me-1" />
                          Change Logo
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={removeLogo}
                          type="button"
                          disabled={loading}
                        >
                          <IconifyIcon icon="bx:trash" className="me-1" />
                          Remove
                        </Button>
                      </div>
                      {hasExistingLogo && !logoFile && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Current logo will be kept. Upload a new file to replace it.
                          </small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-3">
                        <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => document.getElementById('logo-upload').click()}
                        type="button"
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:upload" className="me-1" />
                        Select Logo
                      </Button>
                      <Form.Text className="d-block text-muted mt-2">
                        Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
                      </Form.Text>
                    </div>
                  )}
                  <Form.Control
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Addresses */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Addresses</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('addresses')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Address
                </Button>
              </div>
              {formData.addresses.map((address, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={address}
                      onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
                      placeholder="Enter address"
                      disabled={loading}
                    />
                    {formData.addresses.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('addresses', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>

          {/* Phone Numbers */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Phone Numbers</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('phones')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Phone
                </Button>
              </div>
              {formData.phones.map((phone, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => handleArrayChange('phones', index, e.target.value)}
                      placeholder="Enter phone number"
                      disabled={loading}
                    />
                    {formData.phones.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('phones', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>

          {/* Social Links */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Social Links</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('social_links')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Social Link
                </Button>
              </div>
              {formData.social_links.map((link, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="url"
                      value={link}
                      onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
                      placeholder="https://example.com"
                      disabled={loading}
                    />
                    {formData.social_links.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('social_links', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Branding'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateBrandingModal;