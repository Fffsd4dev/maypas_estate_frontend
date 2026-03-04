import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import RolesList from './components/AdminRoleList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchRoles = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-roles`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        setRoles(response.data.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch roles');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user]);

  const refreshRoles = () => {
    fetchRoles();
  };

  if (loading) return <div className="text-center py-4">Loading roles...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Admin Roles" />
      <PageMetaData title="Admin Roles" />
        <RolesList 
          roles={roles}
          refreshRoles={refreshRoles}
        />
    </>
  );
};

export default AdminRoles;