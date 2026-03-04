import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import AgentsList from './components/AgentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchAgents = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/list-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract agents from response
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setAgents(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setAgents(response.data);
      } else {
        console.warn('Unexpected agents response structure:', response.data);
        setAgents([]);
      }
      
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch agents');
      setAgents([]);
    }
  };

  const fetchUserTypes = async () => {
    try {
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

      // Extract user types from response
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        setUserTypes(response.data.data.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setUserTypes(response.data.data);
      } else {
        console.warn('Unexpected user types response structure:', response.data);
        setUserTypes([]);
      }
      
    } catch (err) {
      console.error('Error fetching user types:', err);
      setUserTypes([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (tenantSlug && user?.token) {
          await Promise.all([
            fetchAgents(),
            fetchUserTypes()
          ]);
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, tenantSlug]);

  const refreshAgents = () => {
    fetchAgents();
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Agents" />
      <PageMetaData title="Agents" />
      
      <AgentsList 
        agents={agents}
        userTypes={userTypes}
        refreshAgents={refreshAgents}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Agents;