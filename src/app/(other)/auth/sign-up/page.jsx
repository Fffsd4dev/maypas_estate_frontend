// import { Card, CardBody, Col, Row } from 'react-bootstrap';
// import { Link, useParams } from 'react-router-dom';
// import LogoBox from '@/components/LogoBox';
// import PageMetaData from '@/components/PageTitle';
// import ThirdPartyAuth from '@/components/ThirdPartyAuth';
// import SignUpForm from './components/SignUpForm';
// import signUpImg from '@/assets/images/sign-in.svg';

// const SignUp = () => {
//   const { tenantSlug } = useParams();
//   return <>
//       <PageMetaData title="Sign Up" />

//       <Card className="auth-card">
//         <CardBody className="p-0">
//           <Row className="align-items-center g-0">
//             <Col lg={6} className="d-none d-lg-inline-block border-end">
//               <div className="auth-page-sidebar">
//                 <img src={signUpImg} width={521} height={521} alt="auth" className="img-fluid" />
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="p-4">
//                 <LogoBox textLogo={{
//                 height: 24,
//                 width: 73
//               }} squareLogo={{
//                 className: 'me-1'
//               }} containerClassName="mx-auto mb-4 text-center auth-logo" />
//                 <h2 className="fw-bold text-center fs-18">Sign Up</h2>
//                 <p className="text-muted text-center mt-1 mb-4">New to our platform? Sign up now! It only takes a minute.</p>
//                 <Row className="justify-content-center">
//                   <Col xs={12} md={8}>
//                     <SignUpForm />
//                     {/* <ThirdPartyAuth /> */}
//                   </Col>
//                 </Row>
//               </div>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//       <p className="text-white mb-0 text-center">
//         I already have an account
//         <Link to={`/${tenantSlug}/auth/sign-in`}  className="text-white fw-bold ms-1">
//           Sign In
//         </Link>
//       </p>
//     </>;
// };
// export default SignUp;


import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import PageMetaData from '@/components/PageTitle';
import ThirdPartyAuth from '@/components/ThirdPartyAuth';
import SignUpForm from './components/SignUpForm';
import signUpImg from '@/assets/images/sign-in.svg';
import { useState, useEffect } from 'react';

const SignUp = () => {
  const { tenantSlug } = useParams();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranding = async () => {
      if (!tenantSlug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://trial.maypaspace.com/api/${tenantSlug}/get/brand/data`
        );
        
        if (response.ok) {
          const data = await response.json();
          setBranding(data.data || data);
          console.log('Fetched branding for signup:', data.data || data);
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, [tenantSlug]);

  // Get tenant name safely
  const tenantName = branding?.name || 'Tenant';
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
                              alt={tenantName}
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
                                  fallback.innerHTML = `
                                    <span class="fw-bold fs-5 text-dark">
                                      ${tenantName}
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
                              {tenantName}
                            </span>
                          </div>
                        )}
                      </a>
                      {tenantName && (
                        <p className="text-muted mt-2 mb-0 small">
                          Welcome to {tenantName}
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
        <Link to={`/${tenantSlug}/auth/sign-in`} className="text-white fw-bold ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;