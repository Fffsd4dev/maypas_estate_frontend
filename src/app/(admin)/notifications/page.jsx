import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import NotificationsList from './components/NotificationsList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();
  
  // Get userType directly from user context
  const userType = user?.userType || user?.role || 'agent';

  const fetchNotifications = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found in URL');
      }

      console.log('Fetching notifications as:', userType);
      
      let endpoint = '';
      
      // Use different endpoints based on user type
      if (userType === 'landlord') {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/notification/list/read`;
      } else {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/notification/list`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetched notifications data:', response.data);

      if (response.data) {
        // Transform the API response
        const transformedNotifications = response.data.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.data?.message || 
                (notification.type === 'complaint' ? 'New Complaint' : 
                 notification.type === 'maintenance' ? 'Maintenance Request' : 'Notification'),
          message: notification.data?.message || 'No message available',
          is_read: notification.is_read, // "yes" or "no"
          created_at: notification.created_at || new Date().toISOString(),
          data: notification.data,
          apartment: notification.apartment,
          apartment_unit: notification.apartment_unit,
          ...(notification.type === 'complaint' && { complain: notification.complain })
        }));
        
        setNotifications(transformedNotifications);
        
        // Calculate unread count
        const unread = transformedNotifications.filter(n => n.is_read === 'no').length;
        setUnreadCount(unread);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug && user?.token) {
      fetchNotifications();
    }
  }, [user, tenantSlug]);

  const refreshNotifications = () => {
    fetchNotifications();
  };

  if (loading) return <div className="text-center py-4">Loading notifications...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Notifications" />
      <PageMetaData title="Notifications" />
      
      <NotificationsList 
        notifications={notifications}
        unreadCount={unreadCount}
        refreshNotifications={refreshNotifications}
        tenantSlug={tenantSlug}
        userType={userType}
      />
    </>
  );
};

export default Notifications;