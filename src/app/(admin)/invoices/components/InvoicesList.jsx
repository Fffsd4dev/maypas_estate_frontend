import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import InvoicesListView from './InvoicesListView';
import CreateInvoiceModal from './CreateInvoiceModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const InvoicesList = ({ invoices, pagination, refreshInvoices, tenantSlug, defaultFromDate, defaultToDate }) => {
  const [showModal, setShowModal] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(pagination.current_page || 1);
  const [filters, setFilters] = useState({
    from_date: defaultFromDate,
    to_date: defaultToDate,
    type: 'all'
  });
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Ensure invoices is always an array
  const invoicesArray = Array.isArray(invoices) ? invoices : [];

  const filteredInvoices = invoicesArray.filter(invoice => {
    const searchTermLower = searchTerm.toLowerCase();
    const customerName = `${invoice.first_name || ''} ${invoice.last_name || ''}`.toLowerCase();
    return (
      invoice.invoice_uuid?.toLowerCase().includes(searchTermLower) ||
      customerName.includes(searchTermLower) ||
      invoice.user_email?.toLowerCase().includes(searchTermLower) ||
      invoice.apartment_unit_name?.toLowerCase().includes(searchTermLower) ||
      invoice.apartment_name?.toLowerCase().includes(searchTermLower) ||
      invoice.invoice_amount?.toString().includes(searchTerm) ||
      invoice.invoice_status?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedInvoice(null);
    setShowModal(true);
  };

  const handleEditClick = (invoice) => {
    setEditMode(true);
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleViewClick = (invoice) => {
    if (invoice.invoice_uuid && tenantSlug) {
      navigate(`/${tenantSlug}/invoices/${invoice.invoice_uuid}`);
    } else {
      console.error('Invoice UUID or tenant slug not found');
    }
  };

  // const handleDeleteClick = (invoice) => {
  //   setSelectedInvoice(invoice);
  //   setShowDeleteModal(true);
  // };

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value
    };
    setFilters(newFilters);
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Refresh invoices with new filters
    refreshInvoices(newFilters, 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    refreshInvoices(filters, pageNumber);
    window.scrollTo(0, 0);
  };

  // const handleDeleteConfirm = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setSuccess(false);

  //   try {
  //     if (!user?.token) {
  //       throw new Error('No authentication token found');
  //     }

  //     if (!tenantSlug) {
  //       throw new Error('Tenant slug not found');
  //     }

  //     if (!selectedInvoice?.invoice_uuid) {
  //       throw new Error('No invoice selected for deletion');
  //     }

  //     await axios.delete(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoices/${selectedInvoice.invoice_uuid}`,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${user.token}`,
  //           'Content-Type': 'application/json',
  //           "Accept": "application/json",
  //         }
  //       }
  //     );
      
  //     setSuccess('Invoice deleted successfully!');
  //     refreshInvoices(filters, currentPage);
      
  //     setTimeout(() => {
  //       setShowDeleteModal(false);
  //       setSuccess(false);
  //     }, 1500);
      
  //   } catch (error) {
  //     setError(error.response?.data?.message || 'Failed to delete invoice');
  //     console.error('Error deleting invoice:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderPagination = () => {
    if (!pagination.last_page || pagination.last_page <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < pagination.last_page) {
      if (endPage < pagination.last_page - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={pagination.last_page} onClick={() => handlePageChange(pagination.last_page)}>
          {pagination.last_page}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.last_page}
      />
    );

    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search invoices by customer, unit, apartment..." 
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">
                    Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} invoices
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Create Invoice
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <CardBody>
              <h6 className="mb-3">Filter Invoices</h6>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.from_date}
                      onChange={(e) => handleFilterChange('from_date', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.to_date}
                      onChange={(e) => handleFilterChange('to_date', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="all">All Invoices</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <div>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          const resetFilters = {
                            from_date: defaultFromDate,
                            to_date: defaultToDate,
                            type: 'all'
                          };
                          setFilters(resetFilters);
                          setCurrentPage(1);
                          refreshInvoices(resetFilters, 1);
                        }}
                      >
                        <IconifyIcon icon="bx:reset" className="me-1" />
                        Reset Filters
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {invoicesArray.length > 0 ? (
        <>
          <InvoicesListView 
            invoices={filteredInvoices}
            onEditClick={handleEditClick}
            onViewClick={handleViewClick}
            // onDeleteClick={handleDeleteClick}
          />
          {renderPagination()}
        </>
      ) : (
        <div className="alert alert-info mt-3">
          No invoices found for the selected date range and filters.
        </div>
      )}

      <CreateInvoiceModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshInvoices={() => refreshInvoices(filters, currentPage)}
        editMode={editMode}
        invoiceToEdit={selectedInvoice}
        tenantSlug={tenantSlug}
      />

      {/* Delete Confirmation Modal */}
      {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          {!success && selectedInvoice && (
            <>
              Are you sure you want to delete invoice for <strong>{selectedInvoice.first_name} {selectedInvoice.last_name}</strong> 
              ({selectedInvoice.apartment_unit_name})? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default InvoicesList;