import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TenantSignedDocumentsList from './components/TenantSignedDocumentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const TenantSignedDocuments = () => {
  const [signedDocs, setSignedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSignedDocuments = async (page = 1) => {
    try {
      setLoading(true);
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/signed/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          params: {
            page: page
          }
        }
      );
      
      if (response.data) {
        // Response structure: {current_page, data: [{uuid, filename}], ...}
        setSignedDocs(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch your signed documents');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug && user?.token) {
      fetchSignedDocuments(currentPage);
    }
  }, [user, tenantSlug, currentPage]);

  const refreshDocuments = () => {
    fetchSignedDocuments(currentPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && currentPage === 1) return <div className="text-center py-4">Loading your signed documents...</div>;
  if (error && currentPage === 1) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Documents" title="Signed Documents" />
      <PageMetaData title="Your Signed Documents" />
      
      <TenantSignedDocumentsList 
        documents={signedDocs}
        refreshDocuments={refreshDocuments}
        tenantSlug={tenantSlug}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default TenantSignedDocuments;