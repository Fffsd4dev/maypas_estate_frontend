import { Card, CardBody, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import LogoBox from '@/components/LogoBox';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './components/LoginForm';
const SignIn2 = () => {
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