import { useState, useRef } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfSigningModal = ({ 
  show, 
  handleClose, 
  document,
  tenantSlug,
  onDocumentSigned 
}) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [signatureData, setSignatureData] = useState(null);
  const [activeTab, setActiveTab] = useState('fill');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Handle form field changes
  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Capture signature
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Save signature as data URL
    setSignatureData(canvasRef.current.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // Submit signed document
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!tenantSlug || !document?.id) {
        throw new Error('Invalid document or tenant');
      }

      const signedDocument = {
        document_id: document.id,
        form_values: formValues,
        signature: signatureData,
        signed_by: user?.email || user?.name,
        signed_at: new Date().toISOString()
      };

      // Send to backend for PDF generation
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/sign`,
        signedDocument,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob' // Important for PDF download
        }
      );

      // Create download link for signed PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `signed_${document.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(true);
      onDocumentSigned?.(document.id);
      
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign document');
      console.error('Signing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>
          Sign Document: {document?.name}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="fill">Fill Form</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sign">Sign</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="review">Review</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="fill">
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              <Row>
                <Col md={8}>
                  <div className="border rounded p-2 mb-3" style={{ height: '500px' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={`${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/preview/${document?.id}`}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                </Col>
                
                <Col md={4}>
                  <div className="border rounded p-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <h6>Form Fields</h6>
                    {document?.pdf_fields?.map((field) => (
                      <Form.Group key={field.id} className="mb-3">
                        <Form.Label>{field.label} {field.required && <span className="text-danger">*</span>}</Form.Label>
                        
                        {field.type === 'text' && (
                          <Form.Control
                            type="text"
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'textarea' && (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'date' && (
                          <Form.Control
                            type="date"
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'checkbox' && (
                          <Form.Check
                            type="checkbox"
                            label="Checked"
                            checked={formValues[field.id] || false}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          />
                        )}
                        
                        {field.type === 'select' && (
                          <Form.Select
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            required={field.required}
                          >
                            <option value="">Select...</option>
                            {field.options?.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        )}
                      </Form.Group>
                    ))}
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="sign">
              <Row>
                <Col md={8}>
                  <div className="border rounded p-3 mb-3">
                    <h6>Draw Your Signature</h6>
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={200}
                      style={{
                        border: '1px solid #ccc',
                        cursor: 'crosshair',
                        backgroundColor: 'white'
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <div className="mt-2">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={clearSignature}
                        className="me-2"
                      >
                        <IconifyIcon icon="bx:eraser" className="me-1" />
                        Clear
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          // Use typed signature as fallback
                          const typedSig = prompt('Enter your name for signature:');
                          if (typedSig) {
                            setSignatureData(`data:text/plain;base64,${btoa(typedSig)}`);
                          }
                        }}
                      >
                        <IconifyIcon icon="bx:text" className="me-1" />
                        Type Signature
                      </Button>
                    </div>
                    
                    {signatureData && (
                      <div className="mt-3">
                        <h6>Signature Preview:</h6>
                        <img 
                          src={signatureData} 
                          alt="Signature" 
                          style={{ maxWidth: '200px', border: '1px solid #ccc' }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
                
                <Col md={4}>
                  <Alert variant="info">
                    <h6>Signing Instructions:</h6>
                    <ul className="mb-0">
                      <li>Draw your signature in the box</li>
                      <li>Or type your name as a signature</li>
                      <li>Click "Save Signature" when done</li>
                      <li>All form fields must be completed</li>
                      <li>Review before final submission</li>
                    </ul>
                  </Alert>
                  
                  <div className="border rounded p-3">
                    <h6>Signer Information</h6>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={user?.name} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" defaultValue={user?.email} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" defaultValue={new Date().toLocaleDateString()} readOnly />
                      </Form.Group>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="review">
              {success && (
                <Alert variant="success">
                  Document signed successfully! Downloading your copy...
                </Alert>
              )}
              
              <div className="border rounded p-3 mb-3">
                <h6>Document Review</h6>
                <p>Please review all information before finalizing:</p>
                
                <div className="mb-3">
                  <strong>Document:</strong> {document?.name}<br />
                  <strong>Signer:</strong> {user?.name} ({user?.email})<br />
                  <strong>Date:</strong> {new Date().toLocaleString()}
                </div>
                
                <div className="mb-3">
                  <h6>Form Values:</h6>
                  <ul>
                    {Object.entries(formValues).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value?.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {signatureData && (
                  <div className="mb-3">
                    <h6>Signature:</h6>
                    <img 
                      src={signatureData} 
                      alt="Signature" 
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                )}
                
                <Alert variant="warning">
                  <strong>Legal Notice:</strong> By submitting this document, you agree that this electronic signature is legally binding and equivalent to a handwritten signature.
                </Alert>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        
        {activeTab === 'review' ? (
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Processing...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:check-shield" className="me-1" />
                Finalize & Sign Document
              </>
            )}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => {
            if (activeTab === 'fill') setActiveTab('sign');
            if (activeTab === 'sign') setActiveTab('review');
          }}>
            Next Step <IconifyIcon icon="bx:chevron-right" />
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PdfSigningModal;