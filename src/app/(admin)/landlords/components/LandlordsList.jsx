import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import LandlordsListView from './LandlordsListView';
import CreateLandlordsModal from './CreateLandlordsModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const LandlordsList = ({ landlords, refreshLandlords, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure landlords is always an array
  const landlordsArray = Array.isArray(landlords) ? landlords : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedLandlord(null);
    setShowModal(true);
  };

  const handleEditClick = (landlord) => {
    setEditMode(true);
    setSelectedLandlord(landlord);
    setShowModal(true);
  };

  const handleDeleteClick = (landlord) => {
    setSelectedLandlord(landlord);
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

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/delete-landlord`,
      {
        data: {
          id: selectedLandlord.id,
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          "Accept": "application/json",
        }
      }
    );
      
      setSuccess('Landlord deleted successfully!');
      refreshLandlords();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete landlord');
      console.error('Error deleting landlord:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLandlords = landlordsArray.filter(landlord => 
    landlord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const filteredLandlords = landlordsArray.filter(landlord => 
  //   landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   landlord.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   landlord.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
                        placeholder="Search landlords..." 
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
                    Add Landlord
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {landlordsArray.length > 0 ? (
        <LandlordsListView 
          landlords={filteredLandlords}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info">No landlords found</div>
      )}

      <CreateLandlordsModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshLandlords={refreshLandlords}
        editMode={editMode}
        landlordToEdit={selectedLandlord}
        tenantSlug={tenantSlug}
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
              Are you sure you want to delete landlord <strong>{selectedLandlord?.name}</strong>? This action cannot be undone.
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

export default LandlordsList;