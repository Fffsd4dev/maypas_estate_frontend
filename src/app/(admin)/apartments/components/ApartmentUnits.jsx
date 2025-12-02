import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import { Card, Row, Col, Button, Alert, Badge, Modal, Spinner, Pagination, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const ApartmentUnits = () => {
  const { apartmentUuid, tenantSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  
  // Get the apartment data from navigation state
  const [apartment, setApartment] = useState(location.state?.apartment);
  const [units, setUnits] = useState(apartment?.apartment_units || []);

  // State for modals and operations
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteUnitModal, setShowDeleteUnitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [unitName, setUnitName] = useState('');

  const ITEMS_PER_PAGE = 15;

  // Calculate pagination for units
  const totalPages = Math.ceil(units.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUnits = units.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Back to apartments path
  const backToApartmentsPath = `/${tenantSlug}/properties/apartments`;

  // Fetch amenities when component mounts
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        if (!user?.token) return;
        
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/amenity/all`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        setAmenities(response.data || []);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
      }
    };
    
    fetchAmenities();
  }, [user]);

  // Fetch apartment data if not passed via state
  useEffect(() => {
    const fetchApartmentData = async () => {
      if ((!apartment || !apartment.apartment_units) && apartmentUuid) {
        try {
          if (!user?.token) return;
          
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments/${apartmentUuid}`,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              }
            }
          );
          
          const apartmentData = response.data.data;
          setApartment(apartmentData);
          setUnits(apartmentData.apartment_units || []);
        } catch (error) {
          console.error('Failed to fetch apartment data:', error);
        }
      }
    };
    
    fetchApartmentData();
  }, [apartment, apartmentUuid, tenantSlug, user]);

  // Update units when apartment changes
  useEffect(() => {
    if (apartment && apartment.apartment_units) {
      setUnits(apartment.apartment_units);
    }
  }, [apartment]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Handle edit unit click
  const handleEditUnitClick = (unit) => {
    setSelectedUnit(unit);
    setUnitName(unit.apartment_unit_name);
    
    // Set selected amenities for this unit
    if (unit.amenities && Array.isArray(unit.amenities)) {
      setSelectedAmenities(unit.amenities.map(amenity => ({
        id: amenity.id,
        number: amenity.number || "1" // Default to "1" if not provided
      })));
    } else {
      setSelectedAmenities([]);
    }
    
    setShowEditUnitModal(true);
  };

  // Handle delete unit click
  const handleDeleteUnitClick = (unit) => {
    setSelectedUnit(unit);
    setShowDeleteUnitModal(true);
  };

  // Handle delete unit confirmation
  const handleDeleteUnitConfirm = async () => {
    setUnitLoading(true);
    setError(null);
    
    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!selectedUnit) {
        throw new Error('No unit selected for deletion');
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartment/unit/${selectedUnit.apartment_unit_uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setSuccess('Unit deleted successfully!');
      
      // Update the UI without reloading - create a completely new array
      const updatedUnits = units.filter(unit => unit.apartment_unit_uuid !== selectedUnit.apartment_unit_uuid);
      setUnits([...updatedUnits]); // Spread into new array to force re-render
      
      // Also update the apartment state
      setApartment(prev => ({
        ...prev,
        apartment_units: [...updatedUnits] // Spread into new array
      }));
      
      setTimeout(() => {
        setShowDeleteUnitModal(false);
        setSuccess(null);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete unit');
    } finally {
      setUnitLoading(false);
    }
  };

  // Handle amenity selection change
  const handleAmenityChange = (amenityId, isChecked) => {
    if (isChecked) {
      // Add amenity with default quantity of 1
      setSelectedAmenities(prev => [
        ...prev,
        { id: amenityId, number: "1" }
      ]);
    } else {
      // Remove amenity
      setSelectedAmenities(prev => prev.filter(a => a.id !== amenityId));
    }
  };

  // Handle amenity quantity change
  const handleAmenityQuantityChange = (amenityId, quantity) => {
    setSelectedAmenities(prev => 
      prev.map(a => a.id === amenityId ? { ...a, number: quantity } : a)
    );
  };

  // Handle update unit
  const handleUpdateUnit = async () => {
    setUnitLoading(true);
    setError(null);
    
    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!selectedUnit) {
        throw new Error('No unit selected for update');
      }

      const payload = {
        apartment_unit_name: unitName,
        apartment_unit_uuid: selectedUnit.apartment_unit_uuid,
        amenities: selectedAmenities
      };

      // Log the payload to console
      console.log("Update Unit Payload:", payload);
      console.log("Payload JSON:", JSON.stringify(payload, null, 2));
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartment/unit/update`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setSuccess('Unit updated successfully!');
      
      // Update the UI with the new data without reloading
      if (response.data && response.data.data) {
        const updatedUnit = response.data.data;
        
        // Update the units array - create a completely new array
        const updatedUnits = units.map(unit => 
          unit.apartment_unit_uuid === updatedUnit.apartment_unit_uuid 
            ? { ...unit, ...updatedUnit }
            : unit
        );
        
        setUnits([...updatedUnits]); // Spread into new array to force re-render
        
        // Also update the apartment state
        setApartment(prev => ({
          ...prev,
          apartment_units: [...updatedUnits] // Spread into new array
        }));
      } else {
        // If API doesn't return updated data, update based on what we sent
        const updatedUnits = units.map(unit => 
          unit.apartment_unit_uuid === selectedUnit.apartment_unit_uuid 
            ? { 
                ...unit, 
                apartment_unit_name: unitName,
                amenities: selectedAmenities,
                updated_at: new Date().toISOString()
              }
            : unit
        );
        
        setUnits([...updatedUnits]); // Spread into new array to force re-render
        
        // Also update the apartment state
        setApartment(prev => ({
          ...prev,
          apartment_units: [...updatedUnits] // Spread into new array
        }));
      }
      
      setTimeout(() => {
        setShowEditUnitModal(false);
        setSuccess(null);
      }, 1500);
      
    } catch (error) {
      console.error("Update Unit Error:", error);
      console.error("Error Response:", error.response);
      setError(error.response?.data?.message || 'Failed to update unit');
    } finally {
      setUnitLoading(false);
    }
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

  // Handle delete apartment
  const handleDeleteApartment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments/delete-apartment`,
        {
          data: {
            id: apartment.id,
          },
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Apartment deleted successfully!');
      setTimeout(() => {
        navigate(backToApartmentsPath);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete apartment');
    } finally {
      setLoading(false);
    }
  };

  // If no apartment data was passed, show error
  if (!apartment) {
    return (
      <>
        <PageBreadcrumb 
          subName="Account" 
          title="Apartment Units" 
          parentLink={backToApartmentsPath}
          parentText="Apartments"
        />
        <PageMetaData title="Units" />
        
        <Alert variant="danger" className="mt-3">
          <IconifyIcon icon="bx:error" className="me-2" />
          Apartment data not found. Please go back and try again.
        </Alert>
        <Button 
          variant="primary"
          onClick={() => navigate(backToApartmentsPath)}
        >
          <IconifyIcon icon="bx:arrow-back" className="me-1" />
          Back to Apartments
        </Button>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Account" 
        title={`Apartment Units - ${apartment.address}`} 
        parentLink={backToApartmentsPath}
        parentText="Apartments"
      />
      <PageMetaData title={`Units - ${apartment.address}`} />
      
      {/* Success/Error Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <IconifyIcon icon="bx:error" className="me-2" />
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <IconifyIcon icon="bx:check-circle" className="me-2" />
          {success}
        </Alert>
      )}

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{apartment.address}</h4>
                  <p className="text-muted mb-0">
                    <strong>Location:</strong> {apartment.location} | 
                    <strong> Category:</strong> {apartment.category_name}
                  </p>
                  <p className="text-muted mb-0">
                    <strong>Landlord ID:</strong> {apartment.land_lord.name || 'Not assigned'} | 
                    <strong> Estate:</strong> {apartment.estate_manager?.estate_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <Button 
                    variant="primary"
                    onClick={() => navigate(backToApartmentsPath)}
                    className="me-2"
                  >
                    <IconifyIcon icon="bx:arrow-back" className="me-1" />
                    Back to Apartments
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Apartment Units ({units.length})
                  <span className="text-muted ms-2">
                    (Showing {paginatedUnits.length} of {units.length})
                  </span>
                </h5>
                <Badge bg="info">
                  Category: {apartment.category_name}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {units.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>S/N</th>
                          <th>Unit Name</th>
                          <th>Created At</th>
                          <th>Updated At</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUnits.map((unit, index) => (
                          <tr key={unit.apartment_unit_uuid}>
                            <td>
                              <strong>{index + 1}</strong>
                            </td>
                            <td>
                              <span className="fw-semibold">{unit.apartment_unit_name}</span>
                            </td>
                            <td>
                              {new Date(unit.created_at).toLocaleDateString()}
                              <br />
                              <small className="text-muted">
                                {new Date(unit.created_at).toLocaleTimeString()}
                              </small>
                            </td>
                            <td>
                              {new Date(unit.updated_at).toLocaleDateString()}
                              <br />
                              <small className="text-muted">
                                {new Date(unit.updated_at).toLocaleTimeString()}
                              </small>
                            </td>
                            <td>
                              <Badge bg="success">Active</Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleEditUnitClick(unit)}
                                  title="Edit Unit"
                                >
                                  <IconifyIcon icon="bx:edit" />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteUnitClick(unit)}
                                  title="Delete Unit"
                                >
                                  <IconifyIcon icon="bx:trash" />
                                </Button>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => navigate(`/${tenantSlug}/properties/charges/${unit.apartment_unit_uuid}`)}
                                  title="Manage Charges"
                                >
                                  <IconifyIcon icon="bx:dollar" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination()}
                </>
              ) : (
                <div className="text-center py-5">
                  <IconifyIcon icon="bx:building" size="3rem" className="text-muted mb-3" />
                  <h5 className="text-muted">No units found for this apartment</h5>
                  <p className="text-muted">This apartment doesn't have any units yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Unit Confirmation Modal */}
      <Modal show={showDeleteUnitModal} onHide={() => setShowDeleteUnitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Unit Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <IconifyIcon icon="bx:error" className="me-2" />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <IconifyIcon icon="bx:check-circle" className="me-2" />
              {success}
            </Alert>
          )}
          
          {!success && selectedUnit && (
            <>
              <p>Are you sure you want to delete the unit <strong>"{selectedUnit.apartment_unit_name}"</strong>?</p>
              <p className="text-muted">
                Unit ID: {selectedUnit.id} | UUID: {selectedUnit.apartment_unit_uuid}
              </p>
              <p className="text-danger">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteUnitModal(false)}
            disabled={unitLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUnitConfirm}
            disabled={unitLoading || success}
          >
            {unitLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete Unit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Unit Modal */}
      <Modal show={showEditUnitModal} onHide={() => setShowEditUnitModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUnit && (
            <div>
              <div className="mb-3">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="Enter unit name"
                />
              </div>
              
              {/* <div className="mb-3">
                <Form.Label>Unit ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUnit.id}
                  disabled
                />
              </div>
              
              <div className="mb-3">
                <Form.Label>UUID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUnit.apartment_unit_uuid}
                  disabled
                />
              </div> */}
              
              <div className="mb-3">
                <Form.Label>Amenities</Form.Label>
                {amenities.length > 0 ? (
                  <div className="amenities-list">
                    {amenities.map(amenity => {
                      const isSelected = selectedAmenities.some(a => a.id === amenity.id);
                      const selectedAmenity = selectedAmenities.find(a => a.id === amenity.id);
                      
                      return (
                        <div key={amenity.id} className="mb-2 d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id={`amenity-${amenity.id}`}
                            label={amenity.name}
                            checked={isSelected}
                            onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                            className="me-2"
                          />
                          
                          {isSelected && (
                            <Form.Control
                              type="number"
                              min="1"
                              value={selectedAmenity?.number || "1"}
                              onChange={(e) => handleAmenityQuantityChange(amenity.id, e.target.value)}
                              style={{ width: '80px' }}
                              placeholder="Qty"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted">No amenities available</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowEditUnitModal(false)}
            disabled={unitLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateUnit}
            disabled={unitLoading}
          >
            {unitLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Updating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:save" className="me-1" />
                Update Unit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Apartment Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Apartment Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the apartment at <strong>{apartment.address}</strong>? 
          This will also delete all associated units and cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteApartment}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete Apartment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApartmentUnits;