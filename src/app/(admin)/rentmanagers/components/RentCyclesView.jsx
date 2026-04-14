import { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import CreateRentAccountModal from './CreateRentAccountModal';

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
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    if (rentAccount && (rentAccount.rent_account?.uuid || rentAccount.uuid) && user?.token) {
      fetchRentCycles();
      fetchTenantsAndApartments();
    }
  }, [rentAccount, user]);

  const fetchTenantsAndApartments = async () => {
    try {
      // Fetch tenants
      const tenantsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/tenants/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Fetch apartments
      const apartmentsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setTenants(tenantsResponse.data.users?.data || tenantsResponse.data.data || []);
      setApartments(apartmentsResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching tenants and apartments:', err);
    }
  };

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

      // Extract rent_manager and cycles from the response
      let rentManagerData = null;
      let cyclesData = [];

      if (response.data.rent_manager) {
        rentManagerData = response.data.rent_manager;
        cyclesData = response.data.rent_manager.rent_cycles || [];
      } else if (response.data.data && response.data.data.rent_manager) {
        rentManagerData = response.data.data.rent_manager;
        cyclesData = response.data.data.cycles || [];
      } else if (Array.isArray(response.data)) {
        cyclesData = response.data;
      } else {
        cyclesData = response.data.cycles || response.data.rent_cycles || [];
        rentManagerData = response.data.rent_manager || response.data;
      }

      // Normalize cycles to ensure each has a uuid property
      const normalizedCycles = (Array.isArray(cyclesData) ? cyclesData : []).map((cycle, index) => {
        return {
          ...cycle,
          uuid: cycle.uuid || cycle.id,
        };
      });

      // Create an enhanced rent account object with the apartment_unit_uuid from rent_manager
      const enhancedRentAccount = {
        ...rentAccount,
        apartment_unit_uuid: rentManagerData?.apartment_unit_uuid || rentAccount.apartment_unit_uuid,
        occupant: rentManagerData?.occupant || rentAccount.occupant || rentAccount.user,
        start_date: rentManagerData?.start_date || rentAccount.start_date,
        termination_date: rentManagerData?.termination_date || rentAccount.termination_date,
        account_type: rentManagerData?.account_type || rentAccount.account_type,
        is_active: rentManagerData?.is_active !== undefined ? rentManagerData.is_active : rentAccount.is_active
      };

      setRentManager(rentManagerData);
      setRentCycles(normalizedCycles);
      
      // Update the rentAccount object with the enhanced version
      Object.assign(rentAccount, enhancedRentAccount);
      
    } catch (err) {
      console.error('Error fetching rent cycles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch rent cycles');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cycle) => {
    setSelectedCycle(cycle);
    setShowCycleModal(true);
  };

  const handleCycleUpdate = (updatedCycle) => {
    setRentCycles(prev => prev.map(cycle => 
      cycle.uuid === updatedCycle.uuid ? updatedCycle : cycle
    ));
    setShowCycleModal(false);
    setSelectedCycle(null);
    // Refresh cycles to get latest data
    setTimeout(() => {
      fetchRentCycles();
    }, 500);
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
    return rentManager?.occupant || rentAccount?.occupant || rentAccount?.user || null;
  };

  const getApartmentUnitInfo = () => {
    return rentManager?.apartment_unit || rentAccount?.apartment_unit || 'N/A';
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
                      <tr key={cycle.uuid || index}>
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
      <CreateRentAccountModal
        show={showCycleModal}
        handleClose={() => {
          setShowCycleModal(false);
          setSelectedCycle(null);
        }}
        mode="cycle"
        rentCycleToEdit={selectedCycle}
        rentAccountForCycle={rentAccount}
        estateSlug={estateSlug}
        tenants={tenants}
        apartments={apartments}
        onCycleUpdate={handleCycleUpdate}
      />
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