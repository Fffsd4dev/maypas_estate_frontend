import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TechniciansList from './components/TechniciansList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchTechnicians = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-technicians`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched technicians data:', response.data);

      if (response.data) {
        setTechnicians(response.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch technicians');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchTechnicians();
    }
  }, [user, tenantSlug]);

  const refreshTechnicians = () => {
    fetchTechnicians();
  };

  if (loading) return <div className="text-center py-4">Loading technicians...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Technicians" />
      <PageMetaData title="Technicians" />
      
      <TechniciansList 
        technicians={technicians}
        refreshTechnicians={refreshTechnicians}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Technicians;