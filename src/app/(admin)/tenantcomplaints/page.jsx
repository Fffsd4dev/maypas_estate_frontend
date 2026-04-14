import { useEffect, useState, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ComplaintsList from './components/ComplaintsList';

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const deduplicateComplaints = (complaints) => {
    const uniqueMap = new Map();
    
    complaints.forEach(complaint => {
      const id = complaint.id || complaint.complaint_id || complaint._id;
      if (id && !uniqueMap.has(id)) {
        uniqueMap.set(id, complaint);
      }
    });
    
    return Array.from(uniqueMap.values());
  };

  const fetchComplaints = useCallback(async () => {
    if (!user?.token || !tenantSlug) return;
    
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract complaints from response
      let complaintsData = [];
      const data = response.data;
      
      if (data?.data?.data && Array.isArray(data.data.data)) {
        complaintsData = data.data.data;
      } else if (data?.data && Array.isArray(data.data)) {
        complaintsData = data.data;
      } else if (Array.isArray(data)) {
        complaintsData = data;
      } else if (data?.complaints && Array.isArray(data.complaints)) {
        complaintsData = data.complaints;
      }
      
      // Remove duplicates
      const uniqueComplaints = deduplicateComplaints(complaintsData);
      
      setAllComplaints(uniqueComplaints);
      setError(null);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch complaints');
      setAllComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [user, tenantSlug]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const refreshComplaints = useCallback(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  if (loading) return <div className="text-center py-4">Loading complaints...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Apps" title="Complaints" />
      <PageMetaData title="Complaints" />
      
      <Row>
        <Col>
          <ComplaintsList 
            complaints={allComplaints} 
            loading={loading}
            refreshComplaints={refreshComplaints}
            tenantSlug={tenantSlug}
          />
        </Col>
      </Row>
    </>
  );
};

export default Complaints;