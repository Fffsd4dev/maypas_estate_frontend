import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';
import { currency } from '@/context/constants';

const InvoicesListView = ({ invoices, onEditClick, onViewClick }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': 
      case 'completed': 
        return 'success';
      case 'pending': 
        return 'warning';
      case 'overdue': 
        return 'danger';
      case 'cancelled': 
        return 'secondary';
      default: 
        return 'primary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCustomerName = (invoice) => {
    return `${invoice.first_name || ''} ${invoice.last_name || ''}`.trim() || 'N/A';
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              {/* <th>Invoice UUID</th> */}
              <th>Customer</th>
              <th>Email</th>
              <th>Apartment Unit</th>
              <th>Apartment</th>
              <th>Amount</th>
              <th>Status</th>
              {/* <th>Created Date</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.invoice_uuid} className="invoice-row">
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                {/* <td>
                  <small className="text-muted font-monospace">
                    {invoice.invoice_uuid ? invoice.invoice_uuid.substring(0, 8) + '...' : 'N/A'}
                  </small>
                </td> */}
                <td>
                  <div>
                    <h6 className="mb-0">{getCustomerName(invoice)}</h6>
                  </div>
                </td>
                <td>
                  <span className="text-muted">{invoice.user_email || 'N/A'}</span>
                </td>
                <td>
                  <span className="fw-semibold">{invoice.apartment_unit_name || 'N/A'}</span>
                </td>
                <td>
                  <div>
                    <span className="fw-semibold">{invoice.apartment_name || 'N/A'}</span>
                    {/* <br />
                    <small className="text-muted">{invoice.apartment_location || ''}</small> */}
                  </div>
                </td>
                <td>
                  <span className="fw-semibold">{currency}{parseFloat(invoice.invoice_amount || 0).toFixed(2)}</span>
                </td>
                <td>
                  <Badge bg={getStatusVariant(invoice.invoice_status)}>
                    {invoice.invoice_status?.toUpperCase() || 'N/A'}
                  </Badge>
                </td>
                {/* <td>
                  <span className="text-muted" title={formatDateTime(invoice.invoice_created_at)}>
                    {formatDate(invoice.invoice_created_at)}
                  </span>
                </td> */}
                <td>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-sm btn-light"
                      onClick={() => onViewClick(invoice)}
                      title="View Invoice"
                    >
                      <IconifyIcon icon="bx:show" />
                    </button>
                    <button 
                      className="btn btn-sm btn-light"
                      onClick={() => onEditClick(invoice)}
                      title="Edit Invoice"
                    >
                      <IconifyIcon icon="bx:edit" />
                    </button>
                    {/* <button 
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => onDeleteClick(invoice)}
                      title="Delete Invoice"
                    >
                      <IconifyIcon icon="bx:trash" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default InvoicesListView;