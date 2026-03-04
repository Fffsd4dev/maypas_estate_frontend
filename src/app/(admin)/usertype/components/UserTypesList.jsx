import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import UserTypesListView from './UserTypesListView';
import CreateUserTypeModal from './CreateUserTypeModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const UserTypesList = ({ userTypes, refreshUserTypes, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthContext();

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedUserType(null);
    setShowModal(true);
  };

  const handleEditClick = (userType) => {
    setEditMode(true);
    setSelectedUserType(userType);
    setShowModal(true);
  };

  const handleDeleteClick = (userType) => {
    setSelectedUserType(userType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/user-type/delete/${selectedUserType.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      refreshUserTypes();
    } catch (error) {
      console.error('Error deleting user type:', error);
      alert(error.response?.data?.message || 'Failed to delete user type');
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Filter user types based on search (name and permissions)
  const filteredUserTypes = userTypes.filter(userType => 
    userType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (userType.admin_management && 'admin management'.includes(searchTerm.toLowerCase())) ||
    (userType.user_management && 'user management'.includes(searchTerm.toLowerCase())) ||
    (userType.complaint_management && 'complaint management'.includes(searchTerm.toLowerCase()))
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
                        placeholder="Search by name or permissions..." 
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
                    Add User Type
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {userTypes.length > 0 ? (
        <UserTypesListView 
          userTypes={filteredUserTypes}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info mt-3">No user types found. Create your first user type.</div>
      )}

      <CreateUserTypeModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshUserTypes={refreshUserTypes}
        editMode={editMode}
        userTypeToEdit={selectedUserType}
        tenantSlug={tenantSlug}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the <strong>{selectedUserType?.name}</strong> user type? This action cannot be undone.
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

export default UserTypesList;