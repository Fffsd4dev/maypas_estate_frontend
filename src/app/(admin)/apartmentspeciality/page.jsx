import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentSpecialtiesList from './components/ApartmentSpecialtiesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ApartmentSpeciality = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchSpecialties = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-specialties`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (Array.isArray(response.data)) {
        setSpecialties(response.data);
      } else {
        setSpecialties([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartment specialties');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, [user]);

  const refreshSpecialties = () => {
    fetchSpecialties();
  };

  if (loading) return <div className="text-center py-4">Loading apartment specialties...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Inventory" title="Apartment Specialties" />
      <PageMetaData title="Apartment Specialties" />
      
      <ApartmentSpecialtiesList 
        specialties={specialties}
        refreshSpecialties={refreshSpecialties}
      />
    </>
  );
};

export default ApartmentSpeciality;