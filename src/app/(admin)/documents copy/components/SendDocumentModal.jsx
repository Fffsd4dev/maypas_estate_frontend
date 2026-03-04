import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const SendDocumentModal = ({ 
  show, 
  handleClose, 
  selectedDocument,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTenants = async (page = 1, search = '') => {
    try {
      if (page === 1) {
        setLoadingData(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      if (!user?.token || !tenantSlug) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenants/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          params: {
            page: page,
            ...(search && { search: search })
          }
        }
      );
      
      // Extract tenants from the nested users object
      const tenantsData = response.data?.users?.data || [];
      const pageInfo = response.data?.users || {};
      
      if (page === 1) {
        setTenants(tenantsData);
      } else {
        setTenants(prev => [...prev, ...tenantsData]);
      }
      
      setTotalPages(pageInfo.last_page || 1);
      setTotalItems(pageInfo.total || 0);
      setCurrentPage(page);
      
      setLoadingData(false);
      setLoadingMore(false);
      
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants data');
      setLoadingData(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (show && selectedDocument) {
      fetchTenants(1);
      setSelectedTenants([]);
      setSearchTerm('');
      setSuccess(false);
    }
  }, [show, selectedDocument, user, tenantSlug]);

  // Function to combine first, middle, and last names
  const getFullName = (tenant) => {
    const parts = [];
    if (tenant.first_name) parts.push(tenant.first_name);
    if (tenant.middle_name) parts.push(tenant.middle_name);
    if (tenant.last_name) parts.push(tenant.last_name);
    return parts.join(' ') || 'N/A';
  };

  // Filter tenants locally based on search term
  const filteredTenants = tenants.filter(tenant => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = getFullName(tenant).toLowerCase();
    const email = tenant.email?.toLowerCase() || '';
    const phone = tenant.phone?.toLowerCase() || '';
    
    return (
      fullName.includes(searchTermLower) ||
      email.includes(searchTermLower) ||
      phone.includes(searchTermLower)
    );
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTenants(filteredTenants.map(tenant => tenant.uuid));
    } else {
      setSelectedTenants([]);
    }
  };

  const handleSelectTenant = (tenantUuid) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantUuid)) {
        return prev.filter(uuid => uuid !== tenantUuid);
      } else {
        return [...prev, tenantUuid];
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchTenants(1, searchTerm);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchTenants(currentPage + 1, searchTerm);
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

      if (!selectedDocument?.uuid) {
        throw new Error('No document selected');
      }

      if (selectedTenants.length === 0) {
        throw new Error('Please select at least one tenant');
      }

      // Send document to each selected tenant
      const sendPromises = selectedTenants.map(userUuid => 
        axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/send`,
          {
            document_uuid: selectedDocument.uuid,
            user_uuid: userUuid
          },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      // Wait for all send operations to complete
      await Promise.all(sendPromises);
      
      setSuccess(`Document sent successfully to ${selectedTenants.length} tenant(s)!`);
      
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to send document';
      setError(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Send Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading tenants...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:send" className="me-2" />
          Send Document
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
              {success}
            </Alert>
          )}

          {!success && selectedDocument && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h6>Document Details</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {selectedDocument.name}</p>
                    <p><strong>Type:</strong> {selectedDocument.type}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>File:</strong> {selectedDocument.filename}</p>
                    <p><strong>Uploaded:</strong> {new Date(selectedDocument.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Select Tenants to Send To</h6>
                  <span className="badge bg-primary">
                    {selectedTenants.length} selected
                  </span>
                </div>
                
                <div className="mb-3">
                  <Form onSubmit={handleSearch} className="d-flex mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Search tenants by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="me-2"
                    />
                    <Button type="submit" variant="outline-primary">
                      <IconifyIcon icon="bx:search" />
                    </Button>
                  </Form>
                  
                  {tenants.length === 0 ? (
                    <Alert variant="warning">
                      No tenants found. Please add tenants first.
                    </Alert>
                  ) : (
                    <>
                      <div className="form-check mb-3">
                        <Form.Check 
                          type="checkbox"
                          id="selectAll"
                          label={`Select All (${filteredTenants.length} shown)`}
                          checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
                          onChange={handleSelectAll}
                          disabled={filteredTenants.length === 0}
                        />
                      </div>
                      
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table striped hover size="sm">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTenants.map(tenant => (
                              <tr key={tenant.uuid}>
                                <td>
                                  <Form.Check 
                                    type="checkbox"
                                    id={`tenant-${tenant.uuid}`}
                                    checked={selectedTenants.includes(tenant.uuid)}
                                    onChange={() => handleSelectTenant(tenant.uuid)}
                                  />
                                </td>
                                <td>{getFullName(tenant)}</td>
                                <td>
                                  <div className="d-flex flex-column">
                                    <span>{tenant.email || 'N/A'}</span>
                                    {tenant.email_verified_at && (
                                      <small className="text-success">
                                        <IconifyIcon icon="bx:check-circle" size="12" /> Verified
                                      </small>
                                    )}
                                  </div>
                                </td>
                                <td>{tenant.phone || 'N/A'}</td>
                                <td>
                                  <span className={`badge ${tenant.deactivated === 'no' ? 'bg-success' : 'bg-danger'}`}>
                                    {tenant.deactivated === 'no' ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        
                        {filteredTenants.length === 0 && searchTerm && (
                          <div className="text-center py-3 text-muted">
                            No tenants match your search
                          </div>
                        )}
                        
                        {/* Load more button if there are more pages */}
                        {currentPage < totalPages && !searchTerm && (
                          <div className="text-center mt-3">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                            >
                              {loadingMore ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <IconifyIcon icon="bx:down-arrow-alt" className="me-2" />
                                  Load More ({totalItems - tenants.length} more)
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
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
            disabled={loading || selectedTenants.length === 0 || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:send" className="me-2" />
                Send to {selectedTenants.length} Tenant(s)
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SendDocumentModal;