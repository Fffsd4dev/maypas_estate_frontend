import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import PageMetaData from '@/components/PageTitle';
import ThirdPartyAuth from '@/components/ThirdPartyAuth';
import SignUpForm from './components/SignUpForm';
import signUpImg from '@/assets/images/sign-in.png';
import useBranding from '@/hooks/useBranding';

const SignUp = () => {
  const { tenantSlug } = useParams();
  const { branding, loading, estateManagerName } = useBranding(tenantSlug);

  const formatTenantName = (slug) => {
    if (!slug) return 'Estate Manager';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get tenant name using fallback priority
  const displayName = estateManagerName || branding?.name || formatTenantName(tenantSlug);
  const logoUrl = branding?.logo;

  return (
    <>
      <PageMetaData title="Sign Up" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <img src={signUpImg} width={521} height={521} alt="auth" className="img-fluid" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="p-4">
                <div className="mx-auto mb-4 text-center auth-logo">
                  {loading ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '50px' }}>
                      <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-center">
                      <a href="/" className="text-decoration-none">
                        {logoUrl ? (
                          <div className="position-relative">
                            <img
                              src={logoUrl}
                              alt={displayName}
                              className="img-fluid"
                              style={{ 
                                maxHeight: '50px',
                                height: 'auto',
                                width: 'auto',
                                maxWidth: '200px'
                              }}
                              onError={(e) => {
                                // Hide the broken image and show text fallback
                                e.target.style.display = 'none';
                                const container = e.target.parentElement;
                                if (container) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'd-flex align-items-center justify-content-center';
                                  fallback.style.height = '50px';
                                  fallback.style.whiteSpace = 'nowrap';
                                  fallback.innerHTML = `
                                    <span class="fw-bold fs-5 text-dark">
                                      ${displayName}
                                    </span>
                                  `;
                                  container.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-center" style={{ height: '50px' }}>
                            <span className="fw-bold fs-5 text-dark">
                              {displayName}
                            </span>
                          </div>
                        )}
                      </a>
                      {displayName && (
                        <p className="text-muted mt-2 mb-0 small">
                          Welcome to {displayName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <h2 className="fw-bold text-center fs-18">Sign Up</h2>
                <p className="text-muted text-center mt-1 mb-4">New to our platform? Sign up now! It only takes a minute.</p>
                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <SignUpForm />
                    {/* <ThirdPartyAuth /> */}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <p className="text-white mb-0 text-center mt-3">
        I already have an account
        <Link to={`/${tenantSlug}/tenant-sign-in`} className="text-white fw-bold ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;