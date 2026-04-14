// components/SubscriptionsListView.tsx
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const SubscriptionsListView = ({ subscriptions, currentSubscription, onSubscribeClick }) => {
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toFixed(2)}`;
  };

  const getDiscountedPrice = (fee, discount) => {
    const discountedPrice = parseFloat(fee) - (parseFloat(fee) * (parseFloat(discount) / 100));
    return discountedPrice;
  };

  const formatPlanName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const isCurrentPlan = (plan) => {
    if (!currentSubscription) return false;
    
    // Check by name (case insensitive)
    const currentPlanName = currentSubscription.plan_name?.toLowerCase();
    const planName = plan.name?.toLowerCase();
    
    if (currentPlanName && planName) {
      return currentPlanName === planName;
    }
    
    // Fallback to ID check if available
    return currentSubscription.plan_id === plan.id || currentSubscription.id === plan.id;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Plan Name</th>
              <th>Monthly Fee</th>
              {/* <th>Discount</th> */}
              {/* <th>Final Price</th> */}
              <th>Staff Limit</th>
              <th>Admin Limit</th>
              <th>Agent Limit</th>
              <th>Apartment Limit</th>
              <th>Branch Limit</th>
              <th>Location Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((plan, index) => {
              const current = isCurrentPlan(plan);
              // const discountedPrice = getDiscountedPrice(plan.fee, plan.discount);
              
              return (
                <tr 
                  key={plan.id} 
                  className={current ? 'table-primary' : ''}
                  style={current ? { backgroundColor: '#e7f1ff' } : {}}
                >
                  <td>
                    <span className="fw-semibold">{index + 1}</span>
                  </td>
                  <td>
                    <div>
                      <span className="fw-semibold">{formatPlanName(plan.name)}</span>
                      {current && (
                        <div className="mt-1">
                          <Badge bg="primary" style={{ fontSize: '10px' }} className="px-2 py-1">
                            <IconifyIcon icon="bx:check-circle" className="me-1" style={{ fontSize: '10px' }} />
                            Current
                          </Badge>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">{formatCurrency(plan.fee)}</span>
                  </td>
                  {/* <td>
                    <Badge bg="info">{plan.discount}%</Badge>
                  </td> */}
                  {/* <td>
                    <span className="text-success fw-semibold">
                      {formatCurrency(discountedPrice)}
                    </span>
                  </td> */}
                  <td>
                    <span className="text-muted">{plan.number_of_staff || '∞'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{plan.number_of_admins || '∞'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{plan.number_of_agents || '∞'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{plan.number_of_apartments || '∞'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{plan.number_of_branches || '∞'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{plan.number_of_locations || '∞'}</span>
                  </td>
                  <td>
                    <button 
                      className={`btn btn-sm ${current ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => onSubscribeClick(plan)}
                      disabled={current}
                      title={current ? 'Your current plan' : 'Subscribe to this plan'}
                    >
                      <IconifyIcon icon="bx:credit-card" className="me-1" />
                      {current ? 'Current' : 'Subscribe'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SubscriptionsListView;