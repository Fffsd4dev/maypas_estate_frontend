import { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ChangeInvoiceStatusModal = ({
  show,
  handleClose,
  invoice,
  refreshInvoices,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(false);
    }
  }, [show, invoice]);

  const getCustomerName = (inv) => {
    return `${inv?.first_name || ''} ${inv?.last_name || ''}`.trim() || 'this invoice';
  };

  const handleCancelInvoice = async () => {
    setError(null);
    setSuccess(false);

    const invoiceUuid = invoice?.invoice_uuid || invoice?.uuid;
    if (!invoiceUuid) {
      setError('Invoice UUID not found');
      return;
    }

    if (!user?.token) {
      setError('Authentication required');
      return;
    }

    if (!tenantSlug) {
      setError('Tenant slug not found');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/invoice/update/single/${invoiceUuid}`,
        { status: 'cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      refreshInvoices();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1200);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to cancel invoice';
      setError(errorMessage);
      console.error('Error cancelling invoice:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="bx:x-circle" className="me-2" />
          Cancel Invoice
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            <IconifyIcon icon="bx:error" className="me-2" />
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <IconifyIcon icon="bx:check-circle" className="me-2" />
            Invoice cancelled successfully!
          </Alert>
        )}

        {!success && invoice && (
          <p className="mb-0">
            Are you sure you want to cancel the invoice for{' '}
            <strong>{getCustomerName(invoice)}</strong>
            {invoice.apartment_unit_name && (
              <> ({invoice.apartment_unit_name})</>
            )}
            ? This action cannot be undone.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        {!success && (
          <Button variant="danger" onClick={handleCancelInvoice} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:x-circle" className="me-2" />
                Cancel Invoice
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeInvoiceStatusModal;