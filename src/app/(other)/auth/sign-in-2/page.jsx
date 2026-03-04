import { Card, CardBody, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import LogoBox from '@/components/LogoBox';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './components/LoginForm';

import { useAuthContext } from '@/context/useAuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn2 = () => {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // System admin or other roles (no tenantSlug)
      if (user.userType === 'estate_manager' && user.tenant) {
        navigate(`/${user.tenant}/dashboard`, { replace: true });
      } else if (user.userType === 'tenant' && user.tenant) {
        navigate(`/${user.tenant}/tenant-dashboard`, { replace: true });
      } else if (user.userType === 'landlord' && user.tenant) {
        navigate(`/${user.tenant}/dashboard`, { replace: true });
      } else {
        // fallback for system admin or unknown
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <>
      <PageMetaData title="Sign In" />

      <Col xl={5} className="mx-auto">
        <Card className="auth-card">
          <CardBody className="px-3 py-5">
            <h2 className="fw-bold text-center fs-18">Sign In</h2>
            <p className="text-muted text-center mt-1 mb-4">Enter your email address and password to access Dashboard.</p>
            <div className="px-4">
              <LoginForm />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>;
};
export default SignIn2;