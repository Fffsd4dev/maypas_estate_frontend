import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { currentYear, developedBy, developedByLink } from '@/context/constants';
import IconifyIcon from '../wrappers/IconifyIcon';
import { Container } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';

const Footer = () => {
  const { tenantSlug } = useParams();
  const { user } = useAuthContext();
  const [copySuccessLogin, setCopySuccessLogin] = useState('');
  const [copySuccessSetPassword, setCopySuccessSetPassword] = useState('');

  const baseUrl = window.location.origin;
  const userType = user?.userType;

  const getLoginUrl = () => {
    if (userType === 'tenant') {
      return `${baseUrl}/${tenantSlug}/tenant-sign-in`;
    }
    return `${baseUrl}/${tenantSlug}/sign-in`;
  };

  const getLoginUrlLabel = () => {
    if (userType === 'tenant') return 'Tenant Login URL';
    if (userType === 'agent') return 'Property Manager Login URL';
    if (userType === 'admin') return 'Admin Login URL';
    return 'Estate Manager Login URL';
  };

  const getSetPasswordUrl = () => `${baseUrl}/${tenantSlug}/sms-set-password`;

  const handleCopyLoginUrl = async () => {
    try {
      await navigator.clipboard.writeText(getLoginUrl());
      setCopySuccessLogin('Copied!');
      setTimeout(() => setCopySuccessLogin(''), 2000);
    } catch {
      setCopySuccessLogin('Failed to copy');
      setTimeout(() => setCopySuccessLogin(''), 2000);
    }
  };

  const handleCopySetPasswordUrl = async () => {
    try {
      await navigator.clipboard.writeText(getSetPasswordUrl());
      setCopySuccessSetPassword('Copied!');
      setTimeout(() => setCopySuccessSetPassword(''), 2000);
    } catch {
      setCopySuccessSetPassword('Failed to copy');
      setTimeout(() => setCopySuccessSetPassword(''), 2000);
    }
  };

  const copyButtonStyle = (success) => ({
    background: success ? '#28a745' : 'white',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '2px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    transition: 'all 0.2s',
    color: success ? 'white' : '#495057',
    flexShrink: 0,
  });

  return (
    <footer className="footer">
      <style>{`
  .footer {
    height: auto !important;
    min-height: 60px;
  }
  .app-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .app-footer-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8f9fa;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    min-width: 0;
    flex: 1 1 auto;
    max-width: 32%;
  }
  .app-footer-pill--right {
    justify-content: flex-end;
  }
  .app-footer-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #495057;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .app-footer-code {
    font-size: 0.7rem;
    background: white;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #dee2e6;
    color: #495057;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: auto;
    min-width: 0;
  }
  .app-footer-copyright {
    flex: 0 0 auto;
    text-align: center;
    order: 2;
  }
  .app-footer-mobile-btn-text {
    display: none;
  }

  @media (max-width: 768px) {
    .footer {
      height: auto !important;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .app-footer-row {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
    .app-footer-pill {
      max-width: 100%;
      width: 100%;
      background: none;
      border: none;
      padding: 0;
    }
    .app-footer-label,
    .app-footer-code {
      display: none;
    }
    .app-footer-copy-btn {
      width: 100%;
      justify-content: center !important;
      padding: 10px 12px !important;
      font-size: 0.85rem !important;
      border-radius: 8px !important;
    }
    .app-footer-mobile-btn-text {
      display: inline;
    }
    .app-footer-copyright {
      order: -1;
      font-size: 0.8rem;
      text-align: center;
    }
  }
`}</style>

      <Container fluid>
        <div className="app-footer-row">
          {/* Copyright - shown first on mobile via order */}
          <div className="app-footer-copyright">
            <span className="icons-center">
              {currentYear} © Maypas Homes. All Rights Reserved.
            </span>
          </div>

          {/* Login URL */}
          <div className="app-footer-pill">
            <span className="app-footer-label">{getLoginUrlLabel()}</span>
            <code className="app-footer-code" title={getLoginUrl()}>
              {getLoginUrl()}
            </code>
            <button
              onClick={handleCopyLoginUrl}
              className="app-footer-copy-btn"
              style={copyButtonStyle(copySuccessLogin)}
              onMouseEnter={(e) => {
                if (!copySuccessLogin) {
                  e.currentTarget.style.background = '#eef1f4';
                  e.currentTarget.style.borderColor = '#0d6efd';
                }
              }}
              onMouseLeave={(e) => {
                if (!copySuccessLogin) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#dee2e6';
                }
              }}
              title="Copy to clipboard"
            >
              <IconifyIcon icon={copySuccessLogin ? 'bx:check' : 'bx:copy'} style={{ fontSize: '0.85rem' }} />
              <span className="app-footer-mobile-btn-text">
                {copySuccessLogin ? 'Copied!' : `Copy ${getLoginUrlLabel()} URL`}
              </span>
            </button>
          </div>

          {/* Set Password URL */}
          <div className="app-footer-pill app-footer-pill--right">
            <span className="app-footer-label">Set Password URL</span>
            <code className="app-footer-code" title={getSetPasswordUrl()}>
              {getSetPasswordUrl()}
            </code>
            <button
              onClick={handleCopySetPasswordUrl}
              className="app-footer-copy-btn"
              style={copyButtonStyle(copySuccessSetPassword)}
              onMouseEnter={(e) => {
                if (!copySuccessSetPassword) {
                  e.currentTarget.style.background = '#eef1f4';
                  e.currentTarget.style.borderColor = '#0d6efd';
                }
              }}
              onMouseLeave={(e) => {
                if (!copySuccessSetPassword) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#dee2e6';
                }
              }}
              title="Copy to clipboard"
            >
              <IconifyIcon icon={copySuccessSetPassword ? 'bx:check' : 'bx:copy'} style={{ fontSize: '0.85rem' }} />
              <span className="app-footer-mobile-btn-text">
                {copySuccessSetPassword ? 'Copied!' : 'Copy Set Password URL'}
              </span>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;