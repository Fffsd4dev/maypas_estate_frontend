import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
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
  apartments,
  mode = 'account',
  rentCycleToEdit = null,
  rentAccountForCycle = null,
  onCycleUpdate
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
  
  const [cycleFormData, setCycleFormData] = useState({
    cycle_start_date: '',
    cycle_end_date: '',
    fee: '',
    is_paid: false
  });
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitsForSelectedApartment, setUnitsForSelectedApartment] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [selectedTenantDisplay, setSelectedTenantDisplay] = useState('Select Tenant');
  const dropdownRef = useRef(null);

  // Fetch units for selected apartment
  const fetchUnitsForApartment = async (apartmentUuid, preSelectedUnitUuid = null) => {
    if (!apartmentUuid) return;
    
    setLoadingUnits(true);
    setUnitsForSelectedApartment([]);
    setError(null);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/apartments/units/info`,
        {
          apartment_uuid: apartmentUuid
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      let units = [];
      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          units = response.data.data;
        } else if (typeof response.data.data === 'object') {
          if (response.data.data.units && Array.isArray(response.data.data.units)) {
            units = response.data.data.units;
          } else if (response.data.data.apartment_units && Array.isArray(response.data.data.apartment_units)) {
            units = response.data.data.apartment_units;
          } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
            units = response.data.data.data;
          } else {
            const values = Object.values(response.data.data);
            if (values.length > 0 && values[0] && typeof values[0] === 'object') {
              units = values;
            }
          }
        }
      }
      
      setUnitsForSelectedApartment(units);
      
      // If we have a pre-selected unit UUID, find and set it
      if (preSelectedUnitUuid && units.length > 0) {
        const existingUnit = units.find(u => u.apartment_unit_uuid === preSelectedUnitUuid);
        if (existingUnit) {
          setSelectedUnit(existingUnit);
        } else {
          
        }
      }
    } catch (error) {
      console.error('Error fetching apartment units:', error);
      setUnitsForSelectedApartment([]);
      setError(`Failed to load apartment units: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoadingUnits(false);
    }
  };

  // Function to initialize cycle edit mode data
  const initializeCycleEditMode = async () => {
    
    if (rentCycleToEdit) {
      
      setCycleFormData({
        cycle_start_date: rentCycleToEdit.cycle_start_date ? rentCycleToEdit.cycle_start_date.split(' ')[0] : '',
        cycle_end_date: rentCycleToEdit.cycle_end_date ? rentCycleToEdit.cycle_end_date.split(' ')[0] : '',
        fee: rentCycleToEdit.fee || '',
        is_paid: rentCycleToEdit.is_paid === "1" || rentCycleToEdit.is_paid === 1 || rentCycleToEdit.is_paid === true
      });
      
      // Set tenant display for informational purposes
      if (rentAccountForCycle?.occupant) {
        setSelectedTenantDisplay(`${rentAccountForCycle.occupant.first_name} ${rentAccountForCycle.occupant.last_name} (${rentAccountForCycle.occupant.email})`);
      } else if (rentAccountForCycle?.user) {
        setSelectedTenantDisplay(`${rentAccountForCycle.user.first_name} ${rentAccountForCycle.user.last_name} (${rentAccountForCycle.user.email})`);
      }
    } else {
      console.error('rentCycleToEdit is null or undefined in initializeCycleEditMode');
    }
  };

  // Reset and populate form based on mode
  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(false);
      
      if (mode === 'cycle') {
        initializeCycleEditMode();
      } else {
        // Reset form for creating new rent account
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
        setUnitsForSelectedApartment([]);
        setSelectedTenantDisplay('Select Tenant');
        setTenantSearchTerm('');
      }
    }
  }, [show, mode, rentCycleToEdit, rentAccountForCycle]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTenantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleCycleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCycleFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryIndex = e.target.value;
    
    if (categoryIndex !== '' && apartments && Array.isArray(apartments)) {
      const category = apartments[parseInt(categoryIndex)];
      setSelectedCategory(category);
      setSelectedApartment(null);
      setSelectedUnit(null);
      setUnitsForSelectedApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    } else {
      setSelectedCategory(null);
      setSelectedApartment(null);
      setSelectedUnit(null);
      setUnitsForSelectedApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    }
  };

  const handleApartmentChange = async (e) => {
    const apartmentUuid = e.target.value;
    
    if (apartmentUuid && selectedCategory && selectedCategory.apartments && Array.isArray(selectedCategory.apartments)) {
      const apartment = selectedCategory.apartments.find(apt => apt.uuid === apartmentUuid);
      setSelectedApartment(apartment);
      setSelectedUnit(null);
      setUnitsForSelectedApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
      
      // Fetch units without pre-selection for new apartment selection
      await fetchUnitsForApartment(apartmentUuid, null);
    } else {
      setSelectedApartment(null);
      setSelectedUnit(null);
      setUnitsForSelectedApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: ''
      }));
    }
  };

  const handleUnitChange = (e) => {
    const unitUuid = e.target.value;
    
    if (unitUuid && Array.isArray(unitsForSelectedApartment)) {
      const unit = unitsForSelectedApartment.find(u => u.apartment_unit_uuid === unitUuid);
      setSelectedUnit(unit);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: unitUuid
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

      if (mode === 'cycle') {
        // Update rent cycle
        
        if (!cycleFormData.cycle_start_date) {
          throw new Error('Please select a start date');
        }
        if (!cycleFormData.cycle_end_date) {
          throw new Error('Please select an end date');
        }
        if (!cycleFormData.fee || parseFloat(cycleFormData.fee) <= 0) {
          throw new Error('Please enter a valid fee amount');
        }

        // Get apartment_unit_uuid from rentAccountForCycle
        let apartmentUnitUuid = null;
        
        if (rentAccountForCycle?.apartment_unit_uuid) {
          apartmentUnitUuid = rentAccountForCycle.apartment_unit_uuid;
        } else if (rentAccountForCycle?.rent_manager?.apartment_unit_uuid) {
          apartmentUnitUuid = rentAccountForCycle.rent_manager.apartment_unit_uuid;
        }
        
        if (!apartmentUnitUuid) {
          throw new Error('Apartment unit UUID not found. The rent account does not have an apartment unit assigned.');
        }

        const cycleUuid = rentCycleToEdit?.uuid;
        
        if (!cycleUuid) {
          throw new Error('Rent cycle UUID not found');
        }

        const updateData = {
          apartment_unit_uuid: apartmentUnitUuid,
          cycle_start_date: `${cycleFormData.cycle_start_date} 00:00:00`,
          cycle_end_date: `${cycleFormData.cycle_end_date} 00:00:00`,
          fee: parseFloat(cycleFormData.fee),
          is_paid: cycleFormData.is_paid
        };

        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/cycle/update/${cycleUuid}`;
        
        await axios.put(apiUrl, updateData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (onCycleUpdate) {
          const updatedCycle = {
            ...rentCycleToEdit,
            uuid: cycleUuid,
            cycle_start_date: updateData.cycle_start_date,
            cycle_end_date: updateData.cycle_end_date,
            fee: updateData.fee,
            is_paid: updateData.is_paid ? "1" : "0"
          };
          onCycleUpdate(updatedCycle);
        }
        
        setSuccess(true);
        setTimeout(() => {
          handleClose();
          setSuccess(false);
        }, 1500);
        
      } else {
        // Create new rent account (no update, only create)
        if (!formData.apartment_unit_uuid) {
          throw new Error('Please select an apartment unit');
        }

        if (!formData.occupant_uuid) {
          throw new Error('Please select a tenant');
        }

        if (formData.account_type === 'one-off') {
          if (!formData.first_rent || parseFloat(formData.first_rent) <= 0) {
            throw new Error('Please enter a valid first rent amount for one-off payment');
          }
          if (!formData.first_rent_expiry) {
            throw new Error('Please enter first rent expiry date for one-off payment');
          }
        } else if (formData.account_type === 'recurrent') {
          if (!formData.first_rent || parseFloat(formData.first_rent) <= 0) {
            throw new Error('Please enter a valid first rent amount for recurrent account');
          }
          if (!formData.first_rent_expiry) {
            throw new Error('Please enter first rent expiry date for recurrent account');
          }
        }

        const formattedData = {
          ...formData,
          start_date: formData.start_date ? `${formData.start_date} 00:00:00` : '',
          first_rent_expiry: formData.first_rent_expiry ? `${formData.first_rent_expiry} 00:00:00` : '',
          termination_date: formData.termination_date ? `${formData.termination_date} 00:00:00` : undefined,
          first_rent: parseFloat(formData.first_rent) || 0,
          apartment_uuid: selectedApartment?.uuid
        };

        if (!formData.termination_date) {
          delete formattedData.termination_date;
        }

        if (formData.account_type === 'recurrent') {
          formattedData.is_recurrent = true;
        } else {
          formattedData.is_recurrent = false;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/create`;
        
        const response = await axios.post(url, formattedData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        setSuccess(true);
        
        if (onRentAccountUpdate && response.data.data) {
          onRentAccountUpdate(response.data.data, false);
        }
        
        refreshRentAccounts();
        
        setTimeout(() => {
          handleClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('API Error details:', err);
      setError(err.response?.data?.message || err.message || (mode === 'cycle' ? 'Failed to update rent cycle' : 'Failed to create rent account'));
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = getFilteredTenants();

  const renderUnits = () => {
    if (!Array.isArray(unitsForSelectedApartment)) {
      return <option value="">No units available</option>;
    }
    
    if (unitsForSelectedApartment.length === 0) {
      return <option value="">No units available</option>;
    }
    
    return unitsForSelectedApartment.map((unit, index) => {
      const unitName = unit.apartment_unit_name || 
                       unit.name || 
                       unit.unit_name || 
                       `Unit ${unit.unit_number || index + 1}`;
      const unitSize = unit.size || unit.area || '';
      
      return (
        <option 
          key={unit.apartment_unit_uuid || unit.uuid || index} 
          value={unit.apartment_unit_uuid || unit.uuid}
        >
          {unitName}
          {unitSize && ` (${unitSize})`}
          {unit.unit_number && ` - Unit ${unit.unit_number}`}
        </option>
      );
    });
  };

  const getModalTitle = () => {
    if (mode === 'cycle') {
      return 'Edit Rent Cycle';
    }
    return 'Create New Rent Account';
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="w-100">
          {getModalTitle()}
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
              {mode === 'cycle' ? 'Rent cycle updated successfully!' : 'Rent account created successfully!'}
            </Alert>
          )}


          {/* For Account Mode - Show Tenant and Apartment Selection */}
          {mode === 'account' && (
            <>
              <h6 className="mb-3">Basic Information</h6>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tenant (Occupant) *</Form.Label>
                    
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
                          
                          <div className="dropdown-footer small text-muted">
                            {filteredTenants.length} tenant(s) found
                          </div>
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {/* Apartment Selection Section - Only show for Account Mode */}
          {mode === 'account' && (
            <>
              <h6 className="mb-3">Apartment Selection</h6>
              
              {/* Category Selection */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      value={selectedCategory ? apartments.findIndex(cat => cat.name === selectedCategory.name) : ''}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {apartments && Array.isArray(apartments) && apartments.map((category, index) => (
                        <option key={index} value={index}>
                          {category.name} - {category.description || 'No description'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Apartment Selection */}
              {selectedCategory && selectedCategory.apartments && Array.isArray(selectedCategory.apartments) && selectedCategory.apartments.length > 0 && (
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apartment *</Form.Label>
                      <Form.Select
                        value={selectedApartment?.uuid || ''}
                        onChange={handleApartmentChange}
                        required
                      >
                        <option value="">Select Apartment</option>
                        {selectedCategory.apartments.map((apartment) => (
                          <option key={apartment.uuid} value={apartment.uuid}>
                            {apartment.name}
                            {apartment.address && ` - ${apartment.address}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Unit Selection */}
              {selectedApartment && (
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apartment Unit *</Form.Label>
                      <Form.Select
                        value={formData.apartment_unit_uuid}
                        onChange={handleUnitChange}
                        required
                        disabled={loadingUnits}
                      >
                        <option value="">{loadingUnits ? 'Loading units...' : 'Select Unit'}</option>
                        {!loadingUnits && renderUnits()}
                      </Form.Select>
                      {loadingUnits && (
                        <Form.Text className="text-info">
                          <IconifyIcon icon="eos-icons:loading" className="me-1" />
                          Loading units...
                        </Form.Text>
                      )}
                      {!loadingUnits && Array.isArray(unitsForSelectedApartment) && unitsForSelectedApartment.length === 0 && selectedApartment && (
                        <Form.Text className="text-warning">
                          No units available for this apartment. Please check if units have been added.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </>
          )}

          {/* Rent Account Details - Only show for Account Mode */}
          {mode === 'account' && (
            <>
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
                  </Form.Group>
                </Col>
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
            </>
          )}

          {/* Rent Cycle Details - Show for Cycle Mode */}
          {mode === 'cycle' && (
            <>
              <h6 className="mb-3 mt-4">Rent Cycle Details</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="cycle_start_date"
                      value={cycleFormData.cycle_start_date}
                      onChange={handleCycleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="cycle_end_date"
                      value={cycleFormData.cycle_end_date}
                      onChange={handleCycleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fee Amount *</Form.Label>
                    <Form.Control
                      type="number"
                      name="fee"
                      value={cycleFormData.fee}
                      onChange={handleCycleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter fee amount"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Check
                      type="switch"
                      name="is_paid"
                      label="Payment Received"
                      checked={cycleFormData.is_paid}
                      onChange={handleCycleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              {mode === 'cycle' ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <IconifyIcon icon={mode === 'cycle' ? "bx:save" : "bi:plus"} className="me-1" />
              {mode === 'cycle' ? 'Update Cycle' : 'Create Rent Account'}
            </>
          )}
        </Button>
      </Modal.Footer>

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