import { Card, CardBody, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageMetaData from '@/components/PageTitle';
import ResetPassForm from './components/ResetPassForm';
const ResetPassword2 = () => {
  return <>
      <PageMetaData title="Reset Password 2" />

      <Col xl={5} className="mx-auto">
        <Card className="auth-card">
          <CardBody className="px-3 py-5">
            <h2 className="fw-bold text-center fs-18">Reset Password</h2>
            <p className="text-muted text-center mt-1 mb-4">
              Enter your email address and we&apos;ll send you an email with instructions to reset your password.
            </p>
            <div className="px-4">
              <ResetPassForm />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>;
};
export default ResetPassword2;