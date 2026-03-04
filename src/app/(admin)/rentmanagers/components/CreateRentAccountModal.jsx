import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateRentAccountModal = ({ 
  show, 
  handleClose, 
  refreshRentAccounts,
  onRentAccountUpdate,
  editMode = false,
  rentAccountToEdit = null,
  estateSlug,
  tenants,
  apartments // This is actually an array of categories
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    occupant_uuid: '',
    apartment_unit_uuid: '',
    start_date: '',
    account_type: 'one-off',
    termination_date: '',
    is_active: true,
    first_rent: '',
    first_rent_expiry: '',
    first_payment_paid: false
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [apartmentsInCategory, setApartmentsInCategory] = useState([]);
  const [unitsInApartment, setUnitsInApartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // New state for tenant dropdown
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [selectedTenantDisplay, setSelectedTenantDisplay] = useState('Select Tenant');
  const dropdownRef = useRef(null);

  // The "apartments" prop is actually an array of categories
  useEffect(() => {
    if (apartments && apartments.length > 0) {
      setCategories(apartments);
    }
  }, [apartments]);

  useEffect(() => {
    if (editMode && rentAccountToEdit) {
      // For edit mode, populate all available fields
      setFormData({
        occupant_uuid: rentAccountToEdit.occupant_uuid || '',
        apartment_unit_uuid: rentAccountToEdit.apartment_unit_uuid || '',
        start_date: rentAccountToEdit.start_date ? rentAccountToEdit.start_date.split(' ')[0] : '',
        account_type: rentAccountToEdit.account_type || 'one-off',
        termination_date: rentAccountToEdit.termination_date ? rentAccountToEdit.termination_date.split(' ')[0] : '',
        is_active: rentAccountToEdit.is_active !== undefined ? rentAccountToEdit.is_active : true,
        first_rent: rentAccountToEdit.first_rent || '',
        first_rent_expiry: rentAccountToEdit.first_rent_expiry ? rentAccountToEdit.first_rent_expiry.split(' ')[0] : '',
        first_payment_paid: rentAccountToEdit.first_payment_paid || false
      });

      // Set selected tenant display
      if (rentAccountToEdit.occupant_uuid && tenants.length > 0) {
        const tenant = tenants.find(t => t.uuid === rentAccountToEdit.occupant_uuid);
        if (tenant) {
          setSelectedTenantDisplay(`${tenant.first_name} ${tenant.last_name} (${tenant.email})`);
        }
      }

      // Pre-select based on existing data
      if (rentAccountToEdit.apartment_unit_uuid) {
        const unitInfo = findUnitByUuid(rentAccountToEdit.apartment_unit_uuid);
        if (unitInfo) {
          setSelectedCategory(unitInfo.category);
          setApartmentsInCategory(unitInfo.category.apartments || []);
          setSelectedApartment(unitInfo.apartment);
          setUnitsInApartment(unitInfo.apartment.apartment_units || []);
          setSelectedUnit(unitInfo.unit);
        }
      }
    } else {
      // For create mode, reset form
      setFormData({
        occupant_uuid: '',
        apartment_unit_uuid: '',
        start_date: '',
        account_type: 'one-off',
        termination_date: '',
        is_active: true,
        first_rent: '',
        first_rent_expiry: '',
        first_payment_paid: false
      });
      setSelectedCategory(null);
      setSelectedApartment(null);
      setSelectedUnit(null);
      setApartmentsInCategory([]);
      setUnitsInApartment([]);
      setSelectedTenantDisplay('Select Tenant');
      setTenantSearchTerm('');
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, rentAccountToEdit, tenants]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTenantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to find unit by UUID
  const findUnitByUuid = (unitUuid) => {
    if (!categories || !Array.isArray(categories)) return null;
    
    for (const category of categories) {
      for (const apartment of category.apartments || []) {
        const units = apartment.apartment_units || [];
        const unit = units.find(u => u.apartment_unit_uuid === unitUuid);
        if (unit) {
          return { unit, apartment, category };
        }
      }
    }
    return null;
  };

  // Filter tenants based on search term
  const getFilteredTenants = () => {
    if (!tenants || !Array.isArray(tenants)) return [];
    if (!tenantSearchTerm.trim()) return tenants;
    
    const searchLower = tenantSearchTerm.toLowerCase();
    return tenants.filter(tenant => 
      tenant.first_name?.toLowerCase().includes(searchLower) ||
      tenant.last_name?.toLowerCase().includes(searchLower) ||
      tenant.email?.toLowerCase().includes(searchLower) ||
      `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchLower) ||
      tenant.phone?.toLowerCase().includes(searchLower)
    );
  };

  const handleTenantSelect = (tenant) => {
    setFormData(prev => ({
      ...prev,
      occupant_uuid: tenant.uuid
    }));
    setSelectedTenantDisplay(`${tenant.first_name} ${tenant.last_name} (${tenant.email})`);
    setIsTenantDropdownOpen(false);
    setTenantSearchTerm('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Level 1: Category Selection
  const handleCategoryChange = (e) => {
    const categoryIndex = e.target.value;
    
    if (categoryIndex !== '') {
      const category = categories[categoryIndex];
      setSelectedCategory(category);
      
      // The apartments are inside the category object
      const categoryApartments = category?.apartments || [];
      setApartmentsInCategory(categoryApartments);
      
      // Reset all lower level selections
      setSelectedApartment(null);
      setSelectedUnit(null);
      setUnitsInApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    } else {
      setSelectedCategory(null);
      setApartmentsInCategory([]);
      setSelectedApartment(null);
      setSelectedUnit(null);
      setUnitsInApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    }
  };

  // Level 2: Apartment Selection
  const handleApartmentChange = (e) => {
    const apartmentIndex = e.target.value;
    
    if (apartmentIndex !== '') {
      const apartment = apartmentsInCategory[apartmentIndex];
      
      if (apartment) {
        setSelectedApartment(apartment);
        // The units are inside the apartment object as apartment_units
        const units = apartment.apartment_units || [];
        setUnitsInApartment(units);
        
        // Reset unit selection
        setSelectedUnit(null);
        setFormData(prev => ({
          ...prev,
          apartment_unit_uuid: ''
        }));
      } else {
        setSelectedApartment(null);
        setUnitsInApartment([]);
        setSelectedUnit(null);
      }
    } else {
      setSelectedApartment(null);
      setUnitsInApartment([]);
      setSelectedUnit(null);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    }
  };

  // Level 3: Unit Selection
  const handleUnitChange = (e) => {
    const unitIndex = e.target.value;
    
    if (unitIndex !== '') {
      const unit = unitsInApartment[unitIndex];
      setSelectedUnit(unit);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: unit?.apartment_unit_uuid || ''
      }));
    } else {
      setSelectedUnit(null);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!estateSlug) {
        throw new Error('Estate slug not found');
      }

      if (!formData.apartment_unit_uuid) {
        throw new Error('Please select an apartment unit');
      }

      // Account type specific validations
      if (formData.account_type === 'one-off') {
        // For one-off accounts, first_rent and first_rent_expiry are required
        if (!formData.first_rent || parseFloat(formData.first_rent) <= 0) {
          throw new Error('Please enter a valid first rent amount for one-off payment');
        }
        if (!formData.first_rent_expiry) {
          throw new Error('Please enter first rent expiry date for one-off payment');
        }
      } else if (formData.account_type === 'recurrent') {
        // For recurrent accounts, first_rent is still required but can be the initial payment
        if (!formData.first_rent || parseFloat(formData.first_rent) <= 0) {
          throw new Error('Please enter a valid first rent amount for recurrent account');
        }
        if (!formData.first_rent_expiry) {
          throw new Error('Please enter first rent expiry date for recurrent account');
        }
      }

      // Format dates for API
      const formattedData = {
        ...formData,
        start_date: formData.start_date ? `${formData.start_date} 00:00:00` : '',
        first_rent_expiry: formData.first_rent_expiry ? `${formData.first_rent_expiry} 00:00:00` : '',
        termination_date: formData.termination_date ? `${formData.termination_date} 00:00:00` : undefined,
        first_rent: parseFloat(formData.first_rent) || 0
      };

      // Remove termination_date if empty
      if (!formData.termination_date) {
        delete formattedData.termination_date;
      }

      // Add account_type specific data if needed
      if (formData.account_type === 'recurrent') {
        formattedData.is_recurrent = true;
      } else {
        formattedData.is_recurrent = false;
      }

      let url;
      let method;

      if (editMode && rentAccountToEdit) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/update/${rentAccountToEdit.uuid}`;
        method = 'put';
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/create`;
        method = 'post';
      }

      const response = await axios[method](
        url,
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      
      // Call the update function to update the UI in real-time
      if (onRentAccountUpdate && response.data.data) {
        onRentAccountUpdate(response.data.data, editMode);
      }
      
      // Also refresh the full list as backup
      refreshRentAccounts();
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('API Error details:', err);
      setError(err.response?.data?.message || 
        (editMode ? 'Failed to update rent account' : 'Failed to create rent account'));
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTenantName = (uuid) => {
    const tenant = tenants.find(t => t.uuid === uuid);
    return tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown Tenant';
  };

  const getCategoryName = (category) => {
    return category?.name || 'Unnamed Category';
  };

  const getApartmentName = (apartment) => {
    return apartment?.name || `Apartment ${apartment?.uuid || 'N/A'}`;
  };

  const getUnitDisplayName = (unit) => {
    return unit?.apartment_unit_name || `Unit ${unit?.id || 'N/A'}`;
  };

  const filteredTenants = getFilteredTenants();

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="w-100">
          {editMode ? 'Edit Rent Account' : 'Create New Rent Account'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Rent account updated successfully!' : 'Rent account created successfully!'}
            </Alert>
          )}

          <h6 className="mb-3">Basic Information</h6>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Tenant (Occupant) *</Form.Label>
                
                {/* Custom dropdown with search */}
                <div className="custom-dropdown" ref={dropdownRef}>
                  <div 
                    className={`dropdown-select ${!formData.occupant_uuid ? 'text-muted' : ''}`}
                    onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                  >
                    <span>{selectedTenantDisplay}</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  
                  {isTenantDropdownOpen && (
                    <div className="dropdown-menu show">
                      {/* Search input inside dropdown */}
                      <div className="dropdown-search">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search tenants..."
                          value={tenantSearchTerm}
                          onChange={(e) => setTenantSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      
                      {/* Dropdown options */}
                      <div className="dropdown-options">
                        {filteredTenants.length > 0 ? (
                          filteredTenants.map(tenant => (
                            <div
                              key={tenant.uuid}
                              className={`dropdown-item ${formData.occupant_uuid === tenant.uuid ? 'active' : ''}`}
                              onClick={() => handleTenantSelect(tenant)}
                            >
                              <div className="tenant-name">
                                {tenant.first_name} {tenant.last_name}
                              </div>
                              <div className="tenant-details small text-muted">
                                {tenant.email}
                                {tenant.phone && ` • ${tenant.phone}`}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-item text-muted">
                            No tenants found
                          </div>
                        )}
                      </div>
                      
                      {/* Show total count */}
                      <div className="dropdown-footer small text-muted">
                        {filteredTenants.length} tenant(s) found
                      </div>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3">Apartment Selection</h6>
          
          {/* Level 1: Category Selection */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apartment Category *</Form.Label>
                <Form.Select
                  value={selectedCategory ? categories.indexOf(selectedCategory) : ''}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={index}>
                      {getCategoryName(category)}
                      {category.apartments && ` (${category.apartments.length} apartments)`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            {selectedCategory && (
            <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apartment *</Form.Label>
                  <Form.Select
                    value={selectedApartment ? apartmentsInCategory.indexOf(selectedApartment) : ''}
                    onChange={handleApartmentChange}
                    required
                  >
                    <option value="">Select Apartment</option>
                    {apartmentsInCategory.map((apartment, index) => (
                      <option key={index} value={index}>
                        {getApartmentName(apartment)}
                        {apartment.apartment_units && ` (${apartment.apartment_units.length} units)`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            {selectedApartment && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apartment Unit *</Form.Label>
                  <Form.Select
                    value={selectedUnit ? unitsInApartment.indexOf(selectedUnit) : ''}
                    onChange={handleUnitChange}
                    required
                    disabled={unitsInApartment.length === 0}
                  >
                    <option value="">Select Unit</option>
                    {unitsInApartment.map((unit, index) => (
                      <option key={index} value={index}>
                        {getUnitDisplayName(unit)}
                      </option>
                    ))}
                  </Form.Select>
                  {unitsInApartment.length === 0 && (
                    <Form.Text className="text-warning">
                      No units available for this apartment
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            )}
          </Row>

          {/* Rent Account Details */}
          <h6 className="mb-3 mt-4">Rent Account Details</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Type *</Form.Label>
                <Form.Select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  required
                >
                  <option value="one-off">One-off</option>
                  <option value="recurrent">Recurrent</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  {formData.account_type === 'one-off' 
                    ? 'One-time payment for short-term rentals' 
                    : 'Ongoing payments for long-term rentals'}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {formData.account_type === 'one-off' ? 'Payment Amount *' : 'First Rent Amount *'}
                </Form.Label>
                <Form.Control
                  type="number"
                  name="first_rent"
                  value={formData.first_rent}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder={formData.account_type === 'one-off' ? 'Enter one-time payment amount' : 'Enter first rent amount'}
                />
                <Form.Text className="text-muted">
                  {formData.account_type === 'one-off' 
                    ? 'Total amount for the one-off payment' 
                    : 'Initial payment amount for recurrent account'}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {formData.account_type === 'one-off' ? 'Payment Due Date *' : 'First Rent Due Date *'}
                </Form.Label>
                <Form.Control
                  type="date"
                  name="first_rent_expiry"
                  value={formData.first_rent_expiry}
                  onChange={handleChange}
                  required
                />
                <Form.Text className="text-muted">
                  {formData.account_type === 'one-off' 
                    ? 'Due date for the one-time payment' 
                    : 'Due date for the first payment'}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Termination Date</Form.Label>
                <Form.Control
                  type="date"
                  name="termination_date"
                  value={formData.termination_date}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  {formData.account_type === 'one-off' 
                    ? 'Optional - end date for short-term rental' 
                    : 'Optional - for fixed-term recurrent rentals'}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="is_active"
                  label="Active Account"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Payment Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="first_payment_paid"
                  label="First Payment Paid"
                  checked={formData.first_payment_paid}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <>
              <IconifyIcon icon="eos-icons:loading" className="me-1" />
              {editMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
              {editMode ? 'Save Changes' : 'Create Rent Account'}
            </>
          )}
        </Button>
      </Modal.Footer>

      {/* Custom styles for the dropdown */}
      <style jsx>{`
        .custom-dropdown {
          position: relative;
          width: 100%;
        }
        .dropdown-select {
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #212529;
          background-color: #fff;
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dropdown-select:hover {
          border-color: #86b7fe;
        }
        .dropdown-arrow {
          font-size: 0.8rem;
          color: #6c757d;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1060;
          min-width: 100%;
          margin-top: 0.125rem;
          background-color: #fff;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
        }
        .dropdown-search {
          padding: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        .dropdown-options {
          max-height: 250px;
          overflow-y: auto;
        }
        .dropdown-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #f8f9fa;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        .dropdown-item.active {
          background-color: #e7f1ff;
          color: #0d6efd;
        }
        .tenant-name {
          font-weight: 500;
        }
        .tenant-details {
          font-size: 0.875rem;
        }
        .dropdown-footer {
          padding: 0.5rem;
          border-top: 1px solid #e9ecef;
          text-align: center;
        }
      `}</style>
    </Modal>
  );
};

export default CreateRentAccountModal;


