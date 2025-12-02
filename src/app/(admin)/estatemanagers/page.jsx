import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import EstateManagersList from './components/EstateManagersList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const EstateManagers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchManagers = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-estate-managers`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setManagers(response.data.data.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch estate managers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [user]);

  const refreshManagers = () => {
    fetchManagers();
  };

  if (loading) return <div className="text-center py-4">Loading estate managers...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Estate Managers" />
      <PageMetaData title="Estate Managers" />
      
      <EstateManagersList 
        managers={managers}
        refreshManagers={refreshManagers}
      />
    </>
  );
};

export default EstateManagers;