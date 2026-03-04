import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateChargesModal = ({ 
  show, 
  handleClose, 
  refreshCharges,
  editMode = false,
  chargeToEdit = null,
  tenantSlug,
  apartmentUnit
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    charge_type: '',
    fee_type: '',
    value: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Charge type options
  const chargeTypes = [
    { value: 'one_off', label: 'One Off' },
    { value: 'recurrent', label: 'Recurrent' }
  ];

  // Fee type options
  const feeTypes = [
    { value: 'fixed', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'variable', label: 'Variable' }
  ];

  useEffect(() => {
    if (show) {
      if (editMode && chargeToEdit) {
        setFormData({
          name: chargeToEdit.name || '',
          charge_type: chargeToEdit.charge_type || '',
          fee_type: chargeToEdit.fee_type || '',
          value: chargeToEdit.value || ''
        });
      } else {
        setFormData({
          name: '',
          charge_type: '',
          fee_type: '',
          value: ''
        });
      }
      
      setError(null);
      setSuccess(false);
    }
  }, [show, editMode, chargeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       if (!apartmentUnit?.apartment_unit_uuid) {
//         throw new Error('No apartment unit selected');
//       }

//       let url;
//       let method;

//       if (editMode && chargeToEdit) {
//         // Update charge
//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/update/${chargeToEdit.id}`;
//         method = 'put';
//       } else {
//         // Create charge
//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/create`;
//         method = 'post';
//       }

//       await axios[method](
//         url,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setSuccess(true);
//       refreshCharges();
//       setTimeout(() => {
//         handleClose();
//         setSuccess(false);
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || 
//         (editMode ? 'Failed to update charge' : 'Failed to create charge'));
//       console.error('API Error:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

    // In CreateChargesModal.js - update the API calls
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    if (!tenantSlug) {
      throw new Error('Tenant slug not found');
    }

    if (!apartmentUnit?.apartment_unit_uuid) {
      throw new Error('No apartment unit selected');
    }

    let url;
    let method;

    if (editMode && chargeToEdit) {
      // Update charge
      url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/update/${chargeToEdit.id}`;
      method = 'put';
    } else {
      // Create charge
      url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}/create`;
      method = 'post';
    }

    await axios[method](
      url,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    setSuccess(true);
    refreshCharges();
    setTimeout(() => {
      handleClose();
      setSuccess(false);
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.message || 
      (editMode ? 'Failed to update charge' : 'Failed to create charge'));
    console.error('API Error:', err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Edit Charge' : 'Create New Charge'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {apartmentUnit && (
          <Alert variant="info" className="mb-3">
            <div>
              <strong>Apartment Unit:</strong> {apartmentUnit.apartment_unit_name}
            </div>
            <div className="small">
              {apartmentUnit.apartment_name} • {apartmentUnit.category_name}
            </div>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Charge updated successfully!' : 'Charge created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Charge Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter charge name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Charge Type *</Form.Label>
                <Form.Select
                  name="charge_type"
                  value={formData.charge_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Charge Type</option>
                  {chargeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Fee Type *</Form.Label>
                <Form.Select
                  name="fee_type"
                  value={formData.fee_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Fee Type</option>
                  {feeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Value *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  placeholder="Enter value"
                />
                <Form.Text className="text-muted">
                  {formData.fee_type === 'percentage' ? 'Enter percentage value (e.g., 10 for 10%)' : 'Enter amount'}
                </Form.Text>
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
              {editMode ? 'Save Changes' : 'Create Charge'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChargesModal;