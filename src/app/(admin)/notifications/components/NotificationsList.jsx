import { useState } from 'react';
import { Card, CardBody, Col, Row, Button, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import NotificationsListView from './NotificationsListView';
import NotificationDetailModal from './NotificationDetailModal';

const NotificationsList = ({ 
  notifications, 
  unreadCount, 
  refreshNotifications,
  tenantSlug,
  userType 
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterReadStatus, setFilterReadStatus] = useState('all');

  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const filteredNotifications = notificationsArray.filter(notification => {
    // Search filter
    const matchesSearch = 
      notification.data?.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.apartment?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.complain?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === 'all' || notification.type === filterType;
    
    // Read status filter
    const matchesReadStatus = 
      filterReadStatus === 'all' ||
      (filterReadStatus === 'read' && notification.is_read === 'yes') ||
      (filterReadStatus === 'unread' && notification.is_read === 'no');
    
    return matchesSearch && matchesType && matchesReadStatus;
  });

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <Badge bg="primary" className="me-2">
                    {userType === 'landlord' ? 'Landlord' : 'Agent'}
                  </Badge>
                  <Badge bg="danger" className="me-2">
                    {unreadCount} Unread
                  </Badge>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={refreshNotifications}
                    className="ms-2"
                  >
                    <IconifyIcon icon="bx:refresh" className="me-1" />
                    Refresh
                  </Button>
                </div>
                
                <div className="d-flex flex-wrap gap-2">
                  <div className="btn-group" role="group">
                    <Button
                      variant={filterType === 'all' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      All Types
                    </Button>
                    <Button
                      variant={filterType === 'complaint' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterType('complaint')}
                    >
                      Complaints
                    </Button>
                    <Button
                      variant={filterType === 'maintenance' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterType('maintenance')}
                    >
                      Maintenance
                    </Button>
                  </div>
                  
                  <div className="btn-group" role="group">
                    <Button
                      variant={filterReadStatus === 'all' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterReadStatus('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterReadStatus === 'unread' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterReadStatus('unread')}
                    >
                      Unread
                    </Button>
                    <Button
                      variant={filterReadStatus === 'read' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterReadStatus('read')}
                    >
                      Read
                    </Button>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <div className="search-bar me-3">
                    <span>
                      <IconifyIcon icon="bx:search-alt" className="mb-1" />
                    </span>
                    <input 
                      type="search" 
                      className="form-control" 
                      placeholder="Search by message, location, or type..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {notificationsArray.length > 0 ? (
        <>
          {filteredNotifications.length > 0 ? (
            <NotificationsListView 
              notifications={filteredNotifications}
              onNotificationClick={handleNotificationClick}
            />
          ) : (
            <div className="alert alert-warning mt-3">
              No notifications match your filters
            </div>
          )}
          
          <div className="mt-3 text-muted">
            Showing {filteredNotifications.length} of {notificationsArray.length} notifications
          </div>
        </>
      ) : (
        <div className="alert alert-info mt-3">
          No notifications found for {userType === 'landlord' ? 'landlord' : 'agent'}
        </div>
      )}

      <NotificationDetailModal 
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        notification={selectedNotification}
        tenantSlug={tenantSlug}
        userType={userType}
      />
    </>
  );
};

export default NotificationsList;