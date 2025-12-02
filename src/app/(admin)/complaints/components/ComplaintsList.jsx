import { useState } from 'react';
import { Card, CardBody, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComplaintsListView from './ComplaintsListView';
import CreateComplaintModal from './CreateComplaintModal';

const ComplaintsList = ({ complaints, loading, refreshComplaints, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuthContext();
  const itemsPerPage = 10;

  // Filter complaints based on search term
  const filteredComplaints = complaints.filter(complaint => 
    complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.complaint_id?.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedComplaint(null);
    setShowModal(true);
  };

  const handleEditClick = (complaint) => {
    console.log('Editing complaint:', complaint);
    // Get the complaint ID - try different possible fields
    const complaintId = complaint.id || complaint.complaint_id;
    console.log('Complaint ID to edit:', complaintId);
    
    setEditMode(true);
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDeleteModal(true);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      // Get the complaint ID - try different possible fields
      const complaintId = selectedComplaint?.id || selectedComplaint?.complaint_id;
      
      if (!complaintId) {
        throw new Error('Complaint ID not found');
      }

      console.log('Deleting complaint with ID:', complaintId);

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/delete/${complaintId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );

      setDeleteSuccess('Complaint deleted successfully!');
      refreshComplaints();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
      }, 1500);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete complaint');
      console.error('Error deleting complaint:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedComplaint(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading complaints...</div>;
  }

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div className="search-bar">
              <span>
                <IconifyIcon icon="bx:search-alt" />
              </span>
              <input 
                type="search" 
                className="form-control" 
                placeholder="Search complaints..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Button 
                variant="primary" 
                className="d-inline-flex align-items-center"
                onClick={handleAddClick}
              >
                <IconifyIcon icon="bx:plus" className="me-1" />
                Create Complaint
              </Button>
            </div>
          </div>
        </CardBody>
        
        <ComplaintsListView 
          complaints={paginatedComplaints}
          currentPage={currentPage}
          totalPages={totalPages}
          totalComplaints={filteredComplaints.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onDeleteComplaint={handleDeleteClick}
          onEditComplaint={handleEditClick}
          deletingId={deleting ? (selectedComplaint?.id || selectedComplaint?.complaint_id) : null}
          tenantSlug={tenantSlug}
        />
      </Card>

      <CreateComplaintModal 
        show={showModal}
        handleClose={handleModalClose}
        refreshComplaints={refreshComplaints}
        tenantSlug={tenantSlug}
        editMode={editMode}
        complaintToEdit={selectedComplaint}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" onClose={() => setDeleteError(null)} dismissible>
              {deleteError}
            </Alert>
          )}
          
          {deleteSuccess && (
            <Alert variant="success">
              {deleteSuccess}
            </Alert>
          )}
          
          {!deleteSuccess && (
            <>
              Are you sure you want to delete the complaint <strong>"{selectedComplaint?.title}"</strong>? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting || deleteSuccess}
          >
            {deleting ? (
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

export default ComplaintsList;