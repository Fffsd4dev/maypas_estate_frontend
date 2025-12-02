
import { Card, CardBody, Row, Col, Badge, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import logoDark from '@/assets/images/logo-dark.png';

const InvoiceDetailView = ({ invoice }) => {
  if (!invoice) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  // Calculate totals from payment_infos
  const subtotal = invoice.payment_infos?.reduce((sum, payment) => sum + parseFloat(payment.payment_fee || 0), 0) || 0;
  const tax = 0; // Assuming no tax for now
  const total = subtotal + tax;

  return (
    <>
      {/* Add print styles */}
      <style>
        {`
          @media print {
            .d-print-none {
              display: none !important;
            }
            .card {
              border: none !important;
              box-shadow: none !important;
            }
            .table {
              border-collapse: collapse;
            }
            .table th,
            .table td {
              border: 1px solid #dee2e6;
            }
            body {
              background: white !important;
            }
            .container-fluid,
            .container {
              max-width: 100% !important;
              width: 100% !important;
            }
          }
        `}
      </style>

      <Card className="print-container">
        <CardBody>
          <div className="clearfix">
            <div className="float-sm-end">
              <div className="auth-logo">
                <img className="logo-dark me-1" src={logoDark} alt="logo-dark" height={24} />
              </div>
              <address className="mt-3">
                1729 Bangor St,
                <br />
                Houlton, ME, 04730 <br />
                <abbr title="Phone">P:</abbr> (207) 532-9109
              </address>
            </div>
            <div className="float-sm-start">
              <h5 className="mb-2">
                Invoice ID: 
                <small className="text-muted font-monospace ms-2">
                  {invoice.uuid || 'N/A'}
                </small>
              </h5>
              <Badge bg={getStatusVariant(invoice.status)} className="fs-6">
                {invoice.status?.toUpperCase() || 'N/A'}
              </Badge>
            </div>
          </div>
          
          <Row className="mt-4">
            <Col md={6}>
              <h6 className="fw-normal text-muted">Customer Information</h6>
              <h6 className="fs-16">
                {invoice.user?.first_name || ''} {invoice.user?.last_name || ''}
              </h6>
              <address>
                <strong>Email:</strong> {invoice.user?.email || 'N/A'}<br />
                <strong>Apartment:</strong> {invoice.apartment_unit?.apartment?.name || 'N/A'}<br />
                <strong>Unit:</strong> {invoice.apartment_unit?.apartment_unit_name || 'N/A'}<br />
                <strong>Location:</strong> {invoice.apartment_unit?.apartment?.location || 'N/A'}
              </address>
            </Col>
            <Col md={6}>
              <div className="text-md-end">
                <p><strong>Total Amount:</strong> {currency}{parseFloat(invoice.amount || 0).toFixed(2)}</p>
                <p><strong>Status:</strong> 
                  <Badge bg={getStatusVariant(invoice.status)} className="ms-2">
                    {invoice.status?.toUpperCase() || 'N/A'}
                  </Badge>
                </p>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col xs={12}>
              <div className="table-responsive table-borderless text-nowrap mt-3 table-centered">
                <table className="table mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Description</th>
                      <th className="border-0 py-2">Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.payment_infos?.map((payment, index) => (
                      <tr key={index}>
                        <td>
                          {payment.payment_name ? payment.payment_name.charAt(0).toUpperCase() + payment.payment_name.slice(1) : 'Payment'} 
                          - {invoice.apartment_unit?.apartment_unit_name} 
                          ({invoice.apartment_unit?.apartment?.name})
                        </td>
                        <td>{currency}{parseFloat(payment.payment_fee || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!invoice.payment_infos || invoice.payment_infos.length === 0) && (
                      <tr>
                        <td>Rental Charge for {invoice.apartment_unit?.apartment_unit_name} - {invoice.apartment_unit?.apartment?.name}</td>
                        <td>{currency}{parseFloat(invoice.amount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col sm={7}>
              <div className="clearfix pt-xl-3 pt-0">
                <h6 className="text-muted">Notes:</h6>
                <small className="text-muted">
                  This invoice is for rental charges. All accounts are to be paid within 7 days from receipt of invoice. 
                  To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days, 
                  late fees may be applied as per the rental agreement.
                </small>
              </div>
            </Col>
            <Col sm={5}>
              <div className="float-end">
                <p>
                  <span className="fw-medium">Sub-total:</span>
                  <span className="float-end">{currency}{subtotal.toFixed(2)}</span>
                </p>
                <p>
                  <span className="fw-medium">Tax:</span>
                  <span className="float-end">
                    {currency}{tax.toFixed(2)}
                  </span>
                </p>
                <h3>{currency}{total.toFixed(2)}</h3>
              </div>
              <div className="clearfix" />
            </Col>
          </Row>
          
          <div className="mt-5 mb-1 d-print-none">
            <div className="text-end">
              <Button variant="primary" onClick={() => window.print()} className="me-1">
                <IconifyIcon icon="bx:printer" className="me-1" />
                Print
              </Button>
              <Button variant="outline-primary">
                <IconifyIcon icon="bx:send" className="me-1" />
                Send Invoice
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default InvoiceDetailView;