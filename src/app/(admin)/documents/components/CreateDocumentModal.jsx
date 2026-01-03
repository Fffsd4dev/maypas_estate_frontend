// import { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { FormBuilder } from '@formio/react';
// // import '@formio/js/dist/formio.full.css';

// const CreateDocumentModal = ({ 
//   show, 
//   handleClose, 
//   refreshDocuments,
//   editMode = false,
//   documentToEdit = null,
//   tenantSlug
// }) => {
//   const { user } = useAuthContext();
//   const [formData, setFormData] = useState({
//     name: '',
//     form_json: { display: 'form', components: [] }
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [formBuilderKey, setFormBuilderKey] = useState(Date.now());

//   useEffect(() => {
//     if (show) {
//       if (editMode && documentToEdit) {
//         setFormData({
//           name: documentToEdit.name || '',
//           form_json: documentToEdit.form_json || { display: 'form', components: [] }
//         });
//       } else {
//         setFormData({
//           name: '',
//           form_json: { display: 'form', components: [] }
//         });
//       }
      
//       // Reset form builder key to force re-render
//       setFormBuilderKey(Date.now());
//       setError(null);
//       setSuccess(false);
//     }
//   }, [show, editMode, documentToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFormBuilderChange = (schema) => {
//     setFormData(prev => ({
//       ...prev,
//       form_json: schema
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       if (!formData.name.trim()) {
//         throw new Error('Please enter a template name');
//       }

//       let url;
//       let method;

//       if (editMode && documentToEdit) {
//         // Update document
//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/update/${documentToEdit.id}`;
//         method = 'put';
//       } else {
//         // Create document
//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/create`;
//         method = 'post';
//       }

//       await axios[method](
//         url,
//         {
//           name: formData.name,
//           form_json: formData.form_json
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setSuccess(true);
//       refreshDocuments();
//       setTimeout(() => {
//         handleClose();
//         setSuccess(false);
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || 
//         (editMode ? 'Failed to update document template' : 'Failed to create document template'));
//       console.error('API Error:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered size="xl">
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {editMode ? 'Edit Document Template' : 'Create New Document Template'}
//         </Modal.Title>
//       </Modal.Header>
      
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {success && (
//             <Alert variant="success">
//               {editMode ? 'Document template updated successfully!' : 'Document template created successfully!'}
//             </Alert>
//           )}

//           <Row>
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Template Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g. Tenant Onboarding Form"
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <div className="border rounded p-3 bg-light mb-3">
//                 <label className="form-label fw-medium">Form Builder</label>
//                 <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                   <FormBuilder
//                     key={formBuilderKey}
//                     form={formData.form_json}
//                     onChange={handleFormBuilderChange}
//                   />
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
      
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>
//         <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
//           {loading ? (
//             <>
//               <Spinner animation="border" size="sm" className="me-1" />
//               {editMode ? 'Updating...' : 'Creating...'}
//             </>
//           ) : (
//             <>
//               <IconifyIcon icon={editMode ? "bx:save" : "bi:save"} className="me-1" />
//               {editMode ? 'Save Changes' : 'Save Template'}
//             </>
//           )}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default CreateDocumentModal;




import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner, Tab, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PdfTemplateBuilder from './PdfTemplateBuilder';

const CreateDocumentModal = ({ 
  show, 
  handleClose, 
  refreshDocuments,
  editMode = false,
  documentToEdit = null,
  tenantSlug,
  apiError
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    pdf_fields: [],
    pdf_template: { components: [] }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    if (show) {
      if (editMode && documentToEdit) {
        setFormData({
          name: documentToEdit.name || '',
          pdf_fields: documentToEdit.pdf_fields || [],
          pdf_template: documentToEdit.pdf_template || { components: [] }
        });
      } else {
        setFormData({
          name: '',
          pdf_fields: [],
          pdf_template: { components: [] }
        });
      }
      
      // Check if we should use offline mode
      setIsOfflineMode(!!apiError);
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, documentToEdit, apiError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (updatedData) => {
    setFormData(updatedData);
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

      if (!formData.name.trim()) {
        throw new Error('Please enter a template name');
      }

      // Generate final PDF template
      const finalTemplate = {
        name: formData.name,
        form_json: {
          display: 'pdf',
          components: formData.pdf_fields,
          metadata: {
            type: 'pdf_template',
            version: '1.0',
            created_at: new Date().toISOString()
          }
        }
      };

      // Check if we're in offline mode
      if (isOfflineMode) {
        // Store locally in localStorage as fallback
        const localTemplates = JSON.parse(localStorage.getItem('pdf_templates') || '[]');
        const newTemplate = {
          id: `local_${Date.now()}`,
          ...finalTemplate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_local: true
        };
        
        if (editMode && documentToEdit) {
          // Update local template
          const updatedTemplates = localTemplates.map(t => 
            t.id === documentToEdit.id ? newTemplate : t
          );
          localStorage.setItem('pdf_templates', JSON.stringify(updatedTemplates));
        } else {
          // Add new local template
          localTemplates.push(newTemplate);
          localStorage.setItem('pdf_templates', JSON.stringify(localTemplates));
        }
        
        setSuccess(isOfflineMode 
          ? 'Template saved locally (API unavailable)' 
          : 'Document template created successfully!');
        
        // Refresh if possible
        try {
          await refreshDocuments();
        } catch (refreshError) {
          console.warn('Could not refresh documents:', refreshError);
        }
        
        setTimeout(() => {
          handleClose();
          setSuccess(false);
        }, 1500);
        
        return;
      }

      // Normal API call
      let url;
      let method;

      if (editMode && documentToEdit) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/update/${documentToEdit.id}`;
        method = 'put';
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/create`;
        method = 'post';
      }

      await axios[method](
        url,
        finalTemplate,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      setSuccess('Document template created successfully!');
      refreshDocuments();
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      if (err.code === 'ECONNABORTED' || !err.response) {
        setError('API unavailable. Saving template locally instead.');
        setIsOfflineMode(true);
        // Retry in offline mode
        setTimeout(() => handleSubmit(e), 100);
      } else {
        setError(err.response?.data?.message || 
          (editMode ? 'Failed to update document template' : 'Failed to create document template'));
        console.error('API Error:', err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit PDF Template' : 'Create New PDF Template'}
          {isOfflineMode && <span className="badge bg-warning ms-2">Local Mode</span>}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {isOfflineMode && (
          <Alert variant="warning" className="mb-3">
            <IconifyIcon icon="bx:wifi-off" className="me-1" />
            <strong>Working Offline:</strong> Templates will be saved locally until the API is available.
          </Alert>
        )}

        {apiError && !isOfflineMode && (
          <Alert variant="info" className="mb-3">
            <IconifyIcon icon="bx:info-circle" className="me-1" />
            <strong>Note:</strong> The API endpoint is not available, but you can still create templates.
          </Alert>
        )}

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="builder">Template Builder</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="settings">Settings</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="builder">
              <Form onSubmit={handleSubmit}>
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

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Template Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Tenant Agreement"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Simple Form Builder (Fallback if PdfTemplateBuilder isn't ready) */}
                <Row>
                  <Col md={12}>
                    <div className="border rounded p-3 bg-light mb-3">
                      <label className="form-label fw-medium">Form Builder</label>
                      <div className="alert alert-info">
                        <p className="mb-0">
                          <IconifyIcon icon="bx:info-circle" className="me-1" />
                          PDF template builder is being configured. For now, you can create basic templates.
                        </p>
                      </div>
                      
                      {/* Simple field adder as fallback */}
                      <div className="mb-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            const newField = {
                              id: `field_${Date.now()}`,
                              type: 'text',
                              label: 'New Field',
                              required: false
                            };
                            setFormData(prev => ({
                              ...prev,
                              pdf_fields: [...prev.pdf_fields, newField]
                            }));
                          }}
                        >
                          <IconifyIcon icon="bi:plus" className="me-1" />
                          Add Field
                        </Button>
                      </div>
                      
                      {/* Show added fields */}
                      {formData.pdf_fields.length > 0 && (
                        <div className="mt-3">
                          <h6>Added Fields:</h6>
                          <ul className="list-group">
                            {formData.pdf_fields.map((field, index) => (
                              <li key={field.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{field.label} ({field.type})</span>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => {
                                    const updatedFields = formData.pdf_fields.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      pdf_fields: updatedFields
                                    }));
                                  }}
                                >
                                  <IconifyIcon icon="bx:trash" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="settings">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Document Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe this document template..."
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Require all fields to be completed"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      require_all_fields: e.target.checked 
                    }))}
                  />
                </Form.Group>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              {isOfflineMode ? 'Saving Locally...' : (editMode ? 'Updating...' : 'Creating...')}
            </>
          ) : (
            <>
              <IconifyIcon icon={editMode ? "bx:save" : "bi:save"} className="me-1" />
              {isOfflineMode ? 'Save Locally' : (editMode ? 'Save Changes' : 'Save Template')}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateDocumentModal;