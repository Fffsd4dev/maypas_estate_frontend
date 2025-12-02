import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ChargesListView from './ChargesListView';
import CreateChargesModal from './CreateChargesModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const ChargesList = ({ charges, apartmentUnit, refreshCharges, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure charges is always an array
  const chargesArray = Array.isArray(charges) ? charges : [];

  const handleAddClick = () => {
    if (!apartmentUnit) {
      alert('No apartment unit selected');
      return;
    }
    setEditMode(false);
    setSelectedCharge(null);
    setShowModal(true);
  };

  const handleEditClick = (charge) => {
    setEditMode(true);
    setSelectedCharge(charge);
    setShowModal(true);
  };

  const handleDeleteClick = (charge) => {
    setSelectedCharge(charge);
    setShowDeleteModal(true);
  };

  // In ChargesList.js - update the delete function
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

    if (!apartmentUnit?.apartment_unit_uuid) {
      throw new Error('No apartment unit selected');
    }

    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/delete/${selectedCharge.id}`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          "Accept": "application/json",
        }
      }
    );
    
    setSuccess('Charge deleted successfully!');
    refreshCharges();
    
    setTimeout(() => {
      setShowDeleteModal(false);
      setSuccess(false);
    }, 1500);
    
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to delete charge');
    console.error('Error deleting charge:', error);
  } finally {
    setLoading(false);
  }
};

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

//       if (!apartmentUnit?.apartment_unit_uuid) {
//         throw new Error('No apartment unit selected');
//       }

//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/delete/${selectedCharge.id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json',
//             "Accept": "application/json",
//           }
//         }
//       );
      
//       setSuccess('Charge deleted successfully!');
//       refreshCharges();
      
//       setTimeout(() => {
//         setShowDeleteModal(false);
//         setSuccess(false);
//       }, 1500);
      
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to delete charge');
//       console.error('Error deleting charge:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const filteredCharges = chargesArray.filter(charge => 
    charge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (charge.charge_type && charge.charge_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (charge.fee_type && charge.fee_type.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        placeholder="Search charges..." 
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
                    disabled={!apartmentUnit}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Charge
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {apartmentUnit ? (
        chargesArray.length > 0 ? (
          <ChargesListView 
            charges={filteredCharges}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          <div className="alert alert-info mt-3 text-center">
            <IconifyIcon icon="bx:receipt" className="display-4 text-muted mb-3" />
            <h5>No Charges Found</h5>
            <p className="mb-3">There are no charges set up for <strong>{apartmentUnit.apartment_unit_name}</strong> yet.</p>
            <Button variant="primary" onClick={handleAddClick}>
              <IconifyIcon icon="bi:plus" className="me-1" />
              Add Your First Charge
            </Button>
          </div>
        )
      ) : (
        <div className="alert alert-warning mt-3">
          Apartment unit information not available.
        </div>
      )}

      <CreateChargesModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshCharges={refreshCharges}
        editMode={editMode}
        chargeToEdit={selectedCharge}
        tenantSlug={tenantSlug}
        apartmentUnit={apartmentUnit}
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
              Are you sure you want to delete charge <strong>{selectedCharge?.name}</strong> from {apartmentUnit?.apartment_unit_name}? This action cannot be undone.
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

export default ChargesList;