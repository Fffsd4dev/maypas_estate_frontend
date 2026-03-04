import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import RolesListView from './AdminRoleListView';
import CreateRoleModal from './CreateAdminRoleModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const RolesList = ({ roles, refreshRoles }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthContext();

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedRole(null);
    setShowModal(true);
  };

  const handleEditClick = (role) => {
    setEditMode(true);
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/delete-role`,
        { id: selectedRole.id },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      refreshRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Search roles..." 
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
                    Add Role
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {roles.length > 0 ? (
        <RolesListView 
        roles={filteredRoles}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      ) : (
        <div className="alert alert-info">No roles found</div>
      )}

      {/* <RolesListView 
        roles={filteredRoles}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      /> */}

      <CreateRoleModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshRoles={refreshRoles}
        editMode={editMode}
        roleToEdit={selectedRole}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the <strong>{selectedRole?.name}</strong> role? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <IconifyIcon icon="bx:trash" className="me-1" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RolesList;