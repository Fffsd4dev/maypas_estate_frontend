import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentCategoriesList from './components/ApartmentCategoriesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ApartmentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchCategories = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/apartment/categories`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // API returns direct array of objects, not nested in data property
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartment categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const refreshCategories = () => {
    fetchCategories();
  };

  if (loading) return <div className="text-center py-4">Loading apartment categories...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Inventory" title="Apartment Categories" />
      <PageMetaData title="Apartment Categories" />
      
      <ApartmentCategoriesList 
        categories={categories}
        refreshCategories={refreshCategories}
      />
    </>
  );
};

export default ApartmentCategories;