
// // import { useEffect, useState } from 'react';
// // import { Col, Row } from 'react-bootstrap';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import { useParams } from 'react-router-dom';
// // import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// // import PageMetaData from '@/components/PageTitle';
// // import ComplaintsList from './components/ComplaintsList';

// // const Complaints = () => {
// //   const [allComplaints, setAllComplaints] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const { user } = useAuthContext();
// //   const { tenantSlug } = useParams();

// //   const fetchComplaints = async () => {
// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found in URL');
// //       }

// //       const response = await axios.get(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view-all`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       console.log('Fetched complaints data:', response.data.data.data);
      
// //       // Adjust this based on your API response structure
// //       const complaintsData = response.data.data.data || response.data.data || response.data || [];
// //       setAllComplaints(Array.isArray(complaintsData) ? complaintsData : []);
// //       setError(null);
      
// //     } catch (err) {
// //       setError(err.response?.data?.message || err.message || 'Failed to fetch complaints');
// //       setAllComplaints([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (tenantSlug && user?.token) {
// //       fetchComplaints();
// //     }
// //   }, [user, tenantSlug]);

// //   const refreshComplaints = () => {
// //     setLoading(true);
// //     fetchComplaints();
// //   };

// //   if (loading) return <div className="text-center py-4">Loading complaints...</div>;
// //   if (error) return <div className="alert alert-danger">{error}</div>;

// //   return (
// //     <>
// //       <PageBreadcrumb subName="Apps" title="Complaints" />
// //       <PageMetaData title="Complaints" />
      
// //       <Row>
// //         <Col>
// //           <ComplaintsList 
// //             complaints={allComplaints} 
// //             loading={loading}
// //             refreshComplaints={refreshComplaints}
// //             tenantSlug={tenantSlug}
// //           />
// //         </Col>
// //       </Row>
// //     </>
// //   );
// // };

// // export default Complaints;


// import { useEffect, useState } from 'react';
// import { Col, Row } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import MaintenanceList from './components/MaintenanceList';

// const Maintenance = () => {
//   const [allMaintenance, setAllMaintenance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   const fetchMaintenance = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found in URL');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view-all`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched maintenance data:', response.data.data.data);
      
//       // Adjust this based on your API response structure
//       const maintenanceData = response.data.data.data || response.data.data || response.data || [];
//       setAllMaintenance(Array.isArray(maintenanceData) ? maintenanceData : []);
//       setError(null);
      
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch maintenance requests');
//       setAllMaintenance([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tenantSlug && user?.token) {
//       fetchMaintenance();
//     }
//   }, [user, tenantSlug]);

//   const refreshMaintenance = () => {
//     setLoading(true);
//     fetchMaintenance();
//   };

//   if (loading) return <div className="text-center py-4">Loading maintenance requests...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <PageBreadcrumb subName="Apps" title="Maintenance" />
//       <PageMetaData title="Maintenance" />
      
//       <Row>
//         <Col>
//           <MaintenanceList 
//             maintenance={allMaintenance} 
//             loading={loading}
//             refreshMaintenance={refreshMaintenance}
//             tenantSlug={tenantSlug}
//           />
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default Maintenance;




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

      console.log('Fetching maintenance requests...');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/maintenance/view-all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Full API response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data?.data);
      console.log('Response data.data.data:', response.data?.data?.data);
      
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
      
      console.log('Final maintenance data:', maintenanceData);
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