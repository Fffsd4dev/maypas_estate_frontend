import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import RentManagersListView from './RentManagersListView';
import CreateRentAccountModal from './CreateRentAccountModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const RentManagersList = ({ 
  rentAccounts, 
  tenants, 
  apartments, 
  apartmentUnits,
  refreshRentAccounts, 
  updateRentAccounts, 
  estateSlug 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRentAccount, setSelectedRentAccount] = useState(null);
  const [terminationDate, setTerminationDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Ensure rentAccounts is always an array
  const rentAccountsArray = Array.isArray(rentAccounts) ? rentAccounts : [];

  // Helper function to extract apartment_unit_uuid from rent account object
  const getApartmentUnitUuid = (account) => {
    if (!account) return null;
    
    // Based on actual API response, apartment_unit_uuid is in apartment_units.uuid
    if (account.apartment_units && account.apartment_units.uuid) {
      return account.apartment_units.uuid;
    }
    
    // Fallback checks
    if (account.apartment_unit_uuid) {
      return account.apartment_unit_uuid;
    }
    
    if (account.rent_account && account.rent_account.apartment_unit_uuid) {
      return account.rent_account.apartment_unit_uuid;
    }
    return null;
  };

  // Helper function to extract occupant_uuid from rent account object
  const getOccupantUuid = (account) => {
    if (!account) return null;
    
    // Based on actual API response, occupant_uuid is in user.uuid
    if (account.user && account.user.uuid) {
      return account.user.uuid;
    }
    
    // Fallback checks
    if (account.occupant_uuid) {
      return account.occupant_uuid;
    }
    
    if (account.occupant && account.occupant.uuid) {
      return account.occupant.uuid;
    }
    
    if (account.rent_account && account.rent_account.occupant_uuid) {
      return account.rent_account.occupant_uuid;
    }

    return null;
  };

  // Helper function to get tenant name
  const getTenantName = (account) => {
    if (account?.user) {
      return `${account.user.first_name} ${account.user.last_name}`;
    }
    if (account?.occupant) {
      return `${account.occupant.first_name} ${account.occupant.last_name}`;
    }
    return 'Unknown Tenant';
  };

  // Helper function to get unit name
  const getUnitName = (account) => {
    if (account?.apartment_units?.unit_name) {
      return account.apartment_units.unit_name;
    }
    if (account?.apartment_unit) {
      return account.apartment_unit;
    }
    return 'Unknown Unit';
  };

  const getApartmentInfo = (account) => {
    return {
      category: account?.apartment?.category || 'N/A',
      address: account?.apartment?.address || 'N/A'
    };
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleViewRentCycles = (rentAccount) => {
    navigate(`/${estateSlug}/rent-accounts/cycles`, { 
      state: { rentAccount } 
    });
  };

  const handleTerminateClick = (rentAccount) => {
    // Extract UUIDs
    const apartmentUnitUuid = getApartmentUnitUuid(rentAccount);
    const occupantUuid = getOccupantUuid(rentAccount);
    
    if (!apartmentUnitUuid) {
      console.error('Could not find apartment_unit_uuid');
      alert('Error: Apartment unit UUID not found. Please refresh and try again.');
      return;
    }
    
    if (!occupantUuid) {
      console.error('Could not find occupant_uuid');
      alert('Error: Occupant UUID not found. Please refresh and try again.');
      return;
    }
    
    // Set the selected account and show modal
    setSelectedRentAccount(rentAccount);
    setTerminationDate('');
    setError(null);
    setSuccess(null);
    setShowTerminateModal(true);
  };

  const handleDeleteClick = (rentAccount) => {
    setSelectedRentAccount(rentAccount);
    setError(null);
    setSuccess(null);
    setShowDeleteModal(true);
  };

  const handleTerminateConfirm = async () => {
    
    if (!terminationDate) {
      setError('Please select a termination date');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!estateSlug) {
        throw new Error('Estate slug not found');
      }

      // Get apartment_unit_uuid using the helper function
      const apartmentUnitUuid = getApartmentUnitUuid(selectedRentAccount);
      
      if (!apartmentUnitUuid) {
        throw new Error('Apartment unit UUID not found for this rent account');
      }

      // Get occupant_uuid using the helper function
      const occupantUuid = getOccupantUuid(selectedRentAccount);
      
      if (!occupantUuid) {
        throw new Error('Occupant UUID not found for this rent account');
      }

      const terminateData = {
        occupant_uuid: occupantUuid,
        termination_date: `${terminationDate} 00:00:00`
      };

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/terminate/${apartmentUnitUuid}`;
      
      const response = await axios.post(apiUrl, terminateData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          "Accept": "application/json",
        }
      });

      setSuccess('Rent account terminated successfully!');
      
      // Update the UI by marking the account as terminated
      const updatedAccounts = rentAccountsArray.map(account => {
        const accountId = account.id;
        const selectedId = selectedRentAccount.id;
        if (accountId === selectedId) {
          return { 
            ...account, 
            is_active: false, 
            termination_date: terminateData.termination_date 
          };
        }
        return account;
      });
      updateRentAccounts([...updatedAccounts]);
      
      setTimeout(() => {
        setShowTerminateModal(false);
        setSuccess(null);
        refreshRentAccounts(); // Refresh the list
      }, 1500);
      
    } catch (error) {
      console.error('Error terminating rent account:', error);
      setError(error.response?.data?.message || error.message || 'Failed to terminate rent account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!estateSlug) {
        throw new Error('Estate slug not found');
      }

      const rentAccountUuid = selectedRentAccount?.rent_account?.uuid;
      if (!rentAccountUuid) {
        throw new Error('No rent account UUID found for deletion');
      }

      // Use the delete API endpoint
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/delete/${rentAccountUuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Rent account deleted successfully!');
      
      // Remove the account from the UI
      const updatedAccounts = rentAccountsArray.filter(account => {
        const accountUuid = account?.rent_account?.uuid;
        return accountUuid !== rentAccountUuid;
      });
      updateRentAccounts([...updatedAccounts]);
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting rent account:', error);
      setError(error.response?.data?.message || error.message || 'Failed to delete rent account');
    } finally {
      setLoading(false);
    }
  };

  const handleRentAccountUpdate = (updatedAccount, isEdit) => {
    // For create only (no edit)
    if (!isEdit) {
      const updatedAccounts = [...rentAccountsArray, updatedAccount];
      updateRentAccounts([...updatedAccounts]);
    }
  };

  const filteredRentAccounts = rentAccountsArray.filter(account => {
    const tenantName = getTenantName(account).toLowerCase();
    const unitName = getUnitName(account).toLowerCase();
    const category = getApartmentInfo(account).category.toLowerCase();
    const tenantEmail = account?.user?.email ? account.user.email.toLowerCase() : '';
    
    return (
      tenantName.includes(searchTerm.toLowerCase()) ||
      unitName.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase()) ||
      tenantEmail.includes(searchTerm.toLowerCase())
    );
  });

  const getFullRentAccountInfo = (account) => {
    if (!account) return { tenantName: 'N/A', unitName: 'N/A', apartmentInfo: 'N/A' };
    
    return {
      tenantName: getTenantName(account),
      unitName: getUnitName(account),
      apartmentInfo: getApartmentInfo(account)
    };
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
                        placeholder="Search by tenant, unit, category, or email..." 
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
                    Add Rent Account
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {rentAccountsArray.length > 0 ? (
        <RentManagersListView 
          rentAccounts={filteredRentAccounts}
          apartmentUnits={apartmentUnits}
          onTerminateClick={handleTerminateClick}
          onDeleteClick={handleDeleteClick}
          onViewRentCycles={handleViewRentCycles}
          getTenantName={getTenantName}
          getUnitName={getUnitName}
          getApartmentInfo={getApartmentInfo}
        />
      ) : (
        <div className="alert alert-info mt-3">No rent accounts found</div>
      )}

      <CreateRentAccountModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshRentAccounts={refreshRentAccounts}
        onRentAccountUpdate={handleRentAccountUpdate}
        estateSlug={estateSlug}
        tenants={tenants}
        apartments={apartments}
        mode="account"
      />

      {/* Terminate Modal */}
      <Modal show={showTerminateModal} onHide={() => {
        setShowTerminateModal(false);
        setError(null);
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terminate Rent Account</Modal.Title>
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
          
          {!success && selectedRentAccount && (
            <>
              <p>
                Are you sure you want to terminate the rent account for{' '}
                <strong>{getFullRentAccountInfo(selectedRentAccount).tenantName}</strong> in{' '}
                <strong>{getFullRentAccountInfo(selectedRentAccount).unitName}</strong>?
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Termination Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={terminationDate}
                  onChange={(e) => setTerminationDate(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Select the date when this rent account should be terminated
                </Form.Text>
              </Form.Group>
              
              <small className="text-muted d-block mt-2">
                This action will mark the rent account as terminated but keep the record.
              </small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowTerminateModal(false);
          }} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleTerminateConfirm}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Terminating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:stop-circle" className="me-1" />
                Confirm Termination
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => {
        setShowDeleteModal(false);
        setError(null);
      }} centered>
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
          
          {!success && selectedRentAccount && (
            <>
              <p>
                Are you sure you want to permanently delete the rent account for{' '}
                <strong>{getFullRentAccountInfo(selectedRentAccount).tenantName}</strong> in{' '}
                <strong>{getFullRentAccountInfo(selectedRentAccount).unitName}</strong>?
              </p>
              
              <Alert variant="danger">
                <IconifyIcon icon="bx:error" className="me-2" />
                <strong>Warning:</strong> This action cannot be undone. All rent cycles and associated data will be permanently removed.
              </Alert>
              
              <small className="text-muted d-block mt-2">
                Rent Account UUID: {selectedRentAccount?.rent_account?.uuid}
              </small>
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
                Permanently Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RentManagersList;