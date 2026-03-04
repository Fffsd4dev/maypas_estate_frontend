

// src/pages/components/RentCyclesView.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge, Card, Row, Col, Alert, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const RentCyclesView = ({ 
  rentAccount, 
  estateSlug,
  isPage = false,
  onClose
}) => {
  const { user } = useAuthContext();
  const [rentCycles, setRentCycles] = useState([]);
  const [rentManager, setRentManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    cycle_start_date: '',
    cycle_end_date: '',
    fee: '',
    is_paid: false
  });
  
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(null);

  useEffect(() => {
    if (rentAccount && rentAccount.rent_account?.uuid && user?.token) {
      fetchRentCycles();
    }
  }, [rentAccount, user]);

  const fetchRentCycles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.token || !estateSlug) {
        throw new Error('Authentication or estate slug required');
      }

      const rentAccountUuid = rentAccount.rent_account?.uuid || rentAccount.uuid;
      if (!rentAccountUuid) {
        throw new Error('Rent account UUID not found');
      }

      // API endpoints to try
      const endpoints = [
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/rent/account/get/cycles/${rentAccountUuid}`,
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/get/cycles/${rentAccountUuid}`,
      ];

      let response = null;
      for (const endpoint of endpoints) {
        try {
          response = await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          });
          break;
        } catch (err) {
          continue;
        }
      }

      if (!response) {
        throw new Error('Failed to fetch rent cycles from all endpoints');
      }

      // Process response data
      let rentManagerData = null;
      let cyclesData = [];

      if (response.data.rent_manager) {
        rentManagerData = response.data.rent_manager;
        cyclesData = response.data.rent_manager.rent_cycles || [];
      } else if (response.data.data) {
        rentManagerData = response.data.data.rent_manager;
        cyclesData = response.data.data.cycles || [];
      } else if (Array.isArray(response.data)) {
        cyclesData = response.data;
      } else {
        cyclesData = response.data.cycles || response.data.rent_cycles || [];
        rentManagerData = response.data.rent_manager || response.data;
      }

      setRentManager(rentManagerData);
      setRentCycles(Array.isArray(cyclesData) ? cyclesData : []);
    } catch (err) {
      console.error('Error fetching rent cycles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch rent cycles');
    } finally {
      setLoading(false);
    }
  };

  // Edit Modal Functions
  const handleEditClick = (cycle) => {
    setSelectedCycle(cycle);
    setEditFormData({
      cycle_start_date: cycle.cycle_start_date ? cycle.cycle_start_date.split(' ')[0] : '',
      cycle_end_date: cycle.cycle_end_date ? cycle.cycle_end_date.split(' ')[0] : '',
      fee: cycle.fee || '',
      is_paid: cycle.is_paid === "1" || cycle.is_paid === 1 || cycle.is_paid === true
    });
    setModalError(null);
    setModalSuccess(null);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedCycle(null);
    setEditFormData({
      cycle_start_date: '',
      cycle_end_date: '',
      fee: '',
      is_paid: false
    });
    setModalError(null);
    setModalSuccess(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setEditLoading(true);
      setModalError(null);
      setModalSuccess(null);

      if (!user?.token || !estateSlug || !selectedCycle) {
        throw new Error('Required data missing');
      }

      const apartmentUnitUuid = rentManager?.apartment_unit_uuid || rentAccount?.apartment_unit_uuid;
      if (!apartmentUnitUuid) {
        throw new Error('Apartment unit UUID not found');
      }

      const updateData = {
        apartment_unit_uuid: apartmentUnitUuid,
        cycle_start_date: `${editFormData.cycle_start_date} 00:00:00`,
        cycle_end_date: `${editFormData.cycle_end_date} 00:00:00`,
        fee: parseFloat(editFormData.fee),
        is_paid: editFormData.is_paid
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/cycle/update/${selectedCycle.uuid || selectedCycle.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setRentCycles(prev => prev.map(cycle => 
        (cycle.uuid || cycle.id) === (selectedCycle.uuid || selectedCycle.id)
          ? { 
              ...cycle, 
              cycle_start_date: updateData.cycle_start_date,
              cycle_end_date: updateData.cycle_end_date,
              fee: updateData.fee,
              is_paid: updateData.is_paid ? "1" : "0"
            } 
          : cycle
      ));

      setModalSuccess('Rent cycle updated successfully!');
      setTimeout(() => {
        handleEditClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating rent cycle:', err);
      setModalError(err.response?.data?.message || err.message || 'Failed to update rent cycle');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Modal Functions
  const handleDeleteClick = (cycle) => {
    setSelectedCycle(cycle);
    setModalError(null);
    setModalSuccess(null);
    setShowDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedCycle(null);
    setModalError(null);
    setModalSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      setModalError(null);
      setModalSuccess(null);

      if (!user?.token || !estateSlug || !selectedCycle) {
        throw new Error('Required data missing');
      }

      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/rent/account/get/cycles/${selectedCycle.uuid || selectedCycle.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Remove from local state
      setRentCycles(prev => prev.filter(cycle => 
        (cycle.uuid || cycle.id) !== (selectedCycle.uuid || selectedCycle.id)
      ));

      setModalSuccess('Rent cycle deleted successfully!');
      setTimeout(() => {
        handleDeleteClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting rent cycle:', err);
      setModalError(err.response?.data?.message || err.message || 'Failed to delete rent cycle');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getPaymentStatusBadge = (isPaid) => {
    return isPaid === "1" || isPaid === 1 || isPaid === true ? 
      <Badge bg="success">Paid</Badge> : 
      <Badge bg="warning">Pending</Badge>;
  };

  const getAccountStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="danger">Inactive</Badge>;
  };

  const getTenantInfo = () => {
    return rentManager?.occupant || rentAccount?.user || null;
  };

  const getApartmentUnitInfo = () => {
    return rentManager?.apartment_unit || rentAccount?.apartment_units?.unit_name || 'N/A';
  };

  const getAccountType = () => {
    return rentManager?.account_type || rentAccount?.account_type || 'N/A';
  };

  const getAccountStatus = () => {
    return rentManager?.is_active !== undefined ? rentManager.is_active : rentAccount?.is_active;
  };

  const getStartDate = () => {
    return rentManager?.start_date || rentAccount?.start_date;
  };

  const getTerminationDate = () => {
    return rentManager?.termination_date || rentAccount?.termination_date;
  };

  if (!rentAccount) {
    return (
      <Alert variant="warning">
        No rent account data available
      </Alert>
    );
  }

  // Content that's common to both modal and page views
  const renderContent = () => (
    <>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Rent Account Summary */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Rent Account Summary</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>Tenant:</strong>{' '}
                {getTenantInfo() ? `${getTenantInfo().first_name} ${getTenantInfo().last_name}` : 'N/A'}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {getTenantInfo()?.email || 'N/A'}
              </div>
              <div className="mb-3">
                <strong>Apartment Unit:</strong> {getApartmentUnitInfo()}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Account Type:</strong>{' '}
                <Badge bg="primary">{getAccountType()}</Badge>
              </div>
              <div className="mb-3">
                <strong>Status:</strong> {getAccountStatusBadge(getAccountStatus())}
              </div>
              <div className="mb-3">
                <strong>Start Date:</strong> {formatDate(getStartDate())}
              </div>
              {getTerminationDate() && (
                <div className="mb-3">
                  <strong>Termination Date:</strong> {formatDate(getTerminationDate())}
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Rent Cycles Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Rent Cycles</h5>
            <div>
              <span className="text-muted me-3">
                {rentCycles.length} cycle{rentCycles.length !== 1 ? 's' : ''} found
              </span>
              <Button variant="outline-secondary" size="sm" onClick={fetchRentCycles}>
                <IconifyIcon icon="bx:refresh" className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading rent cycles...</p>
            </div>
          ) : rentCycles.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>S/N</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Fee</th>
                    <th>Payment Status</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rentCycles.map((cycle, index) => {
                    const startDate = new Date(cycle.cycle_start_date);
                    const endDate = new Date(cycle.cycle_end_date);
                    const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={cycle.uuid || cycle.id || index}>
                        <td>{index + 1}</td>
                        <td>{formatDate(cycle.cycle_start_date)}</td>
                        <td>{formatDate(cycle.cycle_end_date)}</td>
                        <td className="fw-semibold">{formatCurrency(cycle.fee)}</td>
                        <td>{getPaymentStatusBadge(cycle.is_paid)}</td>
                        <td>
                          <Badge bg="info">{durationDays} days</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              title="Edit Cycle"
                              onClick={() => handleEditClick(cycle)}
                            >
                              <IconifyIcon icon="bx:edit" />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              title="Delete Cycle"
                              onClick={() => handleDeleteClick(cycle)}
                            >
                              <IconifyIcon icon="bx:trash" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No rent cycles found for this account</p>
              <Button variant="outline-primary" size="sm" onClick={fetchRentCycles}>
                <IconifyIcon icon="bx:refresh" className="me-1" />
                Try Again
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Summary Statistics */}
      {rentCycles.length > 0 && (
        <Card className="mt-3">
          <Card.Body>
            <Row>
              <Col md={3} className="text-center">
                <div className="border-end">
                  <h4 className="text-primary mb-1">{rentCycles.length}</h4>
                  <small className="text-muted">Total Cycles</small>
                </div>
              </Col>
              <Col md={3} className="text-center">
                <div className="border-end">
                  <h4 className="text-success mb-1">
                    {rentCycles.filter(c => c.is_paid === "1" || c.is_paid === 1 || c.is_paid === true).length}
                  </h4>
                  <small className="text-muted">Paid Cycles</small>
                </div>
              </Col>
              <Col md={3} className="text-center">
                <div className="border-end">
                  <h4 className="text-warning mb-1">
                    {rentCycles.filter(c => !(c.is_paid === "1" || c.is_paid === 1 || c.is_paid === true)).length}
                  </h4>
                  <small className="text-muted">Pending Cycles</small>
                </div>
              </Col>
              <Col md={3} className="text-center">
                <div>
                  <h4 className="text-info mb-1">
                    {formatCurrency(rentCycles.reduce((total, cycle) => total + parseFloat(cycle.fee || 0), 0))}
                  </h4>
                  <small className="text-muted">Total Fees</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Edit Cycle Modal */}
      <Modal show={showEditModal} onHide={handleEditClose} centered size="lg" scrollable>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="w-100">Edit Rent Cycle</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {modalError && (
              <Alert variant="danger" className="mb-3">
                {modalError}
              </Alert>
            )}
            {modalSuccess && (
              <Alert variant="success" className="mb-3">
                {modalSuccess}
              </Alert>
            )}
            {selectedCycle && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="cycle_start_date"
                    value={editFormData.cycle_start_date}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="cycle_end_date"
                    value={editFormData.cycle_end_date}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fee Amount *</Form.Label>
                  <Form.Control
                    type="number"
                    name="fee"
                    value={editFormData.fee}
                    onChange={handleEditChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="is_paid"
                    label="Payment Received"
                    checked={editFormData.is_paid}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose} disabled={editLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editLoading || modalSuccess}>
              {editLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Updating...
                </>
              ) : (
                <>
                  <IconifyIcon icon="bx:save" className="me-1" />
                  Update Cycle
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Cycle Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && (
            <Alert variant="danger" className="mb-3">
              {modalError}
            </Alert>
          )}
          {modalSuccess && (
            <Alert variant="success" className="mb-3">
              {modalSuccess}
            </Alert>
          )}
          {selectedCycle && !modalSuccess && (
            <>
              <p>Are you sure you want to delete this rent cycle for the period <strong>{formatDate(selectedCycle.cycle_start_date)} </strong> to <strong>{formatDate(selectedCycle.cycle_end_date)}</strong></p>
              
              <p className="text-danger">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose} disabled={deleteLoading || modalSuccess}>
            {modalSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!modalSuccess && (
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Deleting...
                </>
              ) : (
                <>
                  <IconifyIcon icon="bx:trash" className="me-1" />
                  Delete Cycle
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );

  // Return as page
  if (isPage) {
    return <div>{renderContent()}</div>;
  }

  // Return as modal
  return (
    <Modal show={true} onHide={onClose} centered size="xl" scrollable>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Rent Cycles</h4>
            </div>
            <Button variant="outline-secondary" size="sm" onClick={fetchRentCycles}>
              <IconifyIcon icon="bx:refresh" className="me-1" />
              Refresh
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {renderContent()}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RentCyclesView;