// import { useEffect, useState } from 'react';
// import { Col, Row } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import ComplaintsList from './components/ComplaintsList';

// const Complaints = () => {
//   const [allComplaints, setAllComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   console.log('allComplaints from URL Params:', allComplaints);

//   const fetchComplaints = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found in URL');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/maintenance/view-all`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched complaints data:', response.data.data);
      
//       // Adjust this based on your API response structure
//       const complaintsData = response.data.complaints || response.data.data.data || response.data || [];
//       setAllComplaints(Array.isArray(complaintsData) ? complaintsData : []);
//       setError(null);

//       console.log('All Complaints State Updated:', complaintsData);
      
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch complaints');
//       setAllComplaints([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tenantSlug && user?.token) {
//       fetchComplaints();
//     }
//   }, [user, tenantSlug]);

//   const refreshComplaints = () => {
//     setLoading(true);
//     fetchComplaints();
//   };

//   if (loading) return <div className="text-center py-4">Loading complaints...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <PageBreadcrumb subName="Apps" title="Maintenance Complaints" />
//       <PageMetaData title="Maintenance Complaints" />
      
//       <Row>
//         <Col>
//           <ComplaintsList 
//             complaints={allComplaints}
//             loading={loading}
//             refreshComplaints={refreshComplaints}
//             tenantSlug={tenantSlug}
//           />
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default Complaints;



import { useEffect, useState } from 'react';
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

  console.log('allComplaints from URL Params:', allComplaints);

  const fetchComplaints = async () => {
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

      console.log('Fetched maintenance complaints data:', response.data);
      
      // Adjust based on your API response structure for maintenance complaints
      const complaintsData = response.data.maintenances || response.data.data.data || response.data || [];
      setAllComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      setError(null);

      console.log('All Maintenance Complaints State Updated:', complaintsData);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch maintenance complaints');
      setAllComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug && user?.token) {
      fetchComplaints();
    }
  }, [user, tenantSlug]);

  const refreshComplaints = () => {
    setLoading(true);
    fetchComplaints();
  };

  if (loading) return <div className="text-center py-4">Loading maintenance complaints...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Apps" title="Maintenance Complaints" />
      <PageMetaData title="Maintenance Complaints" />
      
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