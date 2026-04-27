import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import UnsignedDocumentsListView from './UnsignedDocumentsListView';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const UnsignedDocumentsList = ({ 
  documents, 
  refreshDocuments, 
  tenantSlug,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRemindModal, setShowRemindModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [remindLoading, setRemindLoading] = useState(false);
  const [remindError, setRemindError] = useState(null);
  const [remindSuccess, setRemindSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure documents is always an array
  const documentsArray = Array.isArray(documents) ? documents : [];

  const filteredDocuments = documentsArray.filter(doc => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const documentName = doc.document?.name?.toLowerCase() || '';
    const tenantName = `${doc.tenant?.first_name || ''} ${doc.tenant?.last_name || ''}`.toLowerCase();
    const filename = doc.document?.filename?.toLowerCase() || '';
    
    return (
      documentName.includes(searchTermLower) ||
      tenantName.includes(searchTermLower) ||
      filename.includes(searchTermLower)
    );
  });

  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setDeleteError(null);
    setDeleteSuccess(false);
    setShowDeleteModal(true);
  };

  const handleRemindClick = (document) => {
    setSelectedDocument(document);
    setRemindError(null);
    setRemindSuccess(false);
    setShowRemindModal(true);
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

      // API to delete/retract document - adjust endpoint as needed
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/retract/${selectedDocument.uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDeleteSuccess('Document retracted successfully!');
      refreshDocuments();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
      }, 1500);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to retract document');
      console.error('Error retracting document:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemindConfirm = async () => {
    setRemindLoading(true);
    setRemindError(null);

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

      // API to remind tenant - adjust endpoint as needed
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/remind`,
        {
          document_uuid: selectedDocument.document.uuid,
          tenant_uuid: selectedDocument.tenant.uuid
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setRemindSuccess('Reminder sent successfully!');
      
      setTimeout(() => {
        setShowRemindModal(false);
        setRemindSuccess(false);
      }, 1500);
      
    } catch (error) {
      setRemindError(error.response?.data?.message || 'Failed to send reminder');
      console.error('Error sending reminder:', error);
    } finally {
      setRemindLoading(false);
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
                        placeholder="Search documents or tenants..." 
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
                    Showing {documentsArray.length} of {totalItems} unsigned documents
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {documentsArray.length > 0 ? (
        <>
          <UnsignedDocumentsListView 
            documents={filteredDocuments}
            onDeleteClick={handleDeleteClick}
            onRemindClick={handleRemindClick}
            tenantSlug={tenantSlug}
          />
          {renderPagination()}
        </>
      ) : (
        <div className="alert alert-info mt-3">No unsigned documents found</div>
      )}

      {/* Delete/Retract Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Retract Document</Modal.Title>
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
          
          {!deleteSuccess && selectedDocument && (
            <>
              <p>Are you sure you want to retract this document from the tenant?</p>
              <div className="alert alert-warning">
                <strong>Document:</strong> {selectedDocument.document?.name}<br />
                <strong>Tenant:</strong> {selectedDocument.tenant?.first_name} {selectedDocument.tenant?.last_name}
              </div>
              <p className="text-muted">This will remove the document from the tenant's pending documents list.</p>
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
                Retracting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:undo" className="me-1" />
                Retract Document
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Remind Modal */}
      <Modal show={showRemindModal} onHide={() => setShowRemindModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {remindError && (
            <Alert variant="danger" onClose={() => setRemindError(null)} dismissible>
              {remindError}
            </Alert>
          )}
          
          {remindSuccess && (
            <Alert variant="success">
              {remindSuccess}
            </Alert>
          )}
          
          {!remindSuccess && selectedDocument && (
            <>
              <p>Send a reminder to the tenant about this unsigned document?</p>
              <div className="alert alert-info">
                <strong>Document:</strong> {selectedDocument.document?.name}<br />
                <strong>Tenant:</strong> {selectedDocument.tenant?.first_name} {selectedDocument.tenant?.last_name}<br />
                <strong>Email:</strong> {selectedDocument.tenant?.email || 'N/A'}
              </div>
              <p className="text-muted">The tenant will receive a notification/email reminder.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemindModal(false)} disabled={remindLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRemindConfirm}
            disabled={remindLoading || remindSuccess}
          >
            {remindLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Sending...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:bell" className="me-1" />
                Send Reminder
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UnsignedDocumentsList;