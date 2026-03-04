import { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination, Form, Tabs, Tab } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TenantUnsignedDocumentsListView from './TenantUnsignedDocumentsListView';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';

const TenantUnsignedDocumentsList = ({ 
  documents, 
  refreshDocuments, 
  tenantSlug,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 595, height: 842 });
  
  // Signature states
  const [signatureData, setSignatureData] = useState({
    signer_name: '',
    page: 1,
    name_x: null,
    name_y: null,
    signature_x: null,
    signature_y: null
  });
  
  const [signatureImage, setSignatureImage] = useState(null);
  const [activeTab, setActiveTab] = useState('signature');
  const [selectedField, setSelectedField] = useState(null); // 'name' or 'signature'
  const [clickPosition, setClickPosition] = useState({ x: null, y: null });
  const [signingDocumentId, setSigningDocumentId] = useState(null); // Track which document is loading
  
  const signatureRef = useRef();
  const pdfPreviewRef = useRef();
  const { user } = useAuthContext();

  // Ensure documents is always an array
  const documentsArray = Array.isArray(documents) ? documents : [];

  const filteredDocuments = documentsArray.filter(doc => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const documentName = doc.document?.name?.toLowerCase() || '';
    const filename = doc.document?.filename?.toLowerCase() || '';
    
    return (
      documentName.includes(searchTermLower) ||
      filename.includes(searchTermLower)
    );
  });

  // Function to load the actual document
  const loadDocument = async (documentUuid) => {
    try {
      setDocumentLoading(true);
      setDocumentError(null);
      
      if (!user?.token || !tenantSlug) {
        throw new Error('Authentication required');
      }

      // Call the API to get the document
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/documents/${documentUuid}/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob' // Important: receive as blob
        }
      );

      // Create a URL for the PDF blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      // Try to get PDF dimensions (this is approximate)
      // In a real app, you might use pdf-lib or pdf.js to get exact dimensions
      setPdfDimensions({ width: 595, height: 842 }); // Default A4
      
      setDocumentLoading(false);
      return url;
      
    } catch (err) {
      console.error('Error loading document:', err);
      setDocumentError(err.response?.data?.message || 'Failed to load document');
      setDocumentLoading(false);
      return null;
    }
  };

  const handleSignClick = async (document) => {
    setSigningDocumentId(document.uuid); // Set loading for this document
    setSelectedDocument(document);
    setSignatureData({
      signer_name: '',
      page: 1,
      name_x: null,
      name_y: null,
      signature_x: null,
      signature_y: null
    });
    setSignatureImage(null);
    setError(null);
    setSuccess(false);
    setActiveTab('signature');
    setSelectedField(null);
    setClickPosition({ x: null, y: null });
    setPdfUrl(null);
    setDocumentError(null);
    
    // Get the document UUID from document.document.uuid
    const documentUuid = document.document?.uuid;
    
    if (!documentUuid) {
      setError('Document UUID not found. Please contact support.');
      setSigningDocumentId(null); // Reset loading
      return;
    }
    
    try {
      // Load the actual document
      const url = await loadDocument(documentUuid);
      if (url) {
        setShowSignModal(true);
      } else {
        setError('Failed to load document. Please try again.');
      }
    } catch (err) {
      setError('Failed to load document. Please try again.');
    } finally {
      setSigningDocumentId(null); // Reset loading when done
    }
  };

  // Handle click on PDF preview to set coordinates
  const handlePdfClick = (e) => {
    if (!pdfPreviewRef.current || !selectedField) return;
    
    const rect = pdfPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to PDF coordinates
    // Note: This is an approximation. For exact coordinates, you'd need PDF.js
    const scaleX = pdfDimensions.width / rect.width;
    const scaleY = pdfDimensions.height / rect.height;
    
    const pdfX = Math.round(x * scaleX);
    const pdfY = Math.round(pdfDimensions.height - (y * scaleY)); // PDF Y is from bottom
    
    setClickPosition({ x, y });
    
    if (selectedField === 'name') {
      setSignatureData(prev => ({
        ...prev,
        name_x: pdfX,
        name_y: pdfY
      }));
      setSelectedField(null);
    } else if (selectedField === 'signature') {
      setSignatureData(prev => ({
        ...prev,
        signature_x: pdfX,
        signature_y: pdfY
      }));
      setSelectedField(null);
    }
  };

  // Clear signature
  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureImage(null);
    }
  };

  // Save signature from canvas
  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataUrl = signatureRef.current.toDataURL();
      setSignatureImage(dataUrl);
      setError(null);
    } else {
      setError('Please draw your signature first');
    }
  };

  const handleSignConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!selectedDocument?.document?.uuid) {
        throw new Error('Document UUID not found');
      }

      // Validate all required fields
      if (!signatureData.signer_name.trim()) {
        throw new Error('Please enter your name');
      }

      if (!signatureData.name_x || !signatureData.name_y) {
        throw new Error('Please set name position on the document');
      }

      if (!signatureImage) {
        throw new Error('Please draw and save your signature');
      }

      if (!signatureData.signature_x || !signatureData.signature_y) {
        throw new Error('Please set signature position on the document');
      }

      // Prepare payload - Use document.document.uuid for document_uuid
      const payload = {
        document_uuid: selectedDocument.document.uuid, // Correct UUID from document object
        page: signatureData.page,
        signer_name: signatureData.signer_name,
        name_x: signatureData.name_x,
        name_y: signatureData.name_y,
        signature: signatureImage,
        signature_x: signatureData.signature_x,
        signature_y: signatureData.signature_y
      };

      // Call the actual sign API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/sign`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess('Document signed successfully!');
      
      // Clean up blob URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      // Refresh the documents list
      refreshDocuments();
      
      setTimeout(() => {
        setShowSignModal(false);
        resetSignatureForm();
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to sign document';
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset signature form and clean up
  const resetSignatureForm = () => {
    setSignatureData({
      signer_name: '',
      page: 1,
      name_x: null,
      name_y: null,
      signature_x: null,
      signature_y: null
    });
    setSignatureImage(null);
    setSelectedField(null);
    setClickPosition({ x: null, y: null });
    setSigningDocumentId(null); // Reset loading state
    
    // Clean up blob URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Function to create PDF viewer URL without browser controls
  const getPdfViewerUrl = (blobUrl) => {
    return blobUrl;
  };

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search documents..." 
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          onPageChange(1);
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">
                    Showing {documentsArray.length} of {totalItems} pending documents
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {documentsArray.length > 0 ? (
        <>
          <TenantUnsignedDocumentsListView 
            documents={filteredDocuments}
            onSignClick={handleSignClick}
            tenantSlug={tenantSlug}
            signingDocumentId={signingDocumentId} // Pass loading state
          />
          {renderPagination()}
        </>
      ) : (
        !loading && (
          <Card className="mt-3">
            <CardBody className="text-center py-5">
              <IconifyIcon icon="bx:check-circle" style={{ fontSize: '48px', color: '#28a745' }} />
              <h4 className="mt-3">All Caught Up!</h4>
              <p className="text-muted">You have no pending documents requiring your signature.</p>
            </CardBody>
          </Card>
        )
      )}

      {/* Sign Document Modal */}
      <Modal show={showSignModal} onHide={() => {
        setShowSignModal(false);
        resetSignatureForm();
      }} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="bx:edit" className="me-2" />
            Sign Document: {selectedDocument?.document?.name || 'Document'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <IconifyIcon icon="bx:error" className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <IconifyIcon icon="bx:check-circle" className="me-2" />
              {success}
            </Alert>
          )}

          {!success && selectedDocument && (
            <>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="signature" title="1. Enter Details">
                  <div className="mt-3">
                    <div className="border rounded p-3 mb-3">
                      <h6>Step 1: Enter Your Name</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          value={signatureData.signer_name}
                          onChange={(e) => setSignatureData(prev => ({
                            ...prev,
                            signer_name: e.target.value
                          }))}
                          placeholder="Enter your full name"
                          className="mb-2"
                        />
                        <Button 
                          variant={signatureData.signer_name ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => {
                            if (signatureData.signer_name) {
                              setSelectedField('name');
                              setActiveTab('preview');
                            } else {
                              setError('Please enter your name first');
                            }
                          }}
                          disabled={!signatureData.signer_name}
                        >
                          <IconifyIcon icon="bx:crosshair" className="me-1" />
                          Set Name Position
                        </Button>
                      </Form.Group>
                    </div>

                    <div className="border rounded p-3 mb-3">
                      <h6>Step 2: Draw Your Signature</h6>
                      <div className="text-center mb-3">
                        <div 
                          style={{ 
                            border: '2px solid #dee2e6', 
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            padding: '10px',
                            display: 'inline-block'
                          }}
                        >
                          <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            backgroundColor="white"
                            canvasProps={{
                              width: 400,
                              height: 150,
                              className: 'sigCanvas'
                            }}
                          />
                        </div>
                        <div className="mt-2">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={handleClearSignature}
                            className="me-2"
                          >
                            <IconifyIcon icon="bx:eraser" className="me-1" />
                            Clear
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleSaveSignature}
                          >
                            <IconifyIcon icon="bx:save" className="me-1" />
                            Save Signature
                          </Button>
                        </div>
                        {signatureImage && (
                          <div className="mt-2">
                            <Button 
                              variant="success"
                              size="sm"
                              onClick={() => {
                                setSelectedField('signature');
                                setActiveTab('preview');
                              }}
                            >
                              <IconifyIcon icon="bx:crosshair" className="me-1" />
                              Set Signature Position
                            </Button>
                          </div>
                        )}
                      </div>
                      {signatureImage && (
                        <Alert variant="success" className="mt-2">
                          <IconifyIcon icon="bx:check" className="me-2" />
                          Signature saved! Click "Set Signature Position" above.
                          {signatureImage && (
                            <div className="mt-2 text-center">
                              <small>Preview:</small>
                              <div style={{
                                display: 'inline-block',
                                marginLeft: '10px',
                                border: '1px solid #dee2e6',
                                padding: '5px',
                                backgroundColor: 'white'
                              }}>
                                <img 
                                  src={signatureImage} 
                                  alt="Signature preview" 
                                  style={{ 
                                    height: '30px',
                                    maxWidth: '150px'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </Alert>
                      )}
                    </div>
                  </div>
                </Tab>
                
                <Tab eventKey="preview" title="2. Set Positions">
                  <div className="mt-3">
                    {documentLoading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading document...</p>
                      </div>
                    ) : documentError ? (
                      <Alert variant="danger">
                        <IconifyIcon icon="bx:error" className="me-2" />
                        {documentError}
                      </Alert>
                    ) : pdfUrl ? (
                      <div className="border rounded p-3 mb-3">
                        <h6>
                          {selectedField === 'name' 
                            ? 'Click where you want your NAME to appear' 
                            : selectedField === 'signature'
                            ? 'Click where you want your SIGNATURE to appear'
                            : 'Set Positions on Document'}
                        </h6>
                        
                        <div className="mb-3">
                          <Alert variant="info">
                            <IconifyIcon icon="bx:info-circle" className="me-2" />
                            <strong>Document loaded:</strong> {selectedDocument?.document?.name}
                            <div className="mt-1">
                              <small>
                                Click on the document image below to set exact positions.
                              </small>
                            </div>
                          </Alert>
                        </div>
                        
                        <div 
                          ref={pdfPreviewRef}
                          onClick={handlePdfClick}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '600px',
                            border: '1px solid #dee2e6',
                            backgroundColor: '#f8f9fa',
                            cursor: selectedField ? 'crosshair' : 'not-allowed',
                            overflow: 'hidden'
                          }}
                        >
                          <object
                            data={getPdfViewerUrl(pdfUrl)}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            style={{
                              border: 'none',
                              pointerEvents: selectedField ? 'none' : 'auto'
                            }}
                          >
                            <Alert variant="warning" className="m-3">
                              Your browser doesn't support PDF preview. 
                              <a 
                                href={pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ms-2"
                              >
                                Click here to download the document
                              </a>
                            </Alert>
                          </object>
                          
                          {/* Position Markers */}
                          {signatureData.name_x && signatureData.name_y && (
                            <div style={{
                              position: 'absolute',
                              left: `${(signatureData.name_x / pdfDimensions.width) * 100}%`,
                              top: `${(1 - (signatureData.name_y / pdfDimensions.height)) * 100}%`,
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(0, 123, 255, 0.9)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              zIndex: 100,
                              pointerEvents: 'none',
                              border: '2px solid white',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                              whiteSpace: 'nowrap'
                            }}>
                              <IconifyIcon icon="bx:user" className="me-1" />
                              NAME
                              <div style={{
                                position: 'absolute',
                                bottom: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '0',
                                height: '0',
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderTop: '8px solid rgba(0, 123, 255, 0.9)'
                              }}></div>
                            </div>
                          )}
                          
                          {signatureData.signature_x && signatureData.signature_y && (
                            <div style={{
                              position: 'absolute',
                              left: `${(signatureData.signature_x / pdfDimensions.width) * 100}%`,
                              top: `${(1 - (signatureData.signature_y / pdfDimensions.height)) * 100}%`,
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(40, 167, 69, 0.9)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              zIndex: 100,
                              pointerEvents: 'none',
                              border: '2px solid white',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                              whiteSpace: 'nowrap'
                            }}>
                              <IconifyIcon icon="bx:edit" className="me-1" />
                              SIGNATURE
                              <div style={{
                                position: 'absolute',
                                bottom: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '0',
                                height: '0',
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderTop: '8px solid rgba(40, 167, 69, 0.9)'
                              }}></div>
                            </div>
                          )}
                          
                          {selectedField && (
                            <div style={{
                              position: 'absolute',
                              top: '15px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: 'rgba(255, 193, 7, 0.95)',
                              color: '#333',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              zIndex: 100,
                              border: '2px solid #ffc107',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
                            }}>
                              <IconifyIcon icon="bx:crosshair" className="me-2" />
                              Click anywhere on the document to set {selectedField} position
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <Alert variant={selectedField ? 'warning' : 'info'}>
                            <IconifyIcon icon={selectedField ? 'bx:crosshair' : 'bx:info-circle'} className="me-2" />
                            {selectedField 
                              ? `Click anywhere on the document above to set ${selectedField} position`
                              : 'Go back to "Enter Details" tab and click "Set Name Position" or "Set Signature Position"'}
                          </Alert>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="warning">
                        <IconifyIcon icon="bx:error" className="me-2" />
                        Document not loaded. Please try again.
                      </Alert>
                    )}
                    
                    <div className="border rounded p-3">
                      <h6>Current Status</h6>
                      <table className="table table-sm mb-0">
                        <tbody>
                          <tr>
                            <td><strong>Your Name:</strong></td>
                            <td>{signatureData.signer_name || 'Not set'}</td>
                            <td>
                              {signatureData.signer_name ? (
                                <IconifyIcon icon="bx:check-circle" className="text-success" />
                              ) : (
                                <IconifyIcon icon="bx:circle" className="text-muted" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Name Position:</strong></td>
                            <td>
                              {signatureData.name_x && signatureData.name_y 
                                ? `(${signatureData.name_x}, ${signatureData.name_y})` 
                                : 'Not set'}
                            </td>
                            <td>
                              {signatureData.name_x && signatureData.name_y ? (
                                <IconifyIcon icon="bx:check-circle" className="text-success" />
                              ) : (
                                <IconifyIcon icon="bx:circle" className="text-muted" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Signature:</strong></td>
                            <td>{signatureImage ? 'Saved' : 'Not saved'}</td>
                            <td>
                              {signatureImage ? (
                                <IconifyIcon icon="bx:check-circle" className="text-success" />
                              ) : (
                                <IconifyIcon icon="bx:circle" className="text-muted" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Signature Position:</strong></td>
                            <td>
                              {signatureData.signature_x && signatureData.signature_y 
                                ? `(${signatureData.signature_x}, ${signatureData.signature_y})` 
                                : 'Not set'}
                            </td>
                            <td>
                              {signatureData.signature_x && signatureData.signature_y ? (
                                <IconifyIcon icon="bx:check-circle" className="text-success" />
                              ) : (
                                <IconifyIcon icon="bx:circle" className="text-muted" />
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Document UUID:</strong></td>
                            <td colSpan="2">
                              <small className="text-muted">
                                {selectedDocument?.document?.uuid || 'N/A'}
                              </small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tab>
              </Tabs>

              <Alert variant="info" className="mt-3">
                <IconifyIcon icon="bx:info-circle" className="me-2" />
                <strong>Note:</strong> Click on the actual document to set exact positions for your name and signature.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowSignModal(false);
              resetSignatureForm();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSignConfirm}
            disabled={loading || 
              !signatureData.signer_name || 
              !signatureData.name_x || 
              !signatureData.name_y || 
              !signatureImage || 
              !signatureData.signature_x || 
              !signatureData.signature_y}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Signing...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:edit" className="me-2" />
                Sign Document
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TenantUnsignedDocumentsList;