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
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [selectedComplaintTitle, setSelectedComplaintTitle] = useState('');
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
    
    setEditMode(true);
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (complaintOrId) => {
    
    // Check if we received just an ID (number or string) or a full complaint object
    if (typeof complaintOrId === 'number' || typeof complaintOrId === 'string') {
      // We received just an ID
      const complaintId = complaintOrId;
      
      // Find the full complaint object from the complaints list
      const fullComplaint = complaints.find(c => 
        c.id === complaintId || 
        c.complaint_id === complaintId ||
        c._id === complaintId
      );
      
      if (fullComplaint) {
        setSelectedComplaint(fullComplaint);
        setSelectedComplaintId(complaintId);
        setSelectedComplaintTitle(fullComplaint.title || 'Unknown Complaint');
      } else {
        setSelectedComplaint(null);
        setSelectedComplaintId(complaintId);
        setSelectedComplaintTitle('Unknown Complaint');
      }
    } else {
      setSelectedComplaint(complaintOrId);
      setSelectedComplaintId(complaintOrId.id || complaintOrId.complaint_id || complaintOrId._id);
      setSelectedComplaintTitle(complaintOrId.title || 'Unknown Complaint');
    }
    
    setShowDeleteModal(true);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComplaintId) {
      setDeleteError('No complaint ID found for deletion');
      return;
    }

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

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/delete/${selectedComplaintId}`,
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
        setSelectedComplaint(null);
        setSelectedComplaintId(null);
        setSelectedComplaintTitle('');
      }, 1500);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || error.message || 'Failed to delete complaint');
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
          deletingId={deleting ? selectedComplaintId : null}
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
              <p>Are you sure you want to delete the complaint <strong>"{selectedComplaintTitle}"</strong>?</p>
              <p className="text-muted small">Complaint ID: {selectedComplaintId}</p>
              <p>This action cannot be undone.</p>
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
            disabled={deleting || deleteSuccess || !selectedComplaintId}
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