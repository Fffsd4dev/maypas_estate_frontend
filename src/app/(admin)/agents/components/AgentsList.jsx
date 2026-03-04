import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AgentsListView from './AgentsListView';
import CreateAgentsModal from './CreateAgentsModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const AgentsList = ({ agents, userTypes = [], refreshAgents, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [viewAgentDetails, setViewAgentDetails] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { user } = useAuthContext();

  // Ensure arrays are always arrays
  const agentsArray = Array.isArray(agents) ? agents : [];
  const safeUserTypes = Array.isArray(userTypes) ? userTypes : [];

  // Helper function to get user type name by ID
  const getUserTypeName = (userTypeId) => {
    const userType = safeUserTypes.find(type => type.id == userTypeId);
    return userType ? (userType.name || `Type ${userType.id}`) : 'Unknown';
  };

  // Helper function to get UUID from agent
  const getAgentUuid = (agent) => {
    // Try different possible UUID field names
    return agent.uuid || agent.id || agent.uid || agent.guid;
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleViewClick = async (agent) => {
    setLoading(true);
    setError(null);
    setViewAgentDetails(null);
    
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const agentUuid = getAgentUuid(agent);
      if (!agentUuid) {
        throw new Error('Agent UUID not found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/view-one/${agentUuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.data) {
        setViewAgentDetails(response.data.data);
      } else {
        setViewAgentDetails(agent);
      }
      
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching agent details:', err);
      setError('Failed to fetch agent details. Showing basic information.');
      setViewAgentDetails(agent);
      setShowViewModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (agent) => {
    setSelectedAgent(agent);
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

      if (!selectedAgent) {
        throw new Error('No agent selected for deletion');
      }

      const agentUuid = getAgentUuid(selectedAgent);
      if (!agentUuid) {
        throw new Error('Agent UUID not found');
      }

      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/delete/${agentUuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Agent deleted successfully!');
      refreshAgents();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
        setSelectedAgent(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError(error.response?.data?.message || error.response?.data?.error || 'Failed to delete agent');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agentsArray.filter(agent => {
    const fullName = `${agent.first_name || ''} ${agent.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agent.phone?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
                        placeholder="Search agents..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={agentsArray.length === 0}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                    disabled={safeUserTypes.length === 0}
                    title={safeUserTypes.length === 0 ? "No user types available" : ""}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Agent
                  </button>
                </div>
              </div>
              {safeUserTypes.length === 0 && (
                <Alert variant="warning" className="mt-3 mb-0">
                  <small>
                    <IconifyIcon icon="bx:info-circle" className="me-1" />
                    No user types found. You need to configure user types before creating agents.
                  </small>
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {agentsArray.length > 0 ? (
        <AgentsListView 
          agents={filteredAgents}
          userTypes={safeUserTypes}
          onViewClick={handleViewClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <IconifyIcon icon="bx:user" className="text-muted" size="48" />
            </div>
            <h5 className="text-muted">No agents found</h5>
            <p className="text-muted mb-0">Click "Add Agent" to create your first agent</p>
          </CardBody>
        </Card>
      )}

      <CreateAgentsModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshAgents={refreshAgents}
        userTypes={safeUserTypes}
        tenantSlug={tenantSlug}
      />

      {/* View Agent Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading agent details...</p>
            </div>
          ) : viewAgentDetails ? (
            <div className="agent-details">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>First Name:</strong>
                    <p className="mb-0">{viewAgentDetails.first_name || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Last Name:</strong>
                    <p className="mb-0">{viewAgentDetails.last_name || 'N/A'}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p className="mb-0">{viewAgentDetails.email || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Phone:</strong>
                    <p className="mb-0">{viewAgentDetails.phone || 'N/A'}</p>
                  </div>
                </Col>
              </Row>
              {/* <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>User Type:</strong>
                    <p className="mb-0">{getUserTypeName(viewAgentDetails.user_type)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>UUID:</strong>
                    <p className="mb-0 text-muted small">
                      {getAgentUuid(viewAgentDetails) || 'N/A'}
                    </p>
                  </div>
                </Col>
              </Row> */}
              {viewAgentDetails.created_at && (
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <strong>Created At:</strong>
                      <p className="mb-0">{new Date(viewAgentDetails.created_at).toLocaleString()}</p>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          ) : (
            <Alert variant="warning">No details available for this agent.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              <p>
                Are you sure you want to delete agent{' '}
                <strong>{selectedAgent?.first_name} {selectedAgent?.last_name}</strong>?
              </p>
              <p className="text-danger">
                <small>
                  <IconifyIcon icon="bx:error" className="me-1" />
                  This action cannot be undone. All data associated with this agent will be permanently deleted.
                </small>
              </p>
              {/* {selectedAgent && (
                <p className="text-muted small mt-2">
                  UUID: {getAgentUuid(selectedAgent)}
                </p>
              )} */}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedAgent(null);
              setError(null);
            }}
            disabled={loading || success}
          >
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
                Delete Agent
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgentsList;