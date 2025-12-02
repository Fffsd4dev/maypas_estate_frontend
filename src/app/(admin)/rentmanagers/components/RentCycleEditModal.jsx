import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const RentCycleEditModal = ({ 
  show, 
  handleClose, 
  rentCycle, 
  rentAccount,
  estateSlug,
  onCycleUpdate 
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    cycle_start_date: '',
    cycle_end_date: '',
    fee: '',
    is_paid: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show && rentCycle) {
      setFormData({
        cycle_start_date: rentCycle.cycle_start_date ? rentCycle.cycle_start_date.split(' ')[0] : '',
        cycle_end_date: rentCycle.cycle_end_date ? rentCycle.cycle_end_date.split(' ')[0] : '',
        fee: rentCycle.fee || '',
        is_paid: rentCycle.is_paid === "1" || rentCycle.is_paid === 1 || rentCycle.is_paid === true
      });
      setError(null);
      setSuccess(false);
    }
  }, [show, rentCycle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!estateSlug) {
        throw new Error('Estate slug not found');
      }

      if (!rentAccount?.apartment_unit_uuid) {
        throw new Error('Apartment unit UUID not found');
      }

      if (!rentCycle?.uuid) {
        throw new Error('Rent cycle UUID not found');
      }

      const updateData = {
        apartment_unit_uuid: rentAccount.apartment_unit_uuid,
        cycle_start_date: `${formData.cycle_start_date} 00:00:00`,
        cycle_end_date: `${formData.cycle_end_date} 00:00:00`,
        fee: parseFloat(formData.fee),
        is_paid: formData.is_paid
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/cycle/update/${rentCycle.uuid}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      
      // Call the update function with the updated cycle
      const updatedCycle = {
        ...rentCycle,
        cycle_start_date: updateData.cycle_start_date,
        cycle_end_date: updateData.cycle_end_date,
        fee: updateData.fee,
        is_paid: updateData.is_paid ? "1" : "0"
      };
      
      onCycleUpdate(updatedCycle);
      
      setSuccess(true);
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update rent cycle');
      console.error('Error updating rent cycle:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Rent Cycle</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              Rent cycle updated successfully!
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Start Date *</Form.Label>
            <Form.Control
              type="date"
              name="cycle_start_date"
              value={formData.cycle_start_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Date *</Form.Label>
            <Form.Control
              type="date"
              name="cycle_end_date"
              value={formData.cycle_end_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fee *</Form.Label>
            <Form.Control
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <Form.Text className="text-muted">
              Current: {formatCurrency(rentCycle?.fee || 0)}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="is_paid"
              label="Payment Received"
              checked={formData.is_paid}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              Updating...
            </>
          ) : (
            <>
              <IconifyIcon icon="bx:save" className="me-1" />
              Save Changes
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RentCycleEditModal;