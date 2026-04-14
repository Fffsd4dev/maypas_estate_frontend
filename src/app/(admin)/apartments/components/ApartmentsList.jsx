import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ApartmentsListView from './ApartmentsListView';
import CreateApartmentsModal from './CreateApartmentsModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const ApartmentsList = ({ apartments, refreshApartments, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignAgentModal, setShowAssignAgentModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthContext();

  // New states for agent assignment
  const [agents, setAgents] = useState([]);
  const [selectedAgentUuid, setSelectedAgentUuid] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const ITEMS_PER_PAGE = 15;

  // Ensure apartments is always an array
  const apartmentsArray = Array.isArray(apartments) ? apartments : [];

  const filteredApartments = apartmentsArray.filter(apartment => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      apartment.address?.toLowerCase().includes(searchTermLower) ||
      apartment.location?.toLowerCase().includes(searchTermLower) ||
      apartment.category_name?.toLowerCase().includes(searchTermLower) ||
      apartment.estate_manager?.estate_name?.toLowerCase().includes(searchTermLower) ||
      String(apartment.landlord_id || '').includes(searchTerm)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApartments = filteredApartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedApartment(null);
    setShowModal(true);
  };

  const handleEditClick = (apartment) => {
    setEditMode(true);
    setSelectedApartment(apartment);
    setShowModal(true);
  };

  const handleDeleteClick = (apartment) => {
    setSelectedApartment(apartment);
    setShowDeleteModal(true);
  };

  // New handler for assign agent button click
  const handleAssignAgentClick = async (apartment) => {
    setSelectedApartment(apartment);
    setSelectedAgentUuid('');
    setAssignError(null);
    setAssignSuccess(false);
    setShowAssignAgentModal(true);
    
    // Fetch agents when modal opens
    await fetchAgents();
  };

  // Updated function to fetch available agents with pagination handling
  const fetchAgents = async () => {
    try {
      setLoadingAgents(true);
      setAssignError(null);
      
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/list-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract agents from the paginated response
      const agentsData = response.data.data || [];
      
      // Transform agent data to combine first_name and last_name
      const transformedAgents = agentsData.map(agent => ({
        ...agent,
        full_name: `${agent.first_name} ${agent.last_name}`.trim()
      }));
      
      setAgents(transformedAgents);
      
    } catch (error) {
      console.error('Error fetching property managers:', error);
      setAssignError(error.response?.data?.message || 'Failed to load property managers. Please try again.');
    } finally {
      setLoadingAgents(false);
    }
  };

  // Function to handle agent assignment
  const handleAssignAgentConfirm = async () => {
    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!selectedApartment?.uuid) {
        throw new Error('No apartment selected');
      }

      if (!selectedAgentUuid) {
        throw new Error('Please select an agent');
      }

      // Prepare the payload as specified
      const payload = {
        landlord_agent_uuid: selectedAgentUuid
      };

      // Make the API call to assign agent
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/assign-apartment/${selectedApartment.uuid}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setAssignSuccess('Agent assigned successfully!');
      
      // Refresh the apartments list to show updated information
      setTimeout(() => {
        refreshApartments();
        setShowAssignAgentModal(false);
        setAssignSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error assigning agent:', error);
      console.error('Error response:', error.response);
      setAssignError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to assign agent. Please try again.'
      );
    } finally {
      setAssignLoading(false);
    }
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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments/delete-apartment`,
        {
          data: {
            id: selectedApartment.id,
          },
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Apartment deleted successfully!');
      refreshApartments();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete apartment');
      console.error('Error deleting apartment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  // Helper function to find agent name by UUID
  const getAgentName = (uuid) => {
    const agent = agents.find(a => a.uuid === uuid);
    return agent ? `${agent.first_name} ${agent.last_name}` : 'Unknown Agent';
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
                        placeholder="Search apartments..." 
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1); // Reset to first page when searching
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">
                    Showing {paginatedApartments.length} of {filteredApartments.length} apartments
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Apartment
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {apartmentsArray.length > 0 ? (
        <>
          <ApartmentsListView 
            apartments={paginatedApartments}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onAssignAgentClick={handleAssignAgentClick}
          />
          {renderPagination()}
        </>
      ) : (
        <div className="alert alert-info mt-3">No apartments found</div>
      )}

      <CreateApartmentsModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshApartments={refreshApartments}
        editMode={editMode}
        apartmentToEdit={selectedApartment}
        tenantSlug={tenantSlug}
      />

      {/* Delete Apartment Modal */}
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
          
          {!success && selectedApartment && (
            <>
              Are you sure you want to delete apartment at <strong>{selectedApartment?.address}</strong>? This action cannot be undone.
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

      {/* Assign Agent Modal */}
      <Modal show={showAssignAgentModal} onHide={() => setShowAssignAgentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Agent to Apartment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignError && (
            <Alert variant="danger" onClose={() => setAssignError(null)} dismissible>
              <IconifyIcon icon="bx:error" className="me-1" />
              {assignError}
            </Alert>
          )}
          
          {assignSuccess && (
            <Alert variant="success">
              <IconifyIcon icon="bx:check-circle" className="me-1" />
              {assignSuccess}
            </Alert>
          )}
          
          {!assignSuccess && selectedApartment && (
            <>
              <div className="mb-3">
                <p><strong>Apartment Address:</strong> {selectedApartment.address}</p>
                <p><strong>Location:</strong> {selectedApartment.location}</p>
                <p><strong>Category:</strong> {selectedApartment.category_name || 'N/A'}</p>
                {selectedApartment.assigned_agent_uuid && (
                  <p className="text-warning">
                    <strong>Currently Assigned Agent:</strong> {getAgentName(selectedApartment.assigned_agent_uuid)}
                  </p>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Select New Agent *</label>
                {loadingAgents ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading agents...
                  </div>
                ) : (
                  <>
                    <select 
                      className="form-select"
                      value={selectedAgentUuid}
                      onChange={(e) => setSelectedAgentUuid(e.target.value)}
                      disabled={assignLoading || agents.length === 0}
                    >
                      <option value="">-- Select an Agent --</option>
                      {agents.map(agent => (
                        <option key={agent.uuid} value={agent.uuid}>
                          {agent.full_name} ({agent.email})
                        </option>
                      ))}
                    </select>
                    <div className="form-text">
                      {agents.length === 0 
                        ? 'No property managers available. Please ensure property managers are registered.' 
                        : `Select from ${agents.length} available property manager(s)`}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowAssignAgentModal(false)}
            disabled={assignLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignAgentConfirm}
            disabled={assignLoading || !selectedAgentUuid || assignSuccess || agents.length === 0}
          >
            {assignLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Assigning...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:user-check" className="me-1" />
                {selectedApartment?.assigned_agent_uuid ? 'Reassign Agent' : 'Assign Agent'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApartmentsList;