// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import BrandingList from './components/BrandingList';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';

// const Branding = () => {
//   const [branding, setBranding] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   const fetchBranding = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found in URL');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/get`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched branding data:', response.data.data); 

//       if (response.data && response.data.data) {
//         setBranding(response.data.data);
//       }
      
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch branding');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tenantSlug) {
//       fetchBranding();
//     }
//   }, [user, tenantSlug]);

//   const refreshBranding = () => {
//     fetchBranding();
//   };

//   if (loading) return <div className="text-center py-4">Loading branding...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <PageBreadcrumb subName="Account" title="Branding" />
//       <PageMetaData title="Branding" />
      
//       <BrandingList 
//         branding={branding}
//         refreshBranding={refreshBranding}
//         tenantSlug={tenantSlug}
//       />
//     </>
//   );
// };

// export default Branding;


import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import BrandingList from './components/BrandingList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Branding = () => {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchBranding = async () => {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/get`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Full API response:', response.data);
      console.log('Branding data:', response.data.data);

      // Handle different response structures
      if (response.data && response.data.data) {
        setBranding(response.data.data);
      } else if (response.data) {
        // If data is directly in response.data
        setBranding(response.data);
      } else {
        setBranding(null);
      }
      
    } catch (err) {
      console.error('Error fetching branding:', err);
      // Check if it's a 404 (not found) vs other errors
      if (err.response?.status === 404) {
        // 404 means no branding exists yet, which is fine
        setBranding(null);
        setError(null);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch branding');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token && tenantSlug) {
      fetchBranding();
    }
  }, [user, tenantSlug]);

  const refreshBranding = () => {
    fetchBranding();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading branding...</p>
      </div>
    );
  }

  if (error && !branding) {
    return (
      <>
        <PageBreadcrumb subName="Account" title="Branding" />
        <PageMetaData title="Branding" />
        <div className="alert alert-danger">
          <h5>Error Loading Branding</h5>
          <p className="mb-0">{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchBranding}>
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb subName="Account" title="Branding" />
      <PageMetaData title="Branding" />
      
      <BrandingList 
        branding={branding}
        refreshBranding={refreshBranding}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Branding;