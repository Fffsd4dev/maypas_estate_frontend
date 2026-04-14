import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const SubscriptionPlansListView = ({ plans, onEditClick, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Plan Name</th>
              <th>Staff</th>
              <th>Admins</th>
              <th>Agents</th>
              <th>Apartment</th>
              <th>Branches</th>
              <th>Locations</th>
              <th>Fee</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.id || plan.uuid || index}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{plan.name}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_staff || 0}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_admins || 0}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_agents || 0}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_apartments || 0}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_branches ||0}</span>
                </td>
                <td>
                  <span className="">{plan.number_of_locations || 0}</span>
                </td>
                <td>
                  <span className="fw-semibold text-success">
                    ₦{plan.fee?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  {plan.discount ? (
                    <span className="badge bg-warning">{plan.discount}%</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(plan)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(plan)}
                  >
                    <IconifyIcon icon="bx:trash" />
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

export default SubscriptionPlansListView;