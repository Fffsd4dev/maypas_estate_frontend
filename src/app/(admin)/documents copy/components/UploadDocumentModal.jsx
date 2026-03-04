import { useState, useRef } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  Alert, 
  Row, 
  Col, 
  Spinner, 
  ProgressBar 
} from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const UploadDocumentModal = ({ 
  show, 
  handleClose, 
  refreshDocuments,
  tenantSlug 
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError('Please upload only PDF, JPG, JPEG, or PNG files');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file: file,
      name: file.name.split('.')[0] || prev.name // Use filename as default name
    }));
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!formData.file) {
        throw new Error('Please select a file to upload');
      }

      if (!formData.name.trim()) {
        throw new Error('Please enter a document name');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('document', formData.file);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', 'uploaded');

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/documents/upload`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
          timeout: 30000 // 30 seconds timeout for upload
        }
      );

      setSuccess('Document uploaded successfully!');
      refreshDocuments();
      
      setTimeout(() => {
        handleClose();
        setFormData({
          name: '',
          description: '',
          category: 'general',
          file: null
        });
        setUploadProgress(0);
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again.');
      } else if (err.response) {
        setError(err.response?.data?.message || 'Failed to upload document');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to upload document');
      }
      console.error('Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setFormData({
      name: '',
      description: '',
      category: 'general',
      file: null
    });
    setUploadProgress(0);
    setError(null);
    setSuccess(false);
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              {/* File Upload Area */}
              <div 
                className={`border rounded p-4 text-center mb-3 ${!formData.file ? 'border-dashed' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  cursor: 'pointer',
                  backgroundColor: formData.file ? '#f8f9fa' : 'transparent',
                  borderStyle: formData.file ? 'solid' : 'dashed',
                  borderColor: formData.file ? '#0d6efd' : '#dee2e6'
                }}
                onClick={() => !formData.file && fileInputRef.current?.click()}
              >
                {formData.file ? (
                  <div>
                    <IconifyIcon 
                      icon="bx:file" 
                      style={{ fontSize: '48px', color: '#0d6efd' }} 
                      className="mb-2"
                    />
                    <h6>{formData.file.name}</h6>
                    <p className="text-muted mb-1">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, file: null }));
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <IconifyIcon 
                      icon="bx:cloud-upload" 
                      style={{ fontSize: '48px', color: '#6c757d' }} 
                      className="mb-2"
                    />
                    <h6>Drag & Drop or Click to Upload</h6>
                    <p className="text-muted mb-2">
                      Supports PDF, JPG, PNG files (Max 10MB)
                    </p>
                    <Button variant="outline-primary" size="sm">
                      Choose File
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-3">
                  <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                  <small className="text-muted">Uploading...</small>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Document Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rental Agreement"
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the document"
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="agreement">Agreement</option>
                  <option value="invoice">Invoice</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading || !formData.file}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              Uploading...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:upload" className="me-1" />
              Upload Document
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocumentModal;