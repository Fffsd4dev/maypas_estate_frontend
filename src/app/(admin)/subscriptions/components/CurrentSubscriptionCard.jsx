// components/CurrentSubscriptionCard.tsx
import { Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CurrentSubscriptionCard = ({ currentSubscription }) => {
  const formatCurrency = (amount) => {
    if (!amount) return '₦0.00';
    return `₦${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const totalDuration = end - start;
    const elapsed = today - start;
    const progress = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getStatusBadge = () => {
    if (!currentSubscription) return null;
    
    const endDate = new Date(currentSubscription.end_date);
    const today = new Date();
    
    if (endDate < today) {
      return <Badge bg="danger">Expired</Badge>;
    }
    
    const daysRemaining = calculateDaysRemaining(currentSubscription.end_date);
    if (daysRemaining <= 7) {
      return <Badge bg="warning">Expiring Soon</Badge>;
    }
    
    return <Badge bg="success">Active</Badge>;
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!currentSubscription) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-5">
          <IconifyIcon icon="bx:info-circle" className="display-1 text-muted mb-3" />
          <h5>No Active Subscription</h5>
          <p className="text-muted">You don't have an active subscription plan yet.</p>
          <p className="text-muted">Choose a plan below to get started!</p>
        </Card.Body>
      </Card>
    );
  }

  const daysRemaining = calculateDaysRemaining(currentSubscription.end_date);
  const progress = calculateProgress(currentSubscription.start_date, currentSubscription.end_date);
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const planName = capitalizeFirstLetter(currentSubscription.plan_name || 'Current Plan');

  return (
    <Card className="mb-4 border-primary">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="bx:check-shield" className="me-2" />
            Current Subscription
          </h5>
          {getStatusBadge()}
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <div className="mb-3">
              <h3 className="text-primary mb-2">{planName}</h3>
              <div className="d-flex align-items-center gap-3">
                <div>
                  <small className="text-muted d-block">Monthly Fee</small>
                  <span className="h4 mb-0">{formatCurrency(currentSubscription.monthly_fee || currentSubscription.amount)}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-md-end">
              <div className="mb-2">
                <small className="text-muted">Subscription Period</small>
                <div className="fw-semibold">
                  {formatDate(currentSubscription.start_date)} - {formatDate(currentSubscription.end_date)}
                </div>
              </div>
              <div>
                <small className="text-muted">Next Billing Date</small>
                <div className="fw-semibold">{formatDate(currentSubscription.end_date)}</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="fw-semibold">Subscription Progress</span>
            </div>
            <div>
              {isExpiringSoon ? (
                <Badge bg="warning" className="px-3 py-2">
                  <IconifyIcon icon="bx:time" className="me-1" />
                  Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </Badge>
              ) : (
                <span className="text-muted">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
              )}
            </div>
          </div>
          <ProgressBar 
            now={progress} 
            variant={isExpiringSoon ? 'warning' : 'success'} 
            className="mb-2"
            style={{ height: '10px' }}
          />
          <small className="text-muted">
            Started {formatDate(currentSubscription.start_date)}
          </small>
        </div>

        <Row className="g-3">
          <Col xs={6} md={4}>
            <div className="border rounded p-3 text-center">
              <IconifyIcon icon="bx:user" className="h4 mb-2 text-primary" />
              <div className="fw-semibold">{currentSubscription.staff_limit || '0'}</div>
              <small className="text-muted">Staff</small>
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div className="border rounded p-3 text-center">
              <IconifyIcon icon="bx:user-voice" className="h4 mb-2 text-primary" />
              <div className="fw-semibold">{currentSubscription.agent_limit || '0'}</div>
              <small className="text-muted">Agents</small>
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div className="border rounded p-3 text-center">
              <IconifyIcon icon="bx:home" className="h4 mb-2 text-primary" />
              <div className="fw-semibold">{currentSubscription.apartment_limit || '0'}</div>
              <small className="text-muted">Apartments</small>
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div className="border rounded p-3 text-center">
              <IconifyIcon icon="bx:store" className="h4 mb-2 text-primary" />
              <div className="fw-semibold">{currentSubscription.branch_limit || '0'}</div>
              <small className="text-muted">Branches</small>
            </div>
          </Col>
          <Col xs={6} md={4}>
            <div className="border rounded p-3 text-center">
              <IconifyIcon icon="bx:map" className="h4 mb-2 text-primary" />
              <div className="fw-semibold">{currentSubscription.location_limit || '0'}</div>
              <small className="text-muted">Locations</small>
            </div>
          </Col>
        </Row>

        {/* Additional Info */}
        {currentSubscription.start_date && currentSubscription.end_date && (
          <div className="mt-3 text-muted small">
            <IconifyIcon icon="bx:calendar" className="me-1" />
            Your subscription is active and will expire on {formatDate(currentSubscription.end_date)}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CurrentSubscriptionCard;