import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import SubscriptionsList from './components/SubscriptionsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  // Subscriptions.tsx - Update the fetchCurrentSubscription function
const fetchCurrentSubscription = async () => {
  try {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    if (!tenantSlug) {
      throw new Error('Tenant slug not found in URL');
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/omoleestate/landlord/rent/account/current`,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.success && response.data.data) {
      // Transform the data to match our expected format
      const subscriptionData = response.data.data;
      setCurrentSubscription({
        plan_name: subscriptionData.subscription_name,
        plan_id: subscriptionData.subscription_id || subscriptionData.id, // Handle if ID exists
        monthly_fee: subscriptionData.fee,
        amount: subscriptionData.fee,
        staff_limit: subscriptionData.number_of_staff,
        admin_limit: subscriptionData.number_of_admins || '0', // Not in response, set default
        agent_limit: subscriptionData.number_of_agents,
        apartment_limit: subscriptionData.number_of_apartments,
        branch_limit: subscriptionData.number_of_branches,
        location_limit: subscriptionData.number_of_locations,
        start_date: subscriptionData.start_date,
        end_date: subscriptionData.end_date,
        status: 'active', // Assuming active if we have dates
        discount: 0 // Not in response, set default
      });
    }
  } catch (err) {
    console.error('Error fetching current subscription:', err);
    // Don't set error here, as user might not have a subscription
  }
};

  const fetchSubscriptions = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/plan/view/all`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSubscriptions(response.data.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch subscriptions');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      Promise.all([fetchCurrentSubscription(), fetchSubscriptions()]);
    }
  }, [user, tenantSlug]);

  const refreshSubscriptions = () => {
    fetchSubscriptions();
    fetchCurrentSubscription();
  };

  if (loading) return <div className="text-center py-4">Loading subscription plans...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Subscription Plans" />
      <PageMetaData title="Subscription Plans" />
      
      <SubscriptionsList 
        subscriptions={subscriptions}
        currentSubscription={currentSubscription}
        refreshSubscriptions={refreshSubscriptions}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default Subscriptions;