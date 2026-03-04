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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/maintenance/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const maintenanceData = response.data.maintenances || response.data.data.data || response.data || [];
      setAllMaintenance(Array.isArray(maintenanceData) ? maintenanceData : []);
      setError(null);

    } catch (err) {
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
      <PageBreadcrumb subName="Apps" title="Maintenance Requests" />
      <PageMetaData title="Maintenance Requests" />
      
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