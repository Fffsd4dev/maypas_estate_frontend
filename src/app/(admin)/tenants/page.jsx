import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TenantsList from './components/TenantsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchTenants = async (page = 1) => {
    try {
      setLoading(true);

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenants/view`,
        {
          params: { page },
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        const usersPayload = response.data.users;
        setTenants(usersPayload.data || []);
        setPagination({
          currentPage: usersPayload.current_page,
          lastPage: usersPayload.last_page,
          total: usersPayload.total,
          perPage: usersPayload.per_page,
        });
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tenants');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchTenants(1);
    }
  }, [user, tenantSlug]);

  const refreshTenants = () => {
    fetchTenants(pagination.currentPage);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return;
    fetchTenants(page);
  };

  if (loading) return <div className="text-center py-4">Loading tenants...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Tenants" />
      <PageMetaData title="Tenants" />

      <TenantsList
        tenants={tenants}
        refreshTenants={refreshTenants}
        tenantSlug={tenantSlug}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Tenants;