// import { useState } from 'react';
// import { Card, CardBody, Col, Row, Modal, Button, Alert, Pagination } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import TenantSignedDocumentsListView from './TenantSignedDocumentsListView';
// import { useAuthContext } from '@/context/useAuthContext';
// import axios from 'axios';

// const TenantSignedDocumentsList = ({ 
//   documents, 
//   refreshDocuments, 
//   tenantSlug,
//   currentPage,
//   totalPages,
//   totalItems,
//   onPageChange
// }) => {
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [downloading, setDownloading] = useState(false);
//   const { user } = useAuthContext();

//   // Ensure documents is always an array
//   const documentsArray = Array.isArray(documents) ? documents : [];

//   const filteredDocuments = documentsArray.filter(doc => {
//     if (!searchTerm) return true;
    
//     const searchTermLower = searchTerm.toLowerCase();
//     const filename = doc.filename?.toLowerCase() || '';
//     const uuid = doc.uuid?.toLowerCase() || '';
    
//     return (
//       filename.includes(searchTermLower) ||
//       uuid.includes(searchTermLower)
//     );
//   });

//   const handleViewClick = (document) => {
//     // Since we don't have detailed info, we'll use what we have
//     setSelectedDocument({
//       ...document,
//       // Create a readable name from filename
//       document_name: document.filename 
//         ? document.filename
//             .replace('signed_', '')
//             .replace(/_/g, ' ')
//             .replace('.pdf', '')
//         : 'Signed Document',
//       signed_date: new Date().toLocaleDateString() // You might want to get this from another endpoint
//     });
//     setShowViewModal(true);
//   };

//   const handleDownloadClick = (document) => {
//     setSelectedDocument(document);
//     setShowDownloadModal(true);
//   };

//   const handleDownloadSigned = async () => {
//     if (!selectedDocument?.uuid || !user?.token) {
//       alert('Cannot download: Missing document information');
//       return;
//     }

//     try {
//       setDownloading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/signed/download/${selectedDocument.uuid}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//           },
//           responseType: 'blob'
//         }
//       );

//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', selectedDocument.filename || `signed_document_${selectedDocument.uuid.substring(0, 8)}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setDownloading(false);
//       setShowDownloadModal(false);
//     } catch (error) {
//       console.error('Error downloading signed document:', error);
//       alert('Failed to download signed document. Please try again.');
//       setDownloading(false);
//     }
//   };

//   const handleDownloadCertificate = async () => {
//     if (!selectedDocument?.uuid || !user?.token) {
//       alert('Cannot download: Missing document information');
//       return;
//     }

//     try {
//       setDownloading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/certificate/${selectedDocument.uuid}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//           },
//           responseType: 'blob'
//         }
//       );

//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `certificate_${selectedDocument.uuid.substring(0, 8)}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       setDownloading(false);
//       setShowDownloadModal(false);
//     } catch (error) {
//       console.error('Error downloading certificate:', error);
//       alert('Certificate download is not available at this time.');
//       setDownloading(false);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     onPageChange(pageNumber);
//     window.scrollTo(0, 0);
//   };

//   const renderPagination = () => {
//     if (totalPages <= 1) return null;

//     const items = [];
//     const maxVisiblePages = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     // Previous button
//     items.push(
//       <Pagination.Prev
//         key="prev"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       />
//     );

//     // First page
//     if (startPage > 1) {
//       items.push(
//         <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
//           1
//         </Pagination.Item>
//       );
//       if (startPage > 2) {
//         items.push(<Pagination.Ellipsis key="start-ellipsis" />);
//       }
//     }

//     // Page numbers
//     for (let page = startPage; page <= endPage; page++) {
//       items.push(
//         <Pagination.Item
//           key={page}
//           active={page === currentPage}
//           onClick={() => handlePageChange(page)}
//         >
//           {page}
//         </Pagination.Item>
//       );
//     }

//     // Last page
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         items.push(<Pagination.Ellipsis key="end-ellipsis" />);
//       }
//       items.push(
//         <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
//           {totalPages}
//         </Pagination.Item>
//       );
//     }

//     // Next button
//     items.push(
//       <Pagination.Next
//         key="next"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       />
//     );

//     return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
//   };

//   return (
//     <>
//       <Row>
//         <Col xs={12}>
//           <Card>
//             <CardBody>
//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
//                 <div>
//                   <form className="d-flex flex-wrap align-items-center gap-2">
//                     <div className="search-bar me-3">
//                       <span>
//                         <IconifyIcon icon="bx:search-alt" className="mb-1" />
//                       </span>
//                       <input 
//                         type="search" 
//                         className="form-control" 
//                         placeholder="Search by filename or ID..." 
//                         value={searchTerm}
//                         onChange={(e) => {
//                           setSearchTerm(e.target.value);
//                           onPageChange(1);
//                         }}
//                       />
//                     </div>
//                   </form>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <span className="text-muted">
//                     Showing {filteredDocuments.length} of {totalItems} signed documents
//                   </span>
//                   <Button 
//                     variant="outline-primary" 
//                     size="sm" 
//                     onClick={refreshDocuments}
//                   >
//                     <IconifyIcon icon="bx:refresh" className="me-1" />
//                     Refresh
//                   </Button>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {documentsArray.length > 0 ? (
//         <>
//           <TenantSignedDocumentsListView 
//             documents={filteredDocuments}
//             onViewClick={handleViewClick}
//             onDownloadClick={handleDownloadClick}
//           />
//           {renderPagination()}
//         </>
//       ) : (
//         <Card className="mt-3">
//           <CardBody className="text-center py-5">
//             <IconifyIcon icon="bx:folder-open" style={{ fontSize: '48px', color: '#6c757d' }} />
//             <h4 className="mt-3">No Signed Documents</h4>
//             <p className="text-muted">You haven't signed any documents yet.</p>
//             <Button variant="outline-primary" href={`/${tenantSlug}/tenant-documents/unsigned`}>
//               <IconifyIcon icon="bx:file-edit" className="me-2" />
//               View Pending Documents
//             </Button>
//           </CardBody>
//         </Card>
//       )}

//       {/* View Document Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <IconifyIcon icon="bx:file" className="me-2" />
//             Document Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedDocument && (
//             <div className="row">
//               <div className="col-md-12">
//                 <div className="mb-4">
//                   <h6>Document Information</h6>
//                   <p><strong>Document Name:</strong> {selectedDocument.document_name}</p>
//                   <p><strong>File:</strong> {selectedDocument.filename || 'N/A'}</p>
//                   <p><strong>Document ID:</strong> 
//                     <small className="text-muted ms-2">
//                       {selectedDocument.uuid}
//                     </small>
//                   </p>
//                   <p><strong>Status:</strong> 
//                     <span className="badge bg-success ms-2">
//                       <IconifyIcon icon="bx:check-circle" className="me-1" />
//                       Signed
//                     </span>
//                   </p>
//                 </div>
                
//                 <div className="border rounded p-3">
//                   <h6>Document Preview</h6>
//                   <div className="text-center" style={{ minHeight: '300px' }}>
//                     {selectedDocument.filename ? (
//                       <div className="alert alert-info">
//                         <IconifyIcon icon="bx:info-circle" className="me-2" />
//                         Document preview would be displayed here
//                       </div>
//                     ) : (
//                       <Alert variant="warning">
//                         <IconifyIcon icon="bx:error" className="me-2" />
//                         Document file information not available.
//                       </Alert>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>
//             Close
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => {
//               setShowViewModal(false);
//               handleDownloadClick(selectedDocument);
//             }}
//           >
//             <IconifyIcon icon="bx:download" className="me-2" />
//             Download Options
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Download Options Modal */}
//       <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Download Options</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedDocument && (
//             <>
//               <p className="mb-3">Select which file to download:</p>
//               <div className="d-grid gap-2">
//                 <Button 
//                   variant="outline-success" 
//                   onClick={handleDownloadSigned}
//                   disabled={downloading}
//                 >
//                   {downloading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Downloading...
//                     </>
//                   ) : (
//                     <>
//                       <IconifyIcon icon="bx:download" className="me-2" />
//                       Download Signed Document
//                     </>
//                   )}
//                 </Button>
                
//                 <Button 
//                   variant="outline-info" 
//                   onClick={handleDownloadCertificate}
//                   disabled={downloading}
//                 >
//                   <IconifyIcon icon="bx:certificate" className="me-2" />
//                   Download Signing Certificate
//                 </Button>
//               </div>
              
//               <div className="mt-3">
//                 <small className="text-muted">
//                   <IconifyIcon icon="bx:info-circle" className="me-1" />
//                   Signed: The document with your signature<br />
//                   Certificate: Proof of signing with timestamp
//                 </small>
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDownloadModal(false)}>
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default TenantSignedDocumentsList;



import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Pagination, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TenantSignedDocumentsListView from './TenantSignedDocumentsListView';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const TenantSignedDocumentsList = ({ 
  documents, 
  refreshDocuments, 
  tenantSlug,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDocumentLoading, setViewDocumentLoading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [viewError, setViewError] = useState(null);
  const { user } = useAuthContext();

  // Ensure documents is always an array
  const documentsArray = Array.isArray(documents) ? documents : [];

  const filteredDocuments = documentsArray.filter(doc => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const filename = doc.filename?.toLowerCase() || '';
    const uuid = doc.uuid?.toLowerCase() || '';
    
    return (
      filename.includes(searchTermLower) ||
      uuid.includes(searchTermLower)
    );
  });

  const handleViewClick = async (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
    setViewDocumentLoading(true);
    setDocumentUrl(null);
    setViewError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!document?.uuid) {
        throw new Error('No document selected');
      }

      // Fetch the document using the view API
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/documents/signed/${document.uuid}/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
          responseType: 'blob'
        }
      );

      // Check if response is PDF
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/pdf')) {
        // Create blob URL for PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setDocumentUrl(url);
      } else {
        // Handle other file types
        const blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        setDocumentUrl(url);
      }
      
    } catch (error) {
      console.error('Error fetching document:', error);
      setViewError(error.response?.data?.message || error.message || 'Failed to load document');
    } finally {
      setViewDocumentLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    window.scrollTo(0, 0);
  };

  // Clean up blob URL when modal closes
  const handleModalClose = () => {
    if (documentUrl) {
      window.URL.revokeObjectURL(documentUrl);
    }
    setShowViewModal(false);
    setDocumentUrl(null);
    setViewError(null);
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
                        placeholder="Search by filename or ID..." 
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
                    Showing {filteredDocuments.length} of {totalItems} signed documents
                  </span>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={refreshDocuments}
                  >
                    <IconifyIcon icon="bx:refresh" className="me-1" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {documentsArray.length > 0 ? (
        <>
          <TenantSignedDocumentsListView 
            documents={filteredDocuments}
            onViewClick={handleViewClick}
          />
          {renderPagination()}
        </>
      ) : (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <IconifyIcon icon="bx:folder-open" style={{ fontSize: '48px', color: '#6c757d' }} />
            <h4 className="mt-3">No Signed Documents</h4>
            <p className="text-muted">You haven't signed any documents yet.</p>
            <Button variant="outline-primary" href={`/${tenantSlug}/tenant-documents/unsigned`}>
              <IconifyIcon icon="bx:file-edit" className="me-2" />
              View Pending Documents
            </Button>
          </CardBody>
        </Card>
      )}

      {/* View Document Modal */}
      <Modal show={showViewModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="bx:file" className="me-2" />
            {selectedDocument?.filename 
              ? selectedDocument.filename
                  .replace('signed_', '')
                  .replace(/_/g, ' ')
                  .replace('.pdf', '')
              : 'Signed Document'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewDocumentLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading document...</p>
            </div>
          ) : viewError ? (
            <Alert variant="danger">
              <IconifyIcon icon="bx:error-circle" className="me-2" />
              {viewError}
            </Alert>
          ) : documentUrl ? (
            <div className="document-viewer">
              <iframe
                src={documentUrl}
                style={{ width: '100%', height: '500px', border: 'none' }}
                title="Document Viewer"
              />
            </div>
          ) : (
            <div className="text-center py-5">
              <IconifyIcon icon="bx:file" style={{ fontSize: '48px', color: '#6c757d' }} />
              <p className="mt-3 text-muted">No document content available</p>
            </div>
          )}
          
          {selectedDocument && !viewDocumentLoading && !viewError && (
            <div className="mt-4 border-top pt-3">
              <h6>Document Information</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Document ID:</strong>
                  </p>
                  <small className="text-muted">
                    {selectedDocument.uuid}
                  </small>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Filename:</strong>
                  </p>
                  <small className="text-muted">
                    {selectedDocument.filename || 'N/A'}
                  </small>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TenantSignedDocumentsList;