import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import LocationsList from './components/LocationsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchLocations = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/location/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle the response structure - based on your example, it returns array directly
      const locationsData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setLocations(locationsData);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch locations');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchLocations();
    }
  }, [user, tenantSlug]);

  const refreshLocations = () => {
    fetchLocations();
  };

  if (loading) return <div className="text-center py-4">Loading locations...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Properties" title="Locations" />
      <PageMetaData title="Locations" />
      
      <LocationsList 
        locations={locations}
        refreshLocations={refreshLocations}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Locations;