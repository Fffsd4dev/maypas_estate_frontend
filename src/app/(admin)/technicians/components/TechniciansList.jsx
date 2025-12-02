import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TechniciansListView from './TechniciansListView';
import CreateTechniciansModal from './CreateTechniciansModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const TechniciansList = ({ technicians, refreshTechnicians, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure technicians is always an array
  const techniciansArray = Array.isArray(technicians) ? technicians : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedTechnician(null);
    setShowModal(true);
  };

  const handleEditClick = (technician) => {
    setEditMode(true);
    setSelectedTechnician(technician);
    setShowModal(true);
  };

  const handleDeleteClick = (technician) => {
    setSelectedTechnician(technician);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/technician/delete/${selectedTechnician.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Technician deleted successfully!');
      refreshTechnicians();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete technician');
      console.error('Error deleting technician:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = techniciansArray.filter(technician => 
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (technician.phone && technician.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (technician.specialty_name && technician.specialty_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        placeholder="Search technicians..." 
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
                    Add Technician
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {techniciansArray.length > 0 ? (
        <TechniciansListView 
          technicians={filteredTechnicians}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info mt-3">No technicians found</div>
      )}

      <CreateTechniciansModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshTechnicians={refreshTechnicians}
        editMode={editMode}
        technicianToEdit={selectedTechnician}
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
              Are you sure you want to delete technician <strong>{selectedTechnician?.name}</strong>? This action cannot be undone.
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

export default TechniciansList;