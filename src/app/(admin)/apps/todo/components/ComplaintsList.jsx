import { useState } from 'react';
import { Card, CardBody, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComplaintsListView from './ComplaintsListView';
import CreateComplaintModal from './CreateComplaintModal';

const ComplaintsList = ({ complaints, loading, refreshComplaints, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteComplaint = async (complaintId) => {
    setDeletingId(complaintId);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/delete`,
        {
          data: { id: complaintId },
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDeleteSuccess(true);
      refreshComplaints();
      
      setTimeout(() => {
        setDeleteSuccess(false);
        setDeletingId(null);
      }, 3000);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete complaint');
      console.error('Error deleting complaint:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading complaints...</div>;
  }

  return (
    <>
      {deleteError && (
        <Alert variant="danger" dismissible onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}
      
      {deleteSuccess && (
        <Alert variant="success">
          Complaint deleted successfully!
        </Alert>
      )}

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
          onDeleteComplaint={handleDeleteComplaint}
          deletingId={deletingId}
          tenantSlug={tenantSlug}
        />
      </Card>

      <CreateComplaintModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshComplaints={refreshComplaints}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default ComplaintsList;