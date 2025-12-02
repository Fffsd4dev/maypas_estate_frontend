
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import InvoiceDetailView from './InvoiceDetailView';
import { Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const InvoiceDetailPage = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug, invoiceId } = useParams();
  const navigate = useNavigate();

  // Default date range: Jan 1, 2025 to Dec 31, 2025
  const getDefaultFromDate = () => '2025-01-01';
  const getDefaultToDate = () => '2025-12-31';

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        
        if (!user?.token) {
          throw new Error('Authentication required');
        }

        if (!tenantSlug) {
          throw new Error('Tenant slug not found');
        }

        if (!invoiceId) {
          throw new Error('Invoice ID not found');
        }

        // Prepare the payload with date filters
        const payload = {
          from_date: getDefaultFromDate(),
          to_date: getDefaultToDate(),
          type: 'all' // You can adjust this as needed
        };

        console.log('Fetching single invoice with payload:', payload);
        console.log('Invoice ID:', invoiceId);

        // Use POST request to get the specific invoice using the dedicated endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/get/single/${invoiceId}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Single invoice detail response:', response.data);

        if (response.data && response.data.data) {
          setInvoice(response.data.data);
        } else if (response.data) {
          // If the data is directly in response.data
          setInvoice(response.data);
        } else {
          throw new Error('Invalid response format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching single invoice:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch invoice details');
        setLoading(false);
      }
    };

    if (tenantSlug && invoiceId) {
      fetchInvoice();
    }
  }, [user, tenantSlug, invoiceId]);

  const handleBack = () => {
    navigate(`/${tenantSlug}/invoices`); // Go back to invoices list with tenant slug
  };

  // Function to refetch invoice with custom filters
  const refetchInvoiceWithFilters = async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        from_date: customFilters.from_date || getDefaultFromDate(),
        to_date: customFilters.to_date || getDefaultToDate(),
        type: customFilters.type || 'all'
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/get/single/${invoiceId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.data) {
        setInvoice(response.data.data);
      } else if (response.data) {
        setInvoice(response.data);
      } else {
        throw new Error('Invalid response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refetching invoice:', err);
      setError(err.response?.data?.message || err.message || 'Failed to refetch invoice');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading invoice details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumb 
          subName="Account" 
          title="Invoice Error" 
          breadcrumbs={[
            { name: 'Invoices', path: `/${tenantSlug}/invoices` },
            { name: 'Invoice Error', active: true }
          ]}
        />
        <PageMetaData title="Invoice Error" />
        <Alert variant="danger" className="mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => refetchInvoiceWithFilters()} 
                className="me-2"
              >
                <IconifyIcon icon="bx:refresh" className="me-1" />
                Retry
              </Button>
              <Button variant="outline-danger" onClick={handleBack}>
                Go Back to Invoices
              </Button>
            </div>
          </div>
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Account" 
        title="Invoice Details" 
        breadcrumbs={[
          { name: 'Invoices', path: `/${tenantSlug}/invoices` },
          { name: 'Invoice Details', active: true }
        ]}
      />
      <PageMetaData title="Invoice Details" />
      
      <Row>
        <Col xs={12}>
          <div className="d-print-none mb-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <Button variant="outline-primary" onClick={handleBack} className="me-2">
                  <IconifyIcon icon="bx:arrow-back" className="me-1" />
                  Back to Invoices
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => refetchInvoiceWithFilters()}
                  disabled={loading}
                >
                  <IconifyIcon icon="bx:refresh" className="me-1" />
                  Refresh
                </Button>
              </div>
              <Button variant="primary" onClick={() => window.print()}>
                <IconifyIcon icon="bx:printer" className="me-1" />
                Print Invoice
              </Button>
            </div>
          </div>
          
          {invoice && <InvoiceDetailView invoice={invoice} />}
        </Col>
      </Row>
    </>
  );
};

export default InvoiceDetailPage;