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
    apartment_unit_uuid: [],
    fee_name: [''],
    fee_amount: [0],
    payment_amount: '' // amount the tenant is paying now, used only in edit/part-payment mode
  });
  const [categories, setCategories] = useState([]);
  const [apartmentsInCategory, setApartmentsInCategory] = useState([]);
  const [unitsInApartment, setUnitsInApartment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Derived payment context for edit mode (read-only summary)
  // Coerce with parseFloat since amounts often come back from the API as strings (e.g. "1500.00")
  const invoiceTotal = parseFloat(invoiceToEdit?.invoice_amount) || 0;
  const amountPaidSoFar = parseFloat(invoiceToEdit?.total_paid) || 0;
  const balanceRemaining = Math.max(invoiceTotal - amountPaidSoFar, 0);

  // Helper: fetch units for a given apartment uuid
  const fetchUnitsForApartment = async (apartmentUuid) => {
    try {
      setUnitsLoading(true);
      const unitsResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments/units/info`,
        { apartment_uuid: apartmentUuid },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return unitsResponse.data?.data?.apartment_units || [];
    } catch (err) {
      console.error('Error fetching apartment units:', err);
      setError('Failed to load apartment units');
      return [];
    } finally {
      setUnitsLoading(false);
    }
  };

  // Fetch apartments data (only needed for create mode)
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

        if (editMode && invoiceToEdit) {
          // Payment mode - start with a blank payment amount, nothing to prefill
          setFormData(prev => ({
            ...prev,
            payment_amount: ''
          }));
        } else {
          // Create mode - fetch apartments (categories)
          const apartmentsResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const categoriesData = apartmentsResponse.data.data || apartmentsResponse.data || [];
          setCategories(categoriesData);

          // Reset form for create mode
          setFormData({
            apartment_unit_uuid: [],
            fee_name: [''],
            fee_amount: [0],
            payment_amount: ''
          });
          setSelectedCategory(null);
          setSelectedApartment(null);
          setSelectedUnits([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, editMode, invoiceToEdit, user, tenantSlug]);

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
      
      const categoryApartments = category?.apartments || [];
      setApartmentsInCategory(categoryApartments);
      
      setSelectedApartment(null);
      setSelectedUnits([]);
      setUnitsInApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: []
      }));
    } else {
      setSelectedCategory(null);
      setApartmentsInCategory([]);
      setSelectedApartment(null);
      setSelectedUnits([]);
      setUnitsInApartment([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: []
      }));
    }
  };

  // Level 2: Apartment Selection - fetches units via POST once apartment is chosen
  const handleApartmentChange = async (e) => {
    const apartmentIndex = e.target.value;

    if (apartmentIndex !== '') {
      const apartment = apartmentsInCategory[apartmentIndex];

      if (apartment) {
        setSelectedApartment(apartment);
        setSelectedUnits([]);
        setUnitsInApartment([]);
        setFormData(prev => ({
          ...prev,
          apartment_unit_uuid: []
        }));

        const units = await fetchUnitsForApartment(apartment.uuid);
        setUnitsInApartment(units);
      } else {
        setSelectedApartment(null);
        setUnitsInApartment([]);
        setSelectedUnits([]);
      }
    } else {
      setSelectedApartment(null);
      setUnitsInApartment([]);
      setSelectedUnits([]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: []
      }));
    }
  };

  // Level 3: Unit Selection (multi-select via checkboxes)
  const handleUnitToggle = (unit) => {
    const unitUuid = unit.uuid;
    const isSelected = formData.apartment_unit_uuid.includes(unitUuid);

    if (isSelected) {
      setSelectedUnits(prev => prev.filter(u => u.uuid !== unitUuid));
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: prev.apartment_unit_uuid.filter(uuid => uuid !== unitUuid)
      }));
    } else {
      setSelectedUnits(prev => [...prev, unit]);
      setFormData(prev => ({
        ...prev,
        apartment_unit_uuid: [...prev.apartment_unit_uuid, unitUuid]
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

      if (editMode) {
        // Payment mode validation - payment amount must be a valid positive number
        const amount = parseFloat(formData.payment_amount);
        if (formData.payment_amount === '' || isNaN(amount) || amount <= 0) {
          throw new Error('Please enter a valid payment amount (greater than 0)');
        }
      } else {
        // Create mode validation - check all fields
        if (formData.apartment_unit_uuid.length === 0) {
          throw new Error('Please select at least one apartment unit');
        }
        if (formData.fee_name.some(name => !name.trim())) {
          throw new Error('Please fill all fee purpose fields');
        }
        if (formData.fee_amount.some(amount => amount <= 0)) {
          throw new Error('Please enter valid fee amounts (greater than 0)');
        }
      }

      if (editMode && invoiceToEdit) {
        // Payment mode - record a payment against the invoice
        const invoiceUuid = invoiceToEdit.uuid || invoiceToEdit.invoice_uuid;
        
        if (!invoiceUuid) {
          throw new Error('Invoice UUID not found');
        }

        const updatePayload = {
          fee_amount: parseFloat(formData.payment_amount)
        };

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/update/${invoiceUuid}`,
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
          apartment_unit_uuid: formData.apartment_unit_uuid,
          fee_name: formData.fee_name,
          fee_amount: formData.fee_amount
        };

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
                          (editMode ? 'Failed to record payment' : 'Failed to create invoice');
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

  // Calculate total amount for create mode
  const totalAmount = formData.fee_amount.reduce((sum, amount) => sum + amount, 0);

  if (loadingData) {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? 'Record Payment' : 'Create New Invoice'}
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
    <Modal show={show} onHide={handleClose} centered size={editMode ? 'md' : 'xl'}>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:wallet" : "bi:plus"} className="me-2" />
          {editMode ? 'Record Tenant Payment' : 'Create New Invoice'}
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
              {editMode ? 'Payment recorded successfully!' : 'Invoice created successfully!'}
            </Alert>
          )}

          {editMode && invoiceToEdit ? (
            // Payment mode - record a part or full payment towards the invoice
            <>
              <div className="bg-light rounded p-3 mb-3">
                <Row className="text-center">
                  <Col xs={4}>
                    <div className="text-muted small">Invoice Total</div>
                    <div className="fw-semibold">₦{invoiceTotal.toFixed(2)}</div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-muted small">Paid So Far</div>
                    <div className="fw-semibold text-success">₦{amountPaidSoFar.toFixed(2)}</div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-muted small">Balance Remaining</div>
                    <div className="fw-semibold text-danger">₦{balanceRemaining.toFixed(2)}</div>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount Paid by Tenant *</Form.Label>
                    <Form.Control
                      type="number"
                      name="payment_amount"
                      min="0"
                      step="0.01"
                      value={formData.payment_amount}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Enter the amount the tenant is paying now"
                    />
                    <Form.Text className="text-muted">
                      This is a single payment towards the invoice. It doesn't have to cover the full balance — partial payments are supported.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </>
          ) : (
            // Create mode - show full form
            <>
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
                      {Array.isArray(categories) && categories.map((category, index) => (
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
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}

                {/* Level 3: Unit Selection - multi-select checkboxes */}
                {selectedApartment && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apartment Units *</Form.Label>
                      {unitsLoading ? (
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <Spinner animation="border" size="sm" />
                          Loading units...
                        </div>
                      ) : unitsInApartment.length > 0 ? (
                        <div
                          className="border rounded p-2"
                          style={{ maxHeight: '180px', overflowY: 'auto' }}
                        >
                          {unitsInApartment.map((unit, index) => (
                            <Form.Check
                              key={unit.uuid || index}
                              type="checkbox"
                              id={`unit-${unit.uuid || index}`}
                              label={getUnitDisplayName(unit)}
                              checked={formData.apartment_unit_uuid.includes(unit.uuid)}
                              onChange={() => handleUnitToggle(unit)}
                              disabled={loading}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      ) : (
                        <Form.Text className="text-warning d-block">
                          No units available for this apartment
                        </Form.Text>
                      )}
                      <Form.Text className="text-muted">
                        {formData.apartment_unit_uuid.length} unit(s) selected
                      </Form.Text>
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
                          <th>Fee Purpose</th>
                          <th width="200">Amount (₦)</th>
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
                                placeholder="Enter fee purpose (e.g., rent, maintenance)"
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
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-light">
                        <tr>
                          <td className="text-end"><strong>Total Amount:</strong></td>
                          <td><strong>${totalAmount.toFixed(2)}</strong></td>
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
                {editMode ? 'Recording...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:wallet" : "bi:plus"} className="me-2" />
                {editMode ? 'Record Payment' : 'Create Invoice'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;