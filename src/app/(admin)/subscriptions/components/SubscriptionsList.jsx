// components/SubscriptionsList.tsx
import { useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SubscriptionsListView from './SubscriptionsListView';
import SubscribeModal from './SubscribeModal';
import CurrentSubscriptionCard from './CurrentSubscriptionCard';

const SubscriptionsList = ({ subscriptions, currentSubscription, refreshSubscriptions, tenantSlug }) => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure subscriptions is always an array
  const subscriptionsArray = Array.isArray(subscriptions) ? subscriptions : [];

  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setShowSubscribeModal(true);
  };

  // Filter plans based on search only
  const filteredSubscriptions = subscriptionsArray.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Current Subscription Overview */}
      <CurrentSubscriptionCard currentSubscription={currentSubscription} />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search subscription plans..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {filteredSubscriptions.length > 0 ? (
        <SubscriptionsListView 
          subscriptions={filteredSubscriptions}
          currentSubscription={currentSubscription}
          onSubscribeClick={handleSubscribeClick}
        />
      ) : (
        <div className="alert alert-info mt-3">
          <IconifyIcon icon="bx:info-circle" className="me-2" />
          No subscription plans found matching your search.
        </div>
      )}

      {/* Subscribe Modal */}
      <SubscribeModal 
        show={showSubscribeModal}
        handleClose={() => setShowSubscribeModal(false)}
        refreshSubscriptions={refreshSubscriptions}
        planToSubscribe={selectedPlan}
        currentSubscription={currentSubscription}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default SubscriptionsList;