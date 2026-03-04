import { useState } from 'react';
import { Card, CardBody, Button } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MaintenanceListView from './MaintenanceListView';
import CreateMaintenanceModal from './CreateMaintenanceModal';
import ViewMaintenanceModal from './ViewMaintenanceModal'; // Import the separate modal

const MaintenanceList = ({ maintenance, loading, refreshMaintenance, tenantSlug }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // Add view modal state
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuthContext();
  const itemsPerPage = 10;

  // Filter maintenance based on search term
  const filteredMaintenance = maintenance.filter(item => 
    item.maintenance_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maintenance_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maintenance_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maintenance_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maintenance_id?.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMaintenance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaintenance = filteredMaintenance.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedMaintenance(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (maintenance) => {
    const maintenanceId = maintenance.id || maintenance.maintenance_id;
    
    setEditMode(true);
    setSelectedMaintenance(maintenance);
    setShowCreateModal(true);
  };

  const handleViewClick = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowViewModal(true); // Open the view modal
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setEditMode(false);
    setSelectedMaintenance(null);
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
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
            <div>
              <Button 
                variant="primary" 
                className="d-inline-flex align-items-center"
                onClick={handleAddClick}
              >
                <IconifyIcon icon="bx:plus" className="me-1" />
                Create Maintenance Request
              </Button>
            </div>
          </div>
        </CardBody>
        
        <MaintenanceListView 
          maintenance={paginatedMaintenance}
          currentPage={currentPage}
          totalPages={totalPages}
          totalMaintenance={filteredMaintenance.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onEditMaintenance={handleEditClick}
          onViewMaintenance={handleViewClick} // Pass the view handler
          deletingId={deleting ? (selectedMaintenance?.id || selectedMaintenance?.maintenance_id) : null}
          tenantSlug={tenantSlug}
        />
      </Card>

      <CreateMaintenanceModal 
        show={showCreateModal}
        handleClose={handleCreateModalClose}
        refreshMaintenance={refreshMaintenance}
        tenantSlug={tenantSlug}
        editMode={editMode}
        maintenanceToEdit={selectedMaintenance}
      />

      <ViewMaintenanceModal
        show={showViewModal}
        handleClose={handleViewModalClose}
        maintenance={selectedMaintenance}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default MaintenanceList;