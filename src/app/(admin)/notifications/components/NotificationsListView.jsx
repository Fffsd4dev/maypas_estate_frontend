import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const NotificationsListView = ({ notifications, onNotificationClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'maintenance':
        return 'bx:wrench';
      case 'complaint':
        return 'bx:message-alt-error';
      default:
        return 'bx:bell';
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'maintenance':
        return 'Maintenance';
      case 'complaint':
        return 'Complaint';
      default:
        return type || 'Notification';
    }
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>S/N</th>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr 
                key={notification.id || index}
                className={notification.is_read === 'yes' ? '' : 'table-active'}
                onClick={() => onNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <IconifyIcon 
                    icon={getNotificationIcon(notification.type)} 
                    className={notification.is_read === 'yes' ? 'text-muted' : 'text-primary'}
                  />
                </td>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">
                    {notification.data?.message || 
                     (notification.type === 'complaint' ? 'New Complaint' : 
                      notification.type === 'maintenance' ? 'Maintenance Request' : 'Notification')}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    notification.type === 'complaint' ? 'bg-warning' : 
                    notification.type === 'maintenance' ? 'bg-info' : 
                    'bg-secondary'
                  }`}>
                    {getNotificationTypeLabel(notification.type)}
                  </span>
                </td>
                <td>
                  <span className="text-muted">
                    {notification.apartment?.location || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="text-muted">{formatDate(notification.created_at)}</span>
                </td>
                <td>
                  <span className={`badge ${notification.is_read === 'yes' ? 'bg-success' : 'bg-danger'}`}>
                    {notification.is_read === 'yes' ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotificationClick(notification);
                    }}
                    title="View Details"
                  >
                    <IconifyIcon icon="bx:show" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default NotificationsListView;