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
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug, invoiceId } = useParams();
  const navigate = useNavigate();

  // Default date range: Jan 1, 2025 to Dec 31, 2025
  const getCurrentYear = () => new Date().getFullYear();
  const getDefaultFromDate = () => `${getCurrentYear()}-01-01`;
  const getDefaultToDate = () => `${getCurrentYear()}-12-31`;

  // Fetch brand data
  const fetchBrandData = async () => {
    try {
      if (!user?.token || !tenantSlug) {
        return null;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/get/brand/data`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setBrandData(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching brand data:', err);
      return null;
    }
  };

  const fetchInvoiceData = async (customFilters = null) => {
    try {
      const payload = customFilters || {
        from_date: getDefaultFromDate(),
        to_date: getDefaultToDate(),
        type: 'all'
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/get/single/${invoiceId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Handle the new response structure
      if (response.data && response.data.data) {
        setInvoice(response.data.data);
        return response.data.data;
      } else if (response.data) {
        // Fallback for old structure if needed
        setInvoice(response.data);
        return response.data;
      } else {
        throw new Error('Invalid response format: No data received');
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validation checks
        if (!user?.token) {
          throw new Error('Authentication required. Please log in again.');
        }

        if (!tenantSlug) {
          throw new Error('Tenant information not found. Please check the URL.');
        }

        if (!invoiceId) {
          throw new Error('Invoice ID not found. Please check the URL.');
        }

        // Fetch brand data (optional, continue even if it fails)
        try {
          await fetchBrandData();
        } catch (brandErr) {
          console.warn('Brand data fetch failed, continuing without it:', brandErr);
        }

        // Fetch invoice data
        await fetchInvoiceData();
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        // Extract meaningful error message
        let errorMessage = 'Failed to fetch invoice details';
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (tenantSlug && invoiceId) {
      fetchData();
    } else if (!tenantSlug || !invoiceId) {
      setError('Missing required parameters. Please check the URL.');
      setLoading(false);
    }
  }, [user, tenantSlug, invoiceId]);

  const handleBack = () => {
    navigate(`/${tenantSlug}/invoice`);
  };

  const refetchInvoiceWithFilters = async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        from_date: customFilters.from_date || getDefaultFromDate(),
        to_date: customFilters.to_date || getDefaultToDate(),
        type: customFilters.type || 'all'
      };

      await fetchInvoiceData(payload);
      setLoading(false);
    } catch (err) {
      console.error('Error refetching invoice:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to refetch invoice';
      setError(errorMessage);
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
            </div>
          </div>
          
          {/* Pass invoice data directly - it's already the data object from the API response */}
          {invoice && <InvoiceDetailView invoice={invoice} brandData={brandData} />}
        </Col>
      </Row>
    </>
  );
};

export default InvoiceDetailPage;