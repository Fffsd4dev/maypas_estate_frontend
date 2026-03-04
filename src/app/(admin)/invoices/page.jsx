import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import InvoicesList from './components/InvoicesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  // Default date range: Jan 1, 2025 to Dec 31, 2025
  const getCurrentYear = () => new Date().getFullYear();

const getDefaultFromDate = () => `${getCurrentYear()}-01-01`;
const getDefaultToDate = () => `${getCurrentYear()}-12-31`;

  const fetchInvoices = async (filters = {}, page = 1) => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const payload = {
        from_date: filters.from_date || getDefaultFromDate(),
        to_date: filters.to_date || getDefaultToDate(),
        type: filters.type || 'all'
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/get/all?page=${page}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.data) {
        setInvoices(response.data.data.data || []);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          from: response.data.data.from,
          to: response.data.data.to
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchInvoices();
    }
  }, [user, tenantSlug]);

  const refreshInvoices = (filters = {}, page = 1) => {
    fetchInvoices(filters, page);
  };

  if (loading) return <div className="text-center py-4">Loading invoices...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Invoices" />
      <PageMetaData title="Invoices" />
      
      <InvoicesList 
        invoices={invoices}
        pagination={pagination}
        refreshInvoices={refreshInvoices}
        tenantSlug={tenantSlug}
        defaultFromDate={getDefaultFromDate()}
        defaultToDate={getDefaultToDate()}
      />
    </>
  );
};

export default Invoices;