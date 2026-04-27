import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import EstateManagersListView from './EstateManagersListView';
import CreateEstateManagersModal from './CreateEstateManagersModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const EstateManagersList = ({ managers, refreshManagers }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null); // Changed from selectedManager
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure managers is always an array
  const managersArray = Array.isArray(managers) ? managers : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedManagerId(null);
    setShowModal(true);
  };

  const handleEditClick = (manager) => {
    setEditMode(true);
    setSelectedManagerId(manager.uuid); // Pass only the UUID
    setShowModal(true);
  };

  const handleDeleteClick = (manager) => {
    setSelectedManagerId(manager.uuid); // Store UUID for deletion
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/delete-estate-manager/${selectedManagerId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Estate manager deleted successfully!');
      refreshManagers();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
        setSelectedManagerId(null);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete estate manager');
      console.error('Error deleting estate manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = managersArray.filter(manager => 
    manager.estate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Search estates..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Estate Manager
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {managers.length > 0 ? (
        <EstateManagersListView 
          managers={filteredManagers}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info">No Estate Agent found</div>
      )}

      <CreateEstateManagersModal 
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedManagerId(null);
        }}
        refreshManagers={refreshManagers}
        editMode={editMode}
        managerId={selectedManagerId} // Pass the UUID
      />

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
              Are you sure you want to delete this estate? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={loading || success}
          >
            {loading ? (
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

export default EstateManagersList;