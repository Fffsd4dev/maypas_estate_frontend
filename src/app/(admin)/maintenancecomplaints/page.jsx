import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import MaintenanceList from './components/MaintenanceList';

const Maintenance = () => {
  const [allMaintenance, setAllMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchMaintenance = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Try different possible response structures
      let maintenanceData = [];
      
      if (Array.isArray(response.data?.data?.data)) {
        maintenanceData = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        maintenanceData = response.data.data;
      } else if (Array.isArray(response.data)) {
        maintenanceData = response.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        maintenanceData = [];
      }
      setAllMaintenance(maintenanceData);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching maintenance:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch maintenance requests');
      setAllMaintenance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug && user?.token) {
      fetchMaintenance();
    }
  }, [user, tenantSlug]);

  const refreshMaintenance = () => {
    setLoading(true);
    fetchMaintenance();
  };

  if (loading) return <div className="text-center py-4">Loading maintenance requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Apps" title="Maintenance" />
      <PageMetaData title="Maintenance" />
      
      <Row>
        <Col>
          <MaintenanceList 
            maintenance={allMaintenance} 
            loading={loading}
            refreshMaintenance={refreshMaintenance}
            tenantSlug={tenantSlug}
          />
        </Col>
      </Row>
    </>
  );
};

export default Maintenance;