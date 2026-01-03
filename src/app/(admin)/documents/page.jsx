// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import DocumentsList from './components/DocumentsList';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   const fetchDocuments = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found in URL');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-documents`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched documents data:', response.data);

//       if (response.data) {
//         setDocuments(response.data || []);
//       }
      
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch documents');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tenantSlug) {
//       fetchDocuments();
//     }
//   }, [user, tenantSlug]);

//   const refreshDocuments = () => {
//     fetchDocuments();
//   };

//   if (loading) return <div className="text-center py-4">Loading documents...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <PageBreadcrumb subName="Account" title="Document Templates" />
//       <PageMetaData title="Document Templates" />
      
//       <DocumentsList 
//         documents={documents}
//         refreshDocuments={refreshDocuments}
//         tenantSlug={tenantSlug}
//       />
//     </>
//   );
// };

// export default Documents;




import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import DocumentsList from './components/DocumentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setApiError(null);

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/view-documents`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          // Add timeout to prevent hanging
          timeout: 10000
        }
      );

      console.log('Fetched documents data:', response.data);

      if (response.data) {
        // Transform data to include PDF-specific properties
        const transformedDocs = response.data.map(doc => ({
          ...doc,
          pdf_fields: doc.form_json?.components || [],
          pdf_template: doc.form_json || { components: [] }
        }));
        setDocuments(transformedDocs || []);
      }
      
    } catch (err) {
      // Handle specific error cases
      if (err.code === 'ECONNABORTED') {
        setApiError('Request timeout. Please check your connection.');
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          setApiError(`API endpoint not found. The route ${tenantSlug}/view-documents does not exist.`);
        } else if (err.response.status === 401) {
          setApiError('Authentication failed. Please log in again.');
        } else {
          setApiError(err.response?.data?.message || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response
        setApiError('No response from server. The backend might be down.');
      } else {
        // Other errors
        setApiError(err.message || 'Failed to fetch documents');
      }
      
      // Set empty array to allow UI to render
      setDocuments([]);
      console.warn('API Error (non-blocking):', err.message);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchDocuments();
    }
  }, [user, tenantSlug]);

  const refreshDocuments = () => {
    fetchDocuments();
  };

  return (
    <>
      <PageBreadcrumb subName="Account" title="Document Templates" />
      <PageMetaData title="Document Templates" />
      
      {/* Show API error as warning, not blocking */}
      {apiError && (
        <div className="alert alert-warning alert-dismissible fade show mb-3" role="alert">
          <strong>Note:</strong> {apiError} You can still create new document templates.
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setApiError(null)}
          ></button>
        </div>
      )}
      
      {/* Always show DocumentsList, even with errors or empty state */}
      <DocumentsList 
        documents={documents}
        refreshDocuments={refreshDocuments}
        tenantSlug={tenantSlug}
        apiError={apiError}
        loading={loading}
      />
    </>
  );
};

export default Documents;