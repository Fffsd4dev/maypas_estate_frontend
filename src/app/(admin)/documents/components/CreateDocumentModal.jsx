import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateDocumentModal = ({ 
  show, 
  handleClose, 
  refreshDocuments,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    apartment_uuid: '',
    document: null
  });
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoadingData(true);
        
        if (!user?.token || !tenantSlug) {
          throw new Error('Authentication required');
        }

        // Fetch apartments for dropdown
        const apartmentsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Flatten the nested apartments structure
        let apartmentsData = [];
        if (Array.isArray(apartmentsResponse.data)) {
          apartmentsResponse.data.forEach(category => {
            if (category.apartments && Array.isArray(category.apartments)) {
              apartmentsData = [...apartmentsData, ...category.apartments];
            }
          });
        }
        
        setApartments(apartmentsData);
        setLoadingData(false);
        
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('Failed to load apartments data');
        setLoadingData(false);
      }
    };

    if (show) {
      fetchApartments();
      setError(null);
      setSuccess(false);
      setFormData({
        name: '',
        apartment_uuid: '',
        document: null
      });
      setFilePreview(null);
      setFileName('');
    }
  }, [show, user, tenantSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        document: file
      }));
      setFileName(file.name);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
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

      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Please enter a document name');
      }
      if (!formData.apartment_uuid) {
        throw new Error('Please select an apartment');
      }
      if (!formData.document) {
        throw new Error('Please select a file to upload');
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('apartment_uuid', formData.apartment_uuid);
      formDataToSend.append('document', formData.document);

      // Upload document
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/upload`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setSuccess(true);
      refreshDocuments();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to upload document';
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Upload Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading apartments...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:upload" className="me-2" />
          Upload Document
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
              Document uploaded successfully!
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Document Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter document name (e.g., Agreement Form)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Apartment *</Form.Label>
            <Form.Select
              name="apartment_uuid"
              value={formData.apartment_uuid}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Apartment</option>
              {apartments.map(apartment => (
                <option key={apartment.uuid} value={apartment.uuid}>
                  {apartment.address} - {apartment.location}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Select the apartment this document belongs to
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select File *</Form.Label>
            <Form.Control
              type="file"
              name="document"
              onChange={handleFileChange}
              required
              disabled={loading}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            <Form.Text className="text-muted">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF
            </Form.Text>
            
            {fileName && (
              <div className="mt-2">
                <span className="badge bg-info">Selected: {fileName}</span>
              </div>
            )}
            
            {filePreview && (
              <div className="mt-3">
                <p className="mb-2">Preview:</p>
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="img-thumbnail" 
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            )}
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
            disabled={loading || !formData.document}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:upload" className="me-2" />
                Upload Document
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateDocumentModal;