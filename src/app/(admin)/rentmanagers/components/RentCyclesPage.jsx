import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Alert, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import RentCyclesView from '../components/RentCyclesView';

const RentCyclesPage = () => {
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [rentAccount, setRentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get rent account from navigation state
  useEffect(() => {
    if (location.state?.rentAccount) {
      setRentAccount(location.state.rentAccount);
    } else {
      setError('No rent account data provided. Please go back and select a rent account.');
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(`/${tenantSlug}/rent-manager`);
  };

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-3">
          {error}
          <div className="mt-2">
            <Button variant="outline-primary" onClick={handleBack}>
              Back to Rent Accounts
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!rentAccount) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading rent account...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Rent Manager" 
        title="Rent Cycles"
      />
      <PageMetaData title="Rent Cycles" />
      
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-secondary" onClick={handleBack}>
            <IconifyIcon icon="bx:arrow-back" className="me-1" />
            Back to Rent Accounts
          </Button>
        </div>

        <RentCyclesView 
          rentAccount={rentAccount}
          estateSlug={tenantSlug}
          isPage={true}
        />
      </Container>
    </>
  );
};

export default RentCyclesPage;



