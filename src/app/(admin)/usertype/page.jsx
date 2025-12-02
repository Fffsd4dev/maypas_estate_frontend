import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import UserTypesList from './components/UserTypesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const UserTypes = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();
  console.log('tenantSlug in UserTypes page:', tenantSlug);

  const fetchUserTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/user-types/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched User Types:', response.data.data.data);

      // Handle different response structures
      let userTypesData = [];
      
      if (Array.isArray(response.data)) {
        userTypesData = response.data;
      } else if (response.data?.data.data) {
        userTypesData = Array.isArray(response.data.data.data) ? response.data.data.data : [];
      } else {
        userTypesData = [];
      }

      setUserTypes(userTypesData);
      
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch user types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, [user]);

  const refreshUserTypes = () => {
    fetchUserTypes();
  };

  if (loading) return <div className="text-center py-4">Loading user types...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="User Types" />
      <PageMetaData title="User Types" />
        <UserTypesList 
          userTypes={userTypes}
          refreshUserTypes={refreshUserTypes}
          tenantSlug={tenantSlug}
        />
    </>
  );
};

export default UserTypes;