import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import SubscribersList from './components/SubscribersList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const Subscribers = () => {
  const [subscribersData, setSubscribersData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 50
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchSubscribers = async (page = 1) => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscribers/plan/all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status && response.data.data?.subscribers) {
        setSubscribersData(response.data.data.subscribers);
      } else {
        setSubscribersData({
          data: [],
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 50
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch subscribers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [user]);

  const refreshSubscribers = () => {
    fetchSubscribers(subscribersData.current_page);
  };

  const handlePageChange = (page) => {
    fetchSubscribers(page);
  };

  if (loading) return <div className="text-center py-4">Loading subscribers...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Subscription" title="Subscribers" />
      <PageMetaData title="Subscribers" />
      
      <SubscribersList 
        subscribers={subscribersData.data}
        pagination={{
          current_page: subscribersData.current_page,
          last_page: subscribersData.last_page,
          total: subscribersData.total,
          per_page: subscribersData.per_page
        }}
        onPageChange={handlePageChange}
        refreshSubscribers={refreshSubscribers}
      />
    </>
  );
};

export default Subscribers;