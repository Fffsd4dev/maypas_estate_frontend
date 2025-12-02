import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentAmenitiesList from './components/ApartmentAmenitiesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ApartmentAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchAmenities = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/amenity/all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched apartment amenities data:', response.data);

      // API returns direct array of objects, not nested in data property
      if (Array.isArray(response.data)) {
        setAmenities(response.data);
      } else {
        setAmenities([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartment amenities');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [user]);

  const refreshAmenities = () => {
    fetchAmenities();
  };

  if (loading) return <div className="text-center py-4">Loading apartment amenities...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Inventory" title="Apartment Amenities" />
      <PageMetaData title="Apartment Amenities" />
      
      <ApartmentAmenitiesList 
        amenities={amenities}
        refreshAmenities={refreshAmenities}
      />
    </>
  );
};

export default ApartmentAmenities;