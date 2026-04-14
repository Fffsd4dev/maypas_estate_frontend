import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import BranchesListView from './BranchesListView';
import CreateBranchModal from './CreateBranchModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const BranchesList = ({ 
  locations, 
  branches, 
  selectedLocation, 
  onLocationChange,
  refreshBranches, 
  tenantSlug,
  loading 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthContext();

  const ITEMS_PER_PAGE = 15;

  const branchesArray = Array.isArray(branches) ? branches : [];

  const filteredBranches = branchesArray.filter(branch => {
    const searchTermLower = searchTerm.toLowerCase();
    return branch.name?.toLowerCase().includes(searchTermLower);
  });

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddClick = () => {
    if (!selectedLocation) {
      alert('Please select a location first');
      return;
    }
    setEditMode(false);
    setSelectedBranch(null);
    setShowModal(true);
  };

  const handleEditClick = (branch) => {
    setEditMode(true);
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const handleDeleteClick = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) throw new Error('No authentication token found');
      if (!tenantSlug) throw new Error('Tenant slug not found');
      if (!selectedBranch?.uuid) throw new Error('No branch selected');

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/delete/${selectedBranch.uuid}`,
        {}, // Empty body for delete operation
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setSuccess('Branch deleted successfully!');
      refreshBranches();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to delete this branch.');
      } else if (err.response?.status === 404) {
        setError('Branch not found. It may have been already deleted.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete branch');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

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
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div style={{ minWidth: '300px' }}>
                    <Form.Select 
                      value={selectedLocation?.uuid || ''}
                      onChange={(e) => onLocationChange(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select a Location</option>
                      {locations.map(location => (
                        <option key={location.uuid} value={location.uuid}>
                          {location.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  
                  {selectedLocation && (
                    <form className="d-flex flex-wrap align-items-center gap-2">
                      <div className="search-bar me-3">
                        <span>
                          <IconifyIcon icon="bx:search-alt" className="mb-1" />
                        </span>
                        <input 
                          type="search" 
                          className="form-control" 
                          placeholder="Search branches by name..." 
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </form>
                  )}
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  {selectedLocation && (
                    <>
                      <span className="text-muted">
                        Showing {paginatedBranches.length} of {filteredBranches.length} branches
                      </span>
                      <button 
                        className="btn btn-primary"
                        onClick={handleAddClick}
                      >
                        <IconifyIcon icon="bi:plus" className="me-1" />
                        Add Branch
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!selectedLocation && (
                <div className="alert alert-info mt-3 mb-0">
                  <IconifyIcon icon="bx:info-circle" className="me-2" />
                  Please select a location to view its branches
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {selectedLocation && (
        <>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading branches...</p>
            </div>
          ) : branchesArray.length > 0 ? (
            <>
              <BranchesListView 
                branches={paginatedBranches}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
              {renderPagination()}
            </>
          ) : (
            <div className="alert alert-info mt-3">
              No branches found for {selectedLocation.name}. Click "Add Branch" to create one.
            </div>
          )}
        </>
      )}

      <CreateBranchModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshBranches={refreshBranches}
        editMode={editMode}
        branchToEdit={selectedBranch}
        tenantSlug={tenantSlug}
        selectedLocation={selectedLocation}
      />

      {/* Delete Branch Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
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
          
          {!success && (
            <>
              <p>Are you sure you want to delete branch <strong>{selectedBranch?.name}</strong>?</p>
              <p className="text-danger mb-0">This action cannot be undone.</p>
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
            disabled={deleteLoading || success}
          >
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete Branch
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BranchesList;