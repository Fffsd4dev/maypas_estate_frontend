// import { useState } from 'react';
// import { Card, CardBody, Button, Alert, Modal, Spinner } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import ComplaintsListView from './ComplaintsListView';
// import CreateComplaintModal from './CreateComplaintModal';

// const ComplaintsList = ({ complaints, loading, refreshComplaints, tenantSlug }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [selectedComplaintId, setSelectedComplaintId] = useState(null);
//   const [selectedComplaintTitle, setSelectedComplaintTitle] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deleteError, setDeleteError] = useState(null);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const { user } = useAuthContext();
//   const itemsPerPage = 10;

//   // Filter complaints based on search term
//   const filteredComplaints = complaints.filter(complaint => 
//     complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     complaint.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     complaint.complaint_id?.toString().includes(searchTerm)
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

//   const handleAddClick = () => {
//     setEditMode(false);
//     setSelectedComplaint(null);
//     setShowModal(true);
//   };

//   const handleEditClick = (complaint) => {
//     console.log('Editing complaint clicked:', complaint);
//     console.log('Complaint ID:', complaint.id || complaint.complaint_id);
//     console.log('Complaint Title:', complaint.title);
    
//     setEditMode(true);
//     setSelectedComplaint(complaint);
//     setShowModal(true);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleDeleteClick = (complaintOrId) => {
//     console.log('Delete clicked for:', complaintOrId);
    
//     // Check if we received just an ID (number or string) or a full complaint object
//     if (typeof complaintOrId === 'number' || typeof complaintOrId === 'string') {
//       // We received just an ID
//       const complaintId = complaintOrId;
//       console.log('Received only ID:', complaintId);
      
//       // Find the full complaint object from the complaints list
//       const fullComplaint = complaints.find(c => 
//         c.id === complaintId || 
//         c.complaint_id === complaintId ||
//         c._id === complaintId
//       );
      
//       if (fullComplaint) {
//         console.log('Found full complaint:', fullComplaint);
//         setSelectedComplaint(fullComplaint);
//         setSelectedComplaintId(complaintId);
//         setSelectedComplaintTitle(fullComplaint.title || 'Unknown Complaint');
//       } else {
//         console.log('No full complaint found, using ID only');
//         setSelectedComplaint(null);
//         setSelectedComplaintId(complaintId);
//         setSelectedComplaintTitle('Unknown Complaint');
//       }
//     } else {
//       // We received a full complaint object
//       console.log('Received full complaint object:', complaintOrId);
//       setSelectedComplaint(complaintOrId);
//       setSelectedComplaintId(complaintOrId.id || complaintOrId.complaint_id || complaintOrId._id);
//       setSelectedComplaintTitle(complaintOrId.title || 'Unknown Complaint');
//     }
    
//     setShowDeleteModal(true);
//     setDeleteError(null);
//     setDeleteSuccess(false);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedComplaintId) {
//       setDeleteError('No complaint ID found for deletion');
//       return;
//     }

//     setDeleting(true);
//     setDeleteError(null);
//     setDeleteSuccess(false);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       console.log('Deleting complaint with ID:', selectedComplaintId);

//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/delete/${selectedComplaintId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json',
//             "Accept": "application/json",
//           }
//         }
//       );

//       setDeleteSuccess('Complaint deleted successfully!');
//       refreshComplaints();
      
//       setTimeout(() => {
//         setShowDeleteModal(false);
//         setDeleteSuccess(false);
//         setSelectedComplaint(null);
//         setSelectedComplaintId(null);
//         setSelectedComplaintTitle('');
//       }, 1500);
      
//     } catch (error) {
//       setDeleteError(error.response?.data?.message || error.message || 'Failed to delete complaint');
//       console.error('Error deleting complaint:', error);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setEditMode(false);
//     setSelectedComplaint(null);
//   };

//   if (loading) {
//     return <div className="text-center py-4">Loading complaints...</div>;
//   }

//   return (
//     <>
//       <Card>
//         <CardBody>
//           <div className="d-flex flex-wrap justify-content-between gap-3">
//             <div className="search-bar">
//               <span>
//                 <IconifyIcon icon="bx:search-alt" />
//               </span>
//               <input 
//                 type="search" 
//                 className="form-control" 
//                 placeholder="Search complaints..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div>
//               <Button 
//                 variant="primary" 
//                 className="d-inline-flex align-items-center"
//                 onClick={handleAddClick}
//               >
//                 <IconifyIcon icon="bx:plus" className="me-1" />
//                 Create Complaint
//               </Button>
//             </div>
//           </div>
//         </CardBody>
        
//         <ComplaintsListView 
//           complaints={paginatedComplaints}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalComplaints={filteredComplaints.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={handlePageChange}
//           onDeleteComplaint={handleDeleteClick}
//           onEditComplaint={handleEditClick}
//           deletingId={deleting ? selectedComplaintId : null}
//           tenantSlug={tenantSlug}
//         />
//       </Card>

//       <CreateComplaintModal 
//         show={showModal}
//         handleClose={handleModalClose}
//         refreshComplaints={refreshComplaints}
//         tenantSlug={tenantSlug}
//         editMode={editMode}
//         complaintToEdit={selectedComplaint}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {deleteError && (
//             <Alert variant="danger" onClose={() => setDeleteError(null)} dismissible>
//               {deleteError}
//             </Alert>
//           )}
          
//           {deleteSuccess && (
//             <Alert variant="success">
//               {deleteSuccess}
//             </Alert>
//           )}
          
//           {!deleteSuccess && (
//             <>
//               <p>Are you sure you want to delete the complaint <strong>"{selectedComplaintTitle}"</strong>?</p>
//               <p className="text-muted small">Complaint ID: {selectedComplaintId}</p>
//               <p>This action cannot be undone.</p>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDeleteConfirm}
//             disabled={deleting || deleteSuccess || !selectedComplaintId}
//           >
//             {deleting ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-1" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon="bx:trash" className="me-1" />
//                 Delete
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ComplaintsList;



import { useState } from 'react';
import { Card, CardBody, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MaintenanceListView from './MaintenanceListView';
import CreateMaintenanceModal from './CreateMaintenanceModal';

const MaintenanceList = ({ maintenance, loading, refreshMaintenance, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);
  const [selectedMaintenanceTitle, setSelectedMaintenanceTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuthContext();
  const itemsPerPage = 10;

  // Filter maintenance based on search term
  const filteredMaintenance = maintenance.filter(maintenance => 
    maintenance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.maintenance_id?.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMaintenance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaintenance = filteredMaintenance.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedMaintenance(null);
    setShowModal(true);
  };

  const handleEditClick = (maintenance) => {
    console.log('Editing maintenance clicked:', maintenance);
    console.log('Maintenance ID:', maintenance.id || maintenance.maintenance_id);
    console.log('Maintenance Title:', maintenance.title);
    
    setEditMode(true);
    setSelectedMaintenance(maintenance);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (maintenanceOrId) => {
    console.log('Delete clicked for:', maintenanceOrId);
    
    // Check if we received just an ID (number or string) or a full maintenance object
    if (typeof maintenanceOrId === 'number' || typeof maintenanceOrId === 'string') {
      // We received just an ID
      const maintenanceId = maintenanceOrId;
      console.log('Received only ID:', maintenanceId);
      
      // Find the full maintenance object from the maintenance list
      const fullMaintenance = maintenance.find(m => 
        m.id === maintenanceId || 
        m.maintenance_id === maintenanceId ||
        m._id === maintenanceId
      );
      
      if (fullMaintenance) {
        console.log('Found full maintenance:', fullMaintenance);
        setSelectedMaintenance(fullMaintenance);
        setSelectedMaintenanceId(maintenanceId);
        setSelectedMaintenanceTitle(fullMaintenance.title || 'Unknown Maintenance');
      } else {
        console.log('No full maintenance found, using ID only');
        setSelectedMaintenance(null);
        setSelectedMaintenanceId(maintenanceId);
        setSelectedMaintenanceTitle('Unknown Maintenance');
      }
    } else {
      // We received a full maintenance object
      console.log('Received full maintenance object:', maintenanceOrId);
      setSelectedMaintenance(maintenanceOrId);
      setSelectedMaintenanceId(maintenanceOrId.id || maintenanceOrId.maintenance_id || maintenanceOrId._id);
      setSelectedMaintenanceTitle(maintenanceOrId.title || 'Unknown Maintenance');
    }
    
    setShowDeleteModal(true);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMaintenanceId) {
      setDeleteError('No maintenance ID found for deletion');
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

      console.log('Deleting maintenance with ID:', selectedMaintenanceId);

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/delete/${selectedMaintenanceId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );

      setDeleteSuccess('Maintenance request deleted successfully!');
      refreshMaintenance();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
        setSelectedMaintenance(null);
        setSelectedMaintenanceId(null);
        setSelectedMaintenanceTitle('');
      }, 1500);
      
    } catch (error) {
      setDeleteError(error.response?.data?.message || error.message || 'Failed to delete maintenance request');
      console.error('Error deleting maintenance:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedMaintenance(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading maintenance requests...</div>;
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
                placeholder="Search maintenance requests..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <div>
              <Button 
                variant="primary" 
                className="d-inline-flex align-items-center"
                onClick={handleAddClick}
              >
                <IconifyIcon icon="bx:plus" className="me-1" />
                Create Maintenance Request
              </Button>
            </div> */}
          </div>
        </CardBody>
        
        <MaintenanceListView 
          maintenance={paginatedMaintenance}
          currentPage={currentPage}
          totalPages={totalPages}
          totalMaintenance={filteredMaintenance.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onDeleteMaintenance={handleDeleteClick}
          onEditMaintenance={handleEditClick}
          deletingId={deleting ? selectedMaintenanceId : null}
          tenantSlug={tenantSlug}
        />
      </Card>

      <CreateMaintenanceModal 
        show={showModal}
        handleClose={handleModalClose}
        refreshMaintenance={refreshMaintenance}
        tenantSlug={tenantSlug}
        editMode={editMode}
        maintenanceToEdit={selectedMaintenance}
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
              <p>Are you sure you want to delete the maintenance request <strong>"{selectedMaintenanceTitle}"</strong>?</p>
              <p className="text-muted small">Maintenance ID: {selectedMaintenanceId}</p>
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
            disabled={deleting || deleteSuccess || !selectedMaintenanceId}
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

export default MaintenanceList;