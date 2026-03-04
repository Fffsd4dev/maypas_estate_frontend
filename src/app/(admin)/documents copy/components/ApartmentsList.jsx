import { useState, useRef } from 'react';
import { 
  Card, 
  CardBody, 
  Col, 
  Row, 
  Button, 
  Alert, 
  Spinner,
  Badge,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Table,
  Modal
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import CreateDocumentModal from './CreateDocumentModal';
import UploadDocumentModal from './UploadDocumentModal';
import { useAuthContext } from '@/context/useAuthContext';

const ApartmentsList = ({ 
  apartments, 
  selectedApartment, 
  units,
  loading, 
  apiError,
  onApartmentSelect,
  onApartmentDeselect,
  refreshData,
  tenantSlug
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuthContext();

  const apartmentsArray = Array.isArray(apartments) ? apartments : [];
  const unitsArray = Array.isArray(units) ? units : [];

  // Filter apartments based on search term
  const filteredApartments = apartmentsArray.filter(apartment => 
    apartment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter units based on search term
  const filteredUnits = unitsArray.filter(unit => 
    unit.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleUnitDocumentClick = (unit) => {
    alert(`Create document for unit ${unit.unit_number} in ${selectedApartment.name}. This feature will be implemented soon.`);
  };

  const handleApartmentSelect = (apartment) => {
    onApartmentSelect(apartment);
    setShowDropdown(false);
    setSearchTerm(''); // Clear search when apartment is selected
  };

  const handleBackToApartments = () => {
    onApartmentDeselect();
    setSearchTerm(''); // Clear search
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading apartments...</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Action Bar with Dropdown */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                {/* Left Side: Apartment Dropdown or Selected Apartment Info */}
                <div className="flex-grow-1">
                  {!selectedApartment ? (
                    <div className="position-relative" ref={dropdownRef}>
                      <InputGroup>
                        <InputGroup.Text>
                          <IconifyIcon icon="bx:building" />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Select an apartment..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={() => setShowDropdown(true)}
                          readOnly={!showDropdown}
                          className="cursor-pointer"
                          style={{ cursor: 'pointer' }}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowDropdown(!showDropdown)}
                        >
                          <IconifyIcon icon={showDropdown ? "bx:chevron-up" : "bx:chevron-down"} />
                        </Button>
                      </InputGroup>
                      
                      {/* Dropdown Menu */}
                      {showDropdown && apartmentsArray.length > 0 && (
                        <div 
                          className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg z-3"
                          style={{ maxHeight: '300px', overflowY: 'auto' }}
                        >
                          <div className="p-2 border-bottom bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {filteredApartments.length} apartments
                              </small>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0"
                                onClick={() => setShowDropdown(false)}
                              >
                                <IconifyIcon icon="bx:x" />
                              </Button>
                            </div>
                          </div>
                          
                          {filteredApartments.length === 0 ? (
                            <div className="p-3 text-center text-muted">
                              No apartments found matching "{searchTerm}"
                            </div>
                          ) : (
                            <div className="py-1">
                              {filteredApartments.map((apartment) => (
                                <div
                                  key={apartment.id}
                                  className="px-3 py-2 hover-bg-light cursor-pointer"
                                  onClick={() => handleApartmentSelect(apartment)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="fw-medium">{apartment.name || 'Unnamed Apartment'}</div>
                                      <div className="text-muted small">
                                        {apartment.address}
                                      </div>
                                    </div>
                                    <div className="text-end">
                                      <Badge bg="info" className="me-1">
                                        {apartment.unit_count || 0} units
                                      </Badge>
                                      <div className="text-muted small">
                                        {apartment.code || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-3">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={handleBackToApartments}
                      >
                        <IconifyIcon icon="bx:arrow-back" className="me-1" />
                        Back
                      </Button>
                      <div>
                        <h5 className="mb-0 d-flex align-items-center gap-2">
                          <IconifyIcon icon="bx:building" style={{ fontSize: '20px' }} />
                          {selectedApartment.name}
                          <Badge bg="primary" className="ms-2">
                            {unitsArray.length} Units
                          </Badge>
                        </h5>
                        <p className="text-muted mb-0">{selectedApartment.address}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Side: Action Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={handleUploadClick}
                  >
                    <IconifyIcon icon="bx:upload" className="me-1" />
                    Upload
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleCreateClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Create Document
                  </Button>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="mt-3">
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="warning">
                    Unsigned
                  </Badge>
                  <span className="text-muted">
                    {selectedApartment 
                      ? `${unitsArray.length} unit${unitsArray.length !== 1 ? 's' : ''} in ${selectedApartment.name}`
                      : apartmentsArray.length === 0 
                        ? 'No apartments available' 
                        : `${apartmentsArray.length} apartment${apartmentsArray.length !== 1 ? 's' : ''} available`
                    }
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* API Error State */}
      {apiError && apartmentsArray.length === 0 && (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <IconifyIcon icon="bx:building-house" style={{ fontSize: '48px', color: '#6c757d' }} />
            </div>
            <h5>No apartments available</h5>
            <p className="text-muted">
              {apiError.includes('endpoint not found') 
                ? 'The apartments API is not configured yet.' 
                : 'Unable to load apartments.'}
            </p>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button 
                variant="outline-primary" 
                onClick={handleUploadClick}
              >
                <IconifyIcon icon="bx:upload" className="me-1" />
                Upload Document
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCreateClick}
              >
                <IconifyIcon icon="bi:plus" className="me-1" />
                Create Document
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* No Apartments State */}
      {!apiError && apartmentsArray.length === 0 && !selectedApartment && (
        <Card className="mt-3">
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <IconifyIcon icon="bx:building-house" style={{ fontSize: '48px', color: '#6c757d' }} />
            </div>
            <h5>No apartments found</h5>
            <p className="text-muted">
              There are no apartments available to assign documents to.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button 
                variant="outline-primary" 
                onClick={handleUploadClick}
              >
                <IconifyIcon icon="bx:upload" className="me-1" />
                Upload Document
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCreateClick}
              >
                <IconifyIcon icon="bi:plus" className="me-1" />
                Create Document
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Units Table (when apartment is selected) */}
      {selectedApartment && (
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                {/* Search for units */}
                <div className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <IconifyIcon icon="bx:search-alt" />
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Search units by number, tenant, or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <IconifyIcon icon="bx:x" />
                      </Button>
                    )}
                  </InputGroup>
                </div>

                {/* Units Table */}
                {filteredUnits.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    {searchTerm 
                      ? `No units found matching "${searchTerm}"`
                      : 'No units available in this apartment'
                    }
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Unit Number</th>
                          <th>Tenant</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Rent</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUnits.map((unit) => (
                          <tr key={unit.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <IconifyIcon 
                                  icon="bx:home" 
                                  style={{ fontSize: '18px', color: '#0d6efd' }} 
                                />
                                <span className="fw-semibold">{unit.unit_number}</span>
                              </div>
                            </td>
                            <td>
                              {unit.tenant_name ? (
                                <div>
                                  <div className="fw-medium">{unit.tenant_name}</div>
                                  {unit.tenant_email && (
                                    <div className="text-muted small">{unit.tenant_email}</div>
                                  )}
                                </div>
                              ) : (
                                <Badge bg="secondary">Vacant</Badge>
                              )}
                            </td>
                            <td>
                              <Badge bg="info" className="fw-normal">
                                {unit.type || 'Standard'}
                              </Badge>
                            </td>
                            <td>
                              <Badge 
                                bg={unit.status === 'occupied' ? 'success' : 
                                    unit.status === 'vacant' ? 'warning' : 'secondary'}
                                className="fw-normal"
                              >
                                {unit.status || 'unknown'}
                              </Badge>
                            </td>
                            <td>
                              <span className="fw-medium">
                                {unit.rent_amount ? `$${unit.rent_amount}/mo` : 'N/A'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Dropdown>
                                  <Dropdown.Toggle variant="outline-primary" size="sm" id="dropdown-document-actions">
                                    <IconifyIcon icon="bx:file-plus" className="me-1" />
                                    Document
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleUnitDocumentClick(unit)}>
                                      <IconifyIcon icon="bx:file" className="me-2" />
                                      Create New Document
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <IconifyIcon icon="bx:upload" className="me-2" />
                                      Upload Document
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>
                                      <IconifyIcon icon="bx:list-check" className="me-2" />
                                      View Existing Documents
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                <Button
                                  variant="light"
                                  size="sm"
                                  title="View Unit Details"
                                >
                                  <IconifyIcon icon="bx:show" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Summary Info */}
                <div className="mt-3 pt-3 border-top">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="text-muted small">Total Units</div>
                        <div className="h4 mb-0">{unitsArray.length}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="text-muted small">Occupied</div>
                        <div className="h4 mb-0 text-success">
                          {unitsArray.filter(u => u.status === 'occupied').length}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="text-muted small">Vacant</div>
                        <div className="h4 mb-0 text-warning">
                          {unitsArray.filter(u => u.status === 'vacant').length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Show apartments list only when no apartment is selected and no error */}
      {!selectedApartment && !apiError && apartmentsArray.length > 0 && (
        <Card className="mt-3">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Available Apartments</h5>
              <small className="text-muted">
                Click the dropdown above to select an apartment
              </small>
            </div>
            <div className="alert alert-info mb-0">
              <IconifyIcon icon="bx:info-circle" className="me-2" />
              Select an apartment from the dropdown to view its units and manage documents.
            </div>
          </CardBody>
        </Card>
      )}

      {/* Modals */}
      <CreateDocumentModal 
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshDocuments={refreshData}
        editMode={false}
        documentToEdit={null}
        tenantSlug={tenantSlug}
        apiError={apiError}
      />

      <UploadDocumentModal 
        show={showUploadModal}
        handleClose={() => setShowUploadModal(false)}
        refreshDocuments={refreshData}
        tenantSlug={tenantSlug}
      />

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="position-fixed top-0 left-0 w-100 h-100"
          style={{ zIndex: 2 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
};

export default ApartmentsList;