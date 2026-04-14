import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import SubscriptionPlansList from './components/SubscriptionPlansList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchPlans = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/subscription/plan/view/all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // API returns direct array of objects, not nested in data property
      if (Array.isArray(response.data.data)) {
        setPlans(response.data.data);
      } else {
        setPlans([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch subscription plans');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const refreshPlans = () => {
    fetchPlans();
  };

  if (loading) return <div className="text-center py-4">Loading subscription plans...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Subscription" title="Subscription Plans" />
      <PageMetaData title="Subscription Plans" />
      
      <SubscriptionPlansList 
        plans={plans}
        refreshPlans={refreshPlans}
      />
    </>
  );
};

export default SubscriptionPlans;