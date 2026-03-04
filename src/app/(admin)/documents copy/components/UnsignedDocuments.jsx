import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import UnsignedDocumentsList from './components/UnsignedDocumentsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const UnsignedDocuments = () => {
  const [unsignedDocs, setUnsignedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUnsignedDocuments = async (page = 1) => {
    try {
      setLoading(true);
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/document/unsigned/view`,
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
      
      if (response.data?.data) {
        setUnsignedDocs(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
        setTotalItems(response.data.data.total || 0);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch unsigned documents');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchUnsignedDocuments(currentPage);
    }
  }, [user, tenantSlug, currentPage]);

  const refreshDocuments = () => {
    fetchUnsignedDocuments(currentPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && currentPage === 1) return <div className="text-center py-4">Loading unsigned documents...</div>;
  if (error && currentPage === 1) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Unsigned Documents" />
      <PageMetaData title="Unsigned Documents" />
      
      <UnsignedDocumentsList 
        documents={unsignedDocs}
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

export default UnsignedDocuments;