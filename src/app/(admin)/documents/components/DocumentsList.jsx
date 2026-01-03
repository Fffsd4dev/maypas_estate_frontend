// import { useState } from 'react';
// import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import DocumentsListView from './DocumentsListView';
// import CreateDocumentModal from './CreateDocumentModal';
// import { useAuthContext } from '@/context/useAuthContext';
// import axios from 'axios';

// const DocumentsList = ({ documents, refreshDocuments, tenantSlug }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const { user } = useAuthContext();

//   // Ensure documents is always an array
//   const documentsArray = Array.isArray(documents) ? documents : [];

//   const handleAddClick = () => {
//     setEditMode(false);
//     setSelectedDocument(null);
//     setShowModal(true);
//   };

//   const handleEditClick = (document) => {
//     setEditMode(true);
//     setSelectedDocument(document);
//     setShowModal(true);
//   };

//   const handlePreviewClick = (document) => {
//     setSelectedDocument(document);
//     setShowPreviewModal(true);
//   };

//   const handleDeleteClick = (document) => {
//     setSelectedDocument(document);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!user?.token) {
//         throw new Error('No authentication token found');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/delete/${selectedDocument.id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json',
//             "Accept": "application/json",
//           }
//         }
//       );
      
//       setSuccess('Document template deleted successfully!');
//       refreshDocuments();
      
//       setTimeout(() => {
//         setShowDeleteModal(false);
//         setSuccess(false);
//       }, 1500);
      
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to delete document template');
//       console.error('Error deleting document:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredDocuments = documentsArray.filter(document => 
//     document.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//                         placeholder="Search document templates..." 
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </form>
//                 </div>
//                 <div>
//                   <button 
//                     className="btn btn-primary"
//                     onClick={handleAddClick}
//                   >
//                     <IconifyIcon icon="bi:plus" className="me-1" />
//                     Add Template
//                   </button>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {documentsArray.length > 0 ? (
//         <DocumentsListView 
//           documents={filteredDocuments}
//           onEditClick={handleEditClick}
//           onPreviewClick={handlePreviewClick}
//           onDeleteClick={handleDeleteClick}
//         />
//       ) : (
//         <div className="alert alert-info mt-3">No document templates found</div>
//       )}

//       <CreateDocumentModal 
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         refreshDocuments={refreshDocuments}
//         editMode={editMode}
//         documentToEdit={selectedDocument}
//         tenantSlug={tenantSlug}
//       />

//       {/* Preview Modal */}
//       <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Preview: {selectedDocument?.name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedDocument && (
//             <div className="border rounded p-3 bg-light">
//               <h6 className="mb-3">Form Structure Preview</h6>
//               <pre style={{ maxHeight: '400px', overflowY: 'auto', fontSize: '12px' }}>
//                 {JSON.stringify(selectedDocument.form_json, null, 2)}
//               </pre>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {success && (
//             <Alert variant="success">
//               {success}
//             </Alert>
//           )}
          
//           {!success && (
//             <>
//               Are you sure you want to delete the document template <strong>{selectedDocument?.name}</strong>? This action cannot be undone.
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDeleteConfirm}
//             disabled={loading || success}
//           >
//             {loading ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-1" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon="bx:trash" className="me-1" />
//                 Delete
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default DocumentsList;



import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import DocumentsListView from './DocumentsListView';
import CreateDocumentModal from './CreateDocumentModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const DocumentsList = ({ 
  documents, 
  refreshDocuments, 
  tenantSlug, 
  apiError,
  loading 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  const documentsArray = Array.isArray(documents) ? documents : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedDocument(null);
    setShowModal(true);
  };

  const handleEditClick = (document) => {
    setEditMode(true);
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLocalLoading(true);
    setLocalError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/delete/${selectedDocument.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Document template deleted successfully!');
      refreshDocuments();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Failed to delete document template');
      console.error('Error deleting document:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const filteredDocuments = documentsArray.filter(document => 
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                        placeholder="Search document templates..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={documentsArray.length === 0}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                    disabled={localLoading}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Template
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Loading state */}
      {loading && !apiError && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading documents...</p>
        </div>
      )}

      {/* Empty state with API error */}
      {apiError && documentsArray.length === 0 && !loading && (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <IconifyIcon icon="bx:file" style={{ fontSize: '48px', color: '#6c757d' }} />
            </div>
            <h5>No documents available</h5>
            <p className="text-muted">
              {apiError.includes('endpoint not found') 
                ? 'The documents API is not configured yet.' 
                : 'Unable to load existing documents.'}
            </p>
            <p className="text-muted">
              You can still create new document templates.
            </p>
            <Button 
              variant="primary" 
              onClick={handleAddClick}
              className="mt-2"
            >
              <IconifyIcon icon="bi:plus" className="me-1" />
              Create Your First Template
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Empty state without API error */}
      {!apiError && documentsArray.length === 0 && !loading && (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <IconifyIcon icon="bx:file" style={{ fontSize: '48px', color: '#6c757d' }} />
            </div>
            <h5>No document templates yet</h5>
            <p className="text-muted">
              Get started by creating your first document template.
            </p>
            <Button 
              variant="primary" 
              onClick={handleAddClick}
              className="mt-2"
            >
              <IconifyIcon icon="bi:plus" className="me-1" />
              Create First Template
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Show documents if we have any */}
      {documentsArray.length > 0 && (
        <>
          <DocumentsListView 
            documents={filteredDocuments}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
          
          {filteredDocuments.length === 0 && searchTerm && (
            <div className="alert alert-info mt-3">
              No documents found matching "{searchTerm}"
            </div>
          )}
        </>
      )}

      <CreateDocumentModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshDocuments={refreshDocuments}
        editMode={editMode}
        documentToEdit={selectedDocument}
        tenantSlug={tenantSlug}
        apiError={apiError}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {localError && (
            <Alert variant="danger" onClose={() => setLocalError(null)} dismissible>
              {localError}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          {!success && (
            <>
              Are you sure you want to delete the document template <strong>{selectedDocument?.name}</strong>? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={localLoading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={localLoading || success}
          >
            {localLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DocumentsList;