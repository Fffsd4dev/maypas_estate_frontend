import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateInvoiceModal = ({ 
  show, 
  handleClose, 
  refreshInvoices,
  editMode = false,
  invoiceToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    user_uuid: '',
    apartment_unit_uuid: '',
    fee_name: [''],
    fee_amount: [0],
    invoice_status: ''
  });
  const [tenants, setTenants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apartmentsInCategory, setApartmentsInCategory] = useState([]);
  const [unitsInApartment, setUnitsInApartment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch tenants and apartments data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingData(true);
        
        if (!user?.token) {
          throw new Error('Authentication required');
        }

        if (!tenantSlug) {
          throw new Error('Tenant slug not found');
        }

        // Fetch tenants
        const tenantsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenants/view`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Fetch apartments (categories)
        const apartmentsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Tenants Response:', tenantsResponse.data);
        console.log('Apartments Response:', apartmentsResponse.data);
        
        // Set tenants data - adjust based on your API response structure
        setTenants(tenantsResponse.data.users?.data || tenantsResponse.data.data || []);
        
        // Set categories data
        setCategories(apartmentsResponse.data || []);
        
        // Set form data for edit mode
        if (editMode && invoiceToEdit) {
          console.log('Invoice to edit:', invoiceToEdit);
          console.log('Current invoice_status:', invoiceToEdit.invoice_status);
          
          setFormData({
            user_uuid: invoiceToEdit.user?.uuid || '',
            apartment_unit_uuid: invoiceToEdit.apartment_unit?.uuid || '',
            fee_name: invoiceToEdit.payment_infos?.map(payment => payment.payment_name) || [''],
            fee_amount: invoiceToEdit.payment_infos?.map(payment => parseFloat(payment.payment_fee)) || [0],
            invoice_status: invoiceToEdit.invoice_status || 'pending' // Default to 'pending' if invoice_status is empty
          });

          // Pre-select category, apartment, and unit based on existing data
          if (invoiceToEdit.apartment_unit?.uuid) {
            const unitInfo = findUnitByUuid(invoiceToEdit.apartment_unit.uuid);
            if (unitInfo) {
              setSelectedCategory(unitInfo.category);
              setApartmentsInCategory(unitInfo.category.apartments || []);
              setSelectedApartment(unitInfo.apartment);
              setUnitsInApartment(unitInfo.apartment.apartment_units || []);
              setSelectedUnit(unitInfo.unit);
            }
          }
        } else {
          // Reset form for create mode
          setFormData({
            user_uuid: '',
            apartment_unit_uuid: '',
            fee_name: [''],
            fee_amount: [0],
            invoice_status: ''
          });
          setSelectedCategory(null);
          setSelectedApartment(null);
          setSelectedUnit(null);
          setApartmentsInCategory([]);
          setUnitsInApartment([]);
        }
        
        setLoadingData(false);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
        setError('Failed to load required data');
        setLoadingData(false);
      }
    };

    if (show) {
      fetchDropdownData();
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, invoiceToEdit, user, tenantSlug]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeeNameChange = (index, value) => {
    const updatedFeeNames = [...formData.fee_name];
    updatedFeeNames[index] = value;
    setFormData(prev => ({
      ...prev,
      fee_name: updatedFeeNames
    }));
  };

  const handleFeeAmountChange = (index, value) => {
    const updatedFeeAmounts = [...formData.fee_amount];
    updatedFeeAmounts[index] = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      fee_amount: updatedFeeAmounts
    }));
  };

  const addFeeItem = () => {
    setFormData(prev => ({
      ...prev,
      fee_name: [...prev.fee_name, ''],
      fee_amount: [...prev.fee_amount, 0]
    }));
  };

  const removeFeeItem = (index) => {
    if (formData.fee_name.length > 1) {
      const updatedFeeNames = formData.fee_name.filter((_, i) => i !== index);
      const updatedFeeAmounts = formData.fee_amount.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        fee_name: updatedFeeNames,
        fee_amount: updatedFeeAmounts
      }));
    }
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
      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      // Different validation for edit mode vs create mode
      if (editMode) {
        // Edit mode validation - only check invoice_status
        if (!formData.invoice_status) {
          throw new Error('Please select a status');
        }
      } else {
        // Create mode validation - check all fields
        if (!formData.user_uuid) {
          throw new Error('Please select a tenant');
        }
        if (!formData.apartment_unit_uuid) {
          throw new Error('Please select an apartment unit');
        }
        if (formData.fee_name.some(name => !name.trim())) {
          throw new Error('Please fill all fee name fields');
        }
        if (formData.fee_amount.some(amount => amount <= 0)) {
          throw new Error('Please enter valid fee amounts (greater than 0)');
        }
      }

      if (editMode && invoiceToEdit) {
        // Edit mode - update invoice invoice_status only
        const updatePayload = {
          status: formData.invoice_status
        };
        console.log('Updating invoice with payload:', updatePayload);

        const invoiceUuid = invoiceToEdit.uuid || invoiceToEdit.invoice_uuid;
        
        if (!invoiceUuid) {
          throw new Error('Invoice UUID not found');
        }

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/update/single/${invoiceUuid}`,
          updatePayload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create mode - create new invoice
        const payload = {
          user_uuid: formData.user_uuid,
          apartment_unit_uuid: formData.apartment_unit_uuid,
          fee_name: formData.fee_name,
          fee_amount: formData.fee_amount
        };

        console.log('Creating invoice with payload:', payload);

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/create`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setSuccess(true);
      refreshInvoices();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          (editMode ? 'Failed to update invoice' : 'Failed to create invoice');
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for display
  const getCategoryName = (category) => {
    return category?.name || 'Unnamed Category';
  };

  const getApartmentName = (apartment) => {
    return apartment?.name || `Apartment ${apartment?.uuid || 'N/A'}`;
  };

  const getUnitDisplayName = (unit) => {
    return unit?.apartment_unit_name || `Unit ${unit?.id || 'N/A'}`;
  };

  const getTenantName = (uuid) => {
    const tenant = tenants.find(t => t.uuid === uuid);
    return tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown Tenant';
  };

  // Calculate total amount
  const totalAmount = formData.fee_amount.reduce((sum, amount) => sum + amount, 0);

  if (loadingData) {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? 'Edit Invoice' : 'Create New Invoice'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading required data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:edit" : "bi:plus"} className="me-2" />
          {editMode ? 'Edit Invoice' : 'Create New Invoice'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
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
              {editMode ? 'Invoice updated successfully!' : 'Invoice created successfully!'}
            </Alert>
          )}

          {editMode && invoiceToEdit ? (
            // Edit mode - only show invoice_status update
            <Row>
              {/* <Col xs={12}>
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="mb-2">Invoice Details</h6>
                  <p className="mb-1"><strong>Invoice ID:</strong> {invoiceToEdit.uuid}</p>
                  <p className="mb-1"><strong>Customer:</strong> {invoiceToEdit.user?.first_name} {invoiceToEdit.user?.last_name}</p>
                  <p className="mb-1"><strong>Apartment:</strong> {invoiceToEdit.apartment_unit?.apartment?.name} - {invoiceToEdit.apartment_unit?.apartment_unit_name}</p>
                  <p className="mb-0"><strong>Current invoice_Status:</strong> <span className={`badge bg-${invoiceToEdit.invoice_status === 'completed' ? 'success' : invoiceToEdit.invoice_status === 'cancelled' ? 'danger' : 'warning'}`}>{invoiceToEdit.invoice_status || 'pending'}</span></p>
                </div>
              </Col> */}
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Update status *</Form.Label>
                  <Form.Select
                    name="invoice_status"
                    value={formData.invoice_status || ''}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Current status: <strong>{formData.invoice_status || 'pending'}</strong>
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            // Create mode - show full form
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tenant *</Form.Label>
                    <Form.Select
                      name="user_uuid"
                      value={formData.user_uuid}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Tenant</option>
                      {tenants.map(tenant => (
                        <option key={tenant.uuid} value={tenant.uuid}>
                          {tenant.first_name} {tenant.last_name} ({tenant.email})
                        </option>
                      ))}
                    </Form.Select>
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
                      disabled={loading}
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
                
                {/* Level 2: Apartment Selection */}
                {selectedCategory && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apartment *</Form.Label>
                      <Form.Select
                        value={selectedApartment ? apartmentsInCategory.indexOf(selectedApartment) : ''}
                        onChange={handleApartmentChange}
                        required
                        disabled={loading}
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

                {/* Level 3: Unit Selection */}
                {selectedApartment && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apartment Unit *</Form.Label>
                      <Form.Select
                        value={selectedUnit ? unitsInApartment.indexOf(selectedUnit) : ''}
                        onChange={handleUnitChange}
                        required
                        disabled={loading || unitsInApartment.length === 0}
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

              <Row>
                <Col xs={12}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Fee Items</h6>
                    <Button variant="outline-primary" size="sm" onClick={addFeeItem}>
                      <IconifyIcon icon="bx:plus" className="me-1" />
                      Add Fee Item
                    </Button>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-light">
                        <tr>
                          <th>Fee Name</th>
                          <th width="200">Amount ($)</th>
                          <th width="80">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.fee_name.map((feeName, index) => (
                          <tr key={index}>
                            <td>
                              <Form.Control
                                type="text"
                                value={feeName}
                                onChange={(e) => handleFeeNameChange(index, e.target.value)}
                                placeholder="Enter fee name (e.g., rent, maintenance)"
                                required
                                disabled={loading}
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.fee_amount[index]}
                                onChange={(e) => handleFeeAmountChange(index, e.target.value)}
                                required
                                disabled={loading}
                              />
                            </td>
                            <td className="text-center">
                              {formData.fee_name.length > 1 && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeFeeItem(index)}
                                  disabled={loading}
                                >
                                  <IconifyIcon icon="bx:trash" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-light">
                        <tr>
                          <td className="text-end"><strong>Total Amount:</strong></td>
                          <td><strong>${totalAmount.toFixed(2)}</strong></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-2" />
                {editMode ? 'Update Invoice' : 'Create Invoice'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;



