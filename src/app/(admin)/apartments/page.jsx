
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentsList from './components/ApartmentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchApartments = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Flatten the nested structure into a single array of apartments
        const flattenedApartments = response.data.flatMap(category => 
          category.apartments.map(apartment => ({
            ...apartment,
            category_name: category.name,
            category_description: category.description
          }))
        );
        setApartments(flattenedApartments);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartments');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchApartments();
    }
  }, [user, tenantSlug]);

  const refreshApartments = () => {
    fetchApartments();
  };

  if (loading) return <div className="text-center py-4">Loading apartments...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Apartments" />
      <PageMetaData title="Apartments" />
      
      <ApartmentsList 
        apartments={apartments}
        refreshApartments={refreshApartments}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Apartments;