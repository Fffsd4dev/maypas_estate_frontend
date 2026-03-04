import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const ChargesListView = ({ charges, onEditClick, onDeleteClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatValue = (charge) => {
    if (charge.fee_type === 'percentage') {
      return `${charge.value}%`;
    }
    return `$${parseFloat(charge.value).toFixed(2)}`;
  };

  const formatChargeType = (type) => {
    const typeMap = {
      'rent': 'Rent',
      'maintenance': 'Maintenance',
      'utility': 'Utility',
      'service': 'Service',
      'penalty': 'Penalty',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  const formatFeeType = (type) => {
    const typeMap = {
      'fixed': 'Fixed Amount',
      'percentage': 'Percentage',
      'variable': 'Variable'
    };
    return typeMap[type] || type;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Charge Type</th>
              <th>Fee Type</th>
              <th>Value</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge, index) => (
              <tr key={charge.id || charge.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{charge.name || 'N/A'}</span>
                </td>
                <td>
                  <span className="text-muted">{formatChargeType(charge.charge_type)}</span>
                </td>
                <td>
                  <span className="text-muted">{formatFeeType(charge.fee_type)}</span>
                </td>
                <td>
                  <span className="fw-semibold">{formatValue(charge)}</span>
                </td>
                <td>
                  <span className="text-muted">{formatDate(charge.created_at)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(charge)}
                    title="Edit Charge"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(charge)}
                    title="Delete Charge"
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

export default ChargesListView;