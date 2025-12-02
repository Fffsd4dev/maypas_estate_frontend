import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import LandlordsList from './components/LandlordsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Landlords = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchLandlords = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-landlords`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setLandlords(response.data.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch landlords');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchLandlords();
    }
  }, [user, tenantSlug]);

  const refreshLandlords = () => {
    fetchLandlords();
  };

  if (loading) return <div className="text-center py-4">Loading landlords...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Landlords" />
      <PageMetaData title="Landlords" />
      
      <LandlordsList 
        landlords={landlords}
        refreshLandlords={refreshLandlords}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Landlords;