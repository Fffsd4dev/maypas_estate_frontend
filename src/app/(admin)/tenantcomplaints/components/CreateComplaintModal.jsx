import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateComplaintModal = ({ 
  show, 
  handleClose, 
  refreshComplaints, 
  tenantSlug,
  editMode = false,
  complaintToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    status: 'open'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Set form data when modal opens or complaintToEdit changes
  useEffect(() => {
    if (show && complaintToEdit) {
      
      // Set the current status from the complaint data
      setFormData({
        status: complaintToEdit.status || 'open'
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, complaintToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      // Get the complaint ID for updating
      const complaintId = complaintToEdit?.id || complaintToEdit?.complaint_id;
      
      if (!complaintId) {
        throw new Error('Complaint ID not found for updating');
      }

      // Prepare the data for the API - only status field
      const updateData = {
        status: formData.status
      };

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/update/${complaintId}`;

      const response = await axios.patch(
        apiUrl,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      refreshComplaints();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        resetForm();
      }, 1500);
    } catch (err) {
      console.error('Complaint update error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.message || 'Failed to update complaint status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      status: 'open'
    });
    setError(null);
    setSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Helper function to display complaint information
  const getComplaintInfo = () => {
    if (!complaintToEdit) return null;
    
    return (
      <Alert variant="info">
        <strong>Complaint:</strong> {complaintToEdit.title}<br />
        <strong>Current Status:</strong> <span className="text-capitalize">{complaintToEdit.status?.replace('_', ' ')}</span>
      </Alert>
    );
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Update Complaint Status' : 'Create New Complaint'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              Complaint status updated successfully!
            </Alert>
          )}

          {complaintToEdit && getComplaintInfo()}

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Select the new status for this complaint
            </Form.Text>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !complaintToEdit}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                Updating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:save" className="me-1" />
                Update Status
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateComplaintModal;