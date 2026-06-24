import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageMetaData from '@/components/PageTitle';
import ResetPassForm from './components/ResetPassForm';
import signInImg from '@/assets/images/sign-in.png';
import useBranding from '@/hooks/useBranding';

const ResetPassword = () => {
  const { tenantSlug } = useParams();
  const { branding, loading, estateManagerName } = useBranding(tenantSlug);

  const formatTenantName = (slug) => {
    if (!slug) return 'Estate Manager';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const displayName = estateManagerName || branding?.name || formatTenantName(tenantSlug);
  const logoUrl = branding?.logo;

  return (
    <>
      <PageMetaData title="Reset Password" />

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

                {/* ── Logo (mirrors SignIn2 exactly) ── */}
                <div className="mx-auto mb-4 text-center auth-logo">
                  {loading ? (
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="logo-box">
                      <a href="/" className="text-decoration-none">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={displayName}
                            style={{
                              maxHeight: '40px',
                              height: 'auto',
                              width: 'auto',
                              maxWidth: '100%',
                              objectFit: 'contain',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('span');
                                fallback.style.cssText = `
                                  font-size: 20px;
                                  font-weight: 600;
                                  color: #333;
                                  white-space: nowrap;
                                `;
                                fallback.textContent = displayName;
                                parent.innerHTML = '';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '20px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap' }}>
                            {displayName}
                          </span>
                        )}
                      </a>
                    </div>
                  )}
                </div>

                <h2 className="fw-bold text-center fs-18">Reset Password</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  Enter your email address and we'll send you a verification code.
                </p>

                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <ResetPassForm />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <p className="text-white mb-0 text-center mt-3">
        Back to{' '}
        <Link to={`/${tenantSlug}/sign-in`} className="text-white fw-bold ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default ResetPassword;