import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spinner, Accordion } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const Charges = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const { user } = useAuthContext();
  const { tenantSlug, apartmentUnitUuid } = useParams();
  const navigate = useNavigate();

  // Fetch apartments for the estate manager
  const fetchApartments = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
        // Expand first category by default
        if (response.data.length > 0) {
          setExpandedCategories(new Set([0]));
        }
      } else {
        setCategories([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartments');
      setLoading(false);
    }
  };

  const handleApartmentUnitClick = (apartmentUnit) => {
    navigate(`/${tenantSlug}/charges/${apartmentUnit.apartment_unit_uuid}`);
  };

  const toggleCategory = (categoryIndex) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAllCategories = () => {
    const allIndices = categories.map((_, index) => index);
    setExpandedCategories(new Set(allIndices));
  };

  const collapseAllCategories = () => {
    setExpandedCategories(new Set());
  };

  // Get total apartment units count
  const getTotalUnits = () => {
    return categories.reduce((total, category) => {
      return total + category.apartments.reduce((aptTotal, apartment) => {
        return aptTotal + apartment.apartment_units.length;
      }, 0);
    }, 0);
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchApartments();
    }
  }, [user, tenantSlug]);

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /> Loading apartments...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const totalUnits = getTotalUnits();

  return (
    <>
      <PageBreadcrumb subName="Account" title="Apartments" />
      <PageMetaData title="Apartments - Select Unit" />
      
      <Row>
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">Select Apartment Unit</h4>
              <p className="text-muted mb-0">
                {totalUnits} unit{totalUnits !== 1 ? 's' : ''} across {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={expandAllCategories}
              >
                <IconifyIcon icon="bx:expand-alt" className="me-1" />
                Expand All
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={collapseAllCategories}
              >
                <IconifyIcon icon="bx:collapse-alt" className="me-1" />
                Collapse All
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {categories.length > 0 ? (
        <Row>
          <Col xs={12}>
            <div className="category-list">
              {categories.map((category, categoryIndex) => {
                const categoryUnitCount = category.apartments.reduce((total, apt) => total + apt.apartment_units.length, 0);
                const isExpanded = expandedCategories.has(categoryIndex);
                
                return (
                  <Card key={categoryIndex} className="mb-3">
                    <Card.Header 
                      className="bg-light cursor-pointer"
                      onClick={() => toggleCategory(categoryIndex)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <IconifyIcon 
                            icon={isExpanded ? "bx:chevron-down" : "bx:chevron-right"} 
                            className="me-2 transition-all"
                          />
                          <h5 className="mb-0">{category.name}</h5>
                          {category.description && (
                            <span className="text-muted ms-2 small">- {category.description}</span>
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-primary me-2">
                            {categoryUnitCount} unit{categoryUnitCount !== 1 ? 's' : ''}
                          </span>
                          <span className="badge bg-secondary">
                            {category.apartments.length} apartment{category.apartments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </Card.Header>
                    
                    {isExpanded && (
                      <Card.Body className="p-0">
                        {category.apartments.map((apartment, aptIndex) => (
                          <div key={aptIndex} className="border-bottom">
                            <div className="p-3 bg-white">
                              <h6 className="mb-2 d-flex align-items-center">
                                <IconifyIcon icon="bx:building" className="me-2 text-muted" />
                                {apartment.name}
                              </h6>
                              {apartment.address && (
                                <p className="text-muted small mb-2 d-flex align-items-center">
                                  <IconifyIcon icon="bx:map" className="me-1" />
                                  {apartment.address}
                                </p>
                              )}
                              {apartment.location && (
                                <p className="text-muted small mb-3 d-flex align-items-center">
                                  <IconifyIcon icon="bx:current-location" className="me-1" />
                                  {apartment.location}
                                </p>
                              )}
                              
                              <Row>
                                {apartment.apartment_units.map((unit) => (
                                  <Col key={unit.apartment_unit_uuid} md={6} lg={4} className="mb-3">
                                    <Card 
                                      className="h-100 cursor-pointer hover-shadow border"
                                      onClick={() => handleApartmentUnitClick(unit)}
                                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    >
                                      <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                          <h6 className="card-title mb-0 text-primary">
                                            {unit.apartment_unit_name}
                                          </h6>
                                          <IconifyIcon 
                                            icon="bx:chevron-right" 
                                            className="text-muted mt-1" 
                                          />
                                        </div>
                                        
                                        <div className="mt-auto">
                                          <div className="d-flex justify-content-between align-items-center text-muted small">
                                            <span>Apartment: {apartment.name}</span>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center text-muted small">
                                            <span>Category: {category.name}</span>
                                          </div>
                                          {unit.amenities && unit.amenities.length > 0 && (
                                            <div className="mt-2">
                                              <small className="text-muted">
                                                <strong>Amenities:</strong> {unit.amenities.join(', ')}
                                              </small>
                                            </div>
                                          )}
                                        </div>
                                      </Card.Body>
                                      <Card.Footer className="bg-transparent py-2">
                                        <div className="text-center">
                                          <small className="text-primary">
                                            Click to manage charges
                                          </small>
                                        </div>
                                      </Card.Footer>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        ))}
                        
                        {category.apartments.length === 0 && (
                          <div className="text-center py-4">
                            <IconifyIcon icon="bx:building-house" className="display-4 text-muted mb-2" />
                            <p className="text-muted mb-0">No apartments in this category</p>
                          </div>
                        )}
                      </Card.Body>
                    )}
                  </Card>
                );
              })}
            </div>
          </Col>
        </Row>
      ) : (
        <div className="alert alert-info text-center">
          <IconifyIcon icon="bx:building" className="display-4 text-muted mb-3" />
          <h5>No Apartment Units Found</h5>
          <p className="mb-0">There are no apartment units assigned to your account.</p>
        </div>
      )}

      {/* Quick Stats Card */}
      {categories.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="bg-light">
              <Card.Body>
                <Row className="text-center">
                  <Col md={3} className="border-end">
                    <h4 className="text-primary mb-1">{categories.length}</h4>
                    <small className="text-muted">Categor{categories.length !== 1 ? 'ies' : 'y'}</small>
                  </Col>
                  <Col md={3} className="border-end">
                    <h4 className="text-primary mb-1">
                      {categories.reduce((total, category) => total + category.apartments.length, 0)}
                    </h4>
                    <small className="text-muted">Apartment{categories.reduce((total, category) => total + category.apartments.length, 0) !== 1 ? 's' : ''}</small>
                  </Col>
                  <Col md={3} className="border-end">
                    <h4 className="text-primary mb-1">{totalUnits}</h4>
                    <small className="text-muted">Total Unit{totalUnits !== 1 ? 's' : ''}</small>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-primary mb-1">
                      {expandedCategories.size}
                    </h4>
                    <small className="text-muted">Expanded Categor{expandedCategories.size !== 1 ? 'ies' : 'y'}</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Charges;