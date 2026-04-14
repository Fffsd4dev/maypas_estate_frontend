import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import BranchesList from './components/BranchesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Branches = () => {
  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchLocations = async () => {
    try {
      if (!user?.token) throw new Error('Authentication required');
      if (!tenantSlug) throw new Error('Tenant slug not found');

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/location/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const locationsData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setLocations(locationsData);
      
      if (locationsData.length > 0) {
        setSelectedLocation(locationsData[0]);
      }
      
      setLoadingLocations(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch locations');
      setLoadingLocations(false);
    }
  };

  const fetchBranches = async (locationUuid) => {
    if (!locationUuid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/branch/view-all/${locationUuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const branchesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setBranches(branchesData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [user, tenantSlug]);

  useEffect(() => {
    if (selectedLocation?.uuid) {
      fetchBranches(selectedLocation.uuid);
    }
  }, [selectedLocation]);

  const handleLocationChange = (locationUuid) => {
    const location = locations.find(loc => loc.uuid === locationUuid);
    setSelectedLocation(location);
  };

  const refreshBranches = () => {
    if (selectedLocation?.uuid) {
      fetchBranches(selectedLocation.uuid);
    }
  };

  if (loadingLocations) return <div className="text-center py-4">Loading locations...</div>;
  if (error && locations.length === 0) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Properties" title="Branches" />
      <PageMetaData title="Branches" />
      
      <BranchesList 
        locations={locations}
        branches={branches}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        refreshBranches={refreshBranches}
        tenantSlug={tenantSlug}
        loading={loading}
      />
    </>
  );
};

export default Branches;