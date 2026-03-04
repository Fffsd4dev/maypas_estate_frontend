import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import LogoBox from '@/components/LogoBox';
import PageMetaData from '@/components/PageTitle';
import ForgotPasswordStep1 from './components/ForgotPasswordStep1';
import ForgotPasswordStep2 from './components/ForgotPasswordStep2';
import signInImg from '@/assets/images/sign-in.png';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const { tenantSlug } = useParams();

  const handleStep1Success = (email) => {
    setUserEmail(email);
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setUserEmail('');
  };

  return (
    <>
      <PageMetaData title="Forgot Password" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <img src={signInImg} width={521} height={521} alt="auth" className="img-fluid" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="p-4">
                <LogoBox 
                  textLogo={{ height: 24, width: 73 }} 
                  squareLogo={{ className: 'me-1' }} 
                  containerClassName="mx-auto mb-4 text-center auth-logo" 
                />
                
                {currentStep === 1 ? (
                  <>
                    <h2 className="fw-bold text-center fs-18">Forgot Password</h2>
                    <p className="text-muted text-center mt-1 mb-4">
                      Enter your email address and we'll send you a verification code to reset your password.
                    </p>
                    <Row className="justify-content-center">
                      <Col xs={12} md={8}>
                        <ForgotPasswordStep1 onSuccess={handleStep1Success} />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <h2 className="fw-bold text-center fs-18">Reset Password</h2>
                    <p className="text-muted text-center mt-1 mb-4">
                      Enter the verification code sent to your email and set your new password.
                    </p>
                    <Row className="justify-content-center">
                      <Col xs={12} md={8}>
                        <ForgotPasswordStep2 
                          userEmail={userEmail}
                          onBack={handleBackToStep1}
                        />
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      
      <p className="text-white mb-0 text-center">
        Back to
        <Link to={`/${tenantSlug}/auth/sign-in`} className="text-white fw-bold ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;