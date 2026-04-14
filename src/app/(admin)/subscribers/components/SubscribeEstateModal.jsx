import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const SubscribeEstateModal = ({ 
  show, 
  handleClose, 
  refreshSubscribers 
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    plan_id: '',
    estate_manager_id: '',
    number_months: '',
    fee: '',
    start_date: ''
  });
  
  const [plans, setPlans] = useState([]);
  const [estateManagers, setEstateManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch plans and estate managers when modal opens
  useEffect(() => {
    if (show && user?.token) {
      fetchPlans();
      fetchEstateManagers();
    }
  }, [show, user]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        plan_id: '',
        estate_manager_id: '',
        number_months: '',
        fee: '',
        start_date: ''
      });
      setError(null);
      setSuccess(false);
    }
  }, [show]);

  const fetchPlans = async () => {
    setFetchingData(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/plan/view/all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (Array.isArray(response.data.data)) {
        setPlans(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchEstateManagers = async () => {
    setFetchingData(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-estate-managers`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (Array.isArray(response.data.data.data)) {
        setEstateManagers(response.data.data.data);
      }
    } catch (err) {
      console.error('Error fetching estate managers:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-calculate fee when plan and months are selected
  useEffect(() => {
    if (formData.plan_id && formData.number_months) {
      const selectedPlan = plans.find(p => p.id === parseInt(formData.plan_id));
      if (selectedPlan?.fee) {
        const calculatedFee = selectedPlan.fee * parseInt(formData.number_months);
        setFormData(prev => ({
          ...prev,
          fee: calculatedFee
        }));
      }
    }
  }, [formData.plan_id, formData.number_months, plans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        plan_id: parseInt(formData.plan_id),
        estate_manager_id: parseInt(formData.estate_manager_id),
        number_months: parseInt(formData.number_months),
        fee: parseFloat(formData.fee),
        start_date: formData.start_date
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/subscribe-by-admin`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      refreshSubscribers();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe estate');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Subscribe Estate to Plan
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
              Estate subscribed successfully!
            </Alert>
          )}

          {fetchingData && (
            <div className="text-center mb-3">
              {/* <Spinner animation="border" size="sm" /> */}
              <span className="ms-2">Loading data...</span>
            </div>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Select Plan *</Form.Label>
                <Form.Select
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleChange}
                  required
                  disabled={fetchingData}
                >
                  <option value="">Choose a plan...</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ₦{parseFloat(plan.fee || 0).toLocaleString()}/month
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estate Manager *</Form.Label>
                <Form.Select
                  name="estate_manager_id"
                  value={formData.estate_manager_id}
                  onChange={handleChange}
                  required
                  disabled={fetchingData}
                >
                  <option value="">Select estate manager...</option>
                  {estateManagers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.estate_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Months *</Form.Label>
                <Form.Control
                  type="number"
                  name="number_months"
                  value={formData.number_months}
                  onChange={handleChange}
                  required
                  placeholder="Enter number of months"
                  min="1"
                  max="60"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  min={today}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Total Fee (₦) *</Form.Label>
                <Form.Control
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  required
                  placeholder="Total fee will auto-calculate"
                  min="0"
                  step="0.01"
                  readOnly={formData.plan_id && formData.number_months}
                />
                {formData.plan_id && formData.number_months && (
                  <Form.Text className="text-muted">
                    Auto-calculated based on plan and duration
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading || fetchingData}>
            {loading ? (
              <>
                {/* <Spinner animation="border" size="sm" className="me-1" /> */}
                Subscribing...
              </>
            ) : (
              <>
                <IconifyIcon icon="bi:check-circle" className="me-1" />
                Subscribe Estate
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SubscribeEstateModal;