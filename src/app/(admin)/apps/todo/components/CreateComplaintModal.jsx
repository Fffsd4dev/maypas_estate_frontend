import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateComplaintModal = ({ show, handleClose, refreshComplaints, tenantSlug }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) return;
      
      setLoadingCategories(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/apartment/categories`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Handle different possible response structures
        let categoryList = [];
        
        if (Array.isArray(response.data)) {
          // If response is directly an array
          categoryList = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response has data property that's an array
          categoryList = response.data.data;
        } else if (response.data.categories && Array.isArray(response.data.categories)) {
          // If response has categories property that's an array
          categoryList = response.data.categories;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // If response has items property that's an array
          categoryList = response.data.items;
        }
        
        setCategories(categoryList);
        
        // Set default category if categories are available
        if (categoryList.length > 0) {
          const defaultCategory = categoryList[0].id || categoryList[0]._id || categoryList[0].value || categoryList[0].name || categoryList[0];
          setFormData(prev => ({
            ...prev,
            category: defaultCategory
          }));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        console.error('Error details:', err.response?.data);
        setError('Failed to load categories: ' + (err.response?.data?.message || err.message));
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show, user?.token]);

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

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/create`,
        payload,
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
        setFormData({
          title: '',
          description: '',
          category: categories.length > 0 ? (categories[0].id || categories[0]._id || categories[0].value || categories[0].name || categories[0]) : '',
          priority: 'Medium'
        });
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category display value
  const getCategoryDisplayValue = (category) => {
    if (typeof category === 'string') return category;
    return category.name || category.title || category.label || category.value || category.id || category._id || 'Unknown Category';
  };

  // Helper function to get category value
  const getCategoryValue = (category) => {
    if (typeof category === 'string') return category;
    return category.id || category._id || category.value || category.name || category;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Complaint</Modal.Title>
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
              Complaint created successfully!
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Complaint Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter complaint title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                {loadingCategories ? (
                  <Form.Control
                    type="text"
                    value="Loading categories..."
                    disabled
                  />
                ) : categories.length === 0 ? (
                  <Form.Control
                    type="text"
                    value="No categories available"
                    disabled
                  />
                ) : (
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((category, index) => (
                      <option 
                        key={index} 
                        value={getCategoryValue(category)}
                      >
                        {getCategoryDisplayValue(category)}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint in detail..."
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || loadingCategories || categories.length === 0}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                Creating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:plus" className="me-1" />
                Create Complaint
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateComplaintModal;