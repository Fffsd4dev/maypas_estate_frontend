import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './LoginForm';
import signInImg from '@/assets/images/sign-in.png';
import { useState, useEffect } from 'react';


import { useAuthContext } from '@/context/useAuthContext';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

const SignIn2 = () => {
  const { tenantSlug } = useParams();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      // Replace login page in history so back won't return here
      navigate(-1); // Try to go back first
      setTimeout(() => {
        if (window.location.pathname.includes('sign-in')) {
          navigate('/', { replace: true }); // Replace login page with home (or dashboard)
        }
      }, 100);
      return;
    }

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
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, [tenantSlug, isAuthenticated, navigate]);

  return (
    <>
      <PageMetaData title="Sign In" />
      
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
                <div className="mx-auto mb-4 text-center auth-logo">
                  {loading ? (
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="logo-box">
                      <a href="/">
                        {branding?.logo ? (
                          <img
                            src={branding.logo}
                            alt={branding.name || 'Tenant'}
                            style={{ 
                              maxHeight: '40px',
                              height: 'auto',
                              width: 'auto',
                              maxWidth: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        ) : (
                          <span style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#333'
                          }}>
                            {branding?.name || 'Tenant'}
                          </span>
                        )}
                      </a>
                    </div>
                  )}
                </div>
                <h2 className="fw-bold text-center fs-18">Sign In</h2>
                <p className="text-muted text-center mt-1 mb-4">Enter your email address and password to access Dashboard.</p>
                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <LoginForm />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <p className="text-white mb-0 text-center mt-3">
        New here?
        <Link 
          to={`/auth/sign-up`} 
          className="text-white fw-bold ms-1"
        >
          Sign Up as a Landlord
        </Link> or 
        <Link 
          to={`/${tenantSlug}/auth/sign-up`} 
          className="text-white fw-bold ms-1"
        >
          Sign Up as a Tenant
        </Link>
      </p>
    </>
  );
};

export default SignIn2;