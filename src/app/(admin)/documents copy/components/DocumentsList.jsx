import { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import DocumentsListView from './DocumentsListView';
import CreateDocumentModal from './CreateDocumentModal';
import SendDocumentModal from './SendDocumentModal'; // New component
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const DocumentsList = ({ 
  documents, 
  refreshDocuments, 
  tenantSlug,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false); // New state
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure documents is always an array
  const documentsArray = Array.isArray(documents) ? documents : [];

  const filteredDocuments = documentsArray.filter(document => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      document.name?.toLowerCase().includes(searchTermLower) ||
      document.filename?.toLowerCase().includes(searchTermLower) ||
      document.type?.toLowerCase().includes(searchTermLower) ||
      String(document.apartment_id || '').includes(searchTerm)
    );
  });

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setDeleteError(null);
    setDeleteSuccess(false);
    setShowDeleteModal(true);
  };

  // New handler for send button click
  const handleSendClick = (document) => {
    setSelectedDocument(document);
    setShowSendModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!selectedDocument?.uuid) {
        throw new Error('No document selected');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/delete/${selectedDocument.uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDeleteSuccess('Document deleted successfully!');
      refreshDocuments();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
      }, 1500);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete document');
      console.error('Error deleting document:', error);
    } finally {
      setDeleteLoading(false);
    }
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
                    Showing {documentsArray.length} of {totalItems} documents
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Upload Document
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {documentsArray.length > 0 ? (
        <>
          <DocumentsListView 
            documents={filteredDocuments}
            onDeleteClick={handleDeleteClick}
            onSendClick={handleSendClick} // Pass the send handler
            tenantSlug={tenantSlug}
          />
          {renderPagination()}
        </>
      ) : (
        <div className="alert alert-info mt-3">No documents found</div>
      )}

      <CreateDocumentModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshDocuments={refreshDocuments}
        tenantSlug={tenantSlug}
      />

      {/* Send Document Modal */}
      <SendDocumentModal 
        show={showSendModal}
        handleClose={() => setShowSendModal(false)}
        selectedDocument={selectedDocument}
        tenantSlug={tenantSlug}
      />

      {/* Delete Document Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" onClose={() => setDeleteError(null)} dismissible>
              {deleteError}
            </Alert>
          )}
          
          {deleteSuccess && (
            <Alert variant="success">
              {deleteSuccess}
            </Alert>
          )}
          
          {!deleteSuccess && (
            <>
              Are you sure you want to delete document <strong>"{selectedDocument?.name}"</strong>? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleteLoading || deleteSuccess}
          >
            {deleteLoading ? (
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