import { useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import BrandingListView from './BrandingListView';
import CreateBrandingModal from './CreateBrandingModal';

const BrandingList = ({ branding, refreshBranding, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedBranding(null);
    setShowModal(true);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setSelectedBranding(branding);
    setShowModal(true);
  };

  // Generate login URL using tenantSlug
  const getLoginUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${tenantSlug}/auth/sign-in`;
  };

  const handleCopyUrl = async () => {
    const url = getLoginUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Check if branding exists and has data
  const hasBranding = branding && 
    (branding.name || 
     (branding.addresses && branding.addresses.length > 0) || 
     (branding.phones && branding.phones.length > 0) ||
     branding.logo);

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h4 className="card-title mb-1">Branding Configuration</h4>
                  <p className="text-muted mb-0">
                    {hasBranding 
                      ? 'Manage your estate branding information' 
                      : 'Set up branding for your estate'
                    }
                  </p>
                </div>
                <div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={hasBranding ? handleEditClick : handleAddClick}
                  >
                    <IconifyIcon icon={hasBranding ? "bx:edit" : "bi:plus"} className="me-2" />
                    {hasBranding ? 'Edit Branding' : 'Create Branding'}
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Login URL Section - This will always show */}
      <Row className="mt-3">
        <Col xs={12}>
          <Card className="bg-light border">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <IconifyIcon icon="bx:link" className="text-primary" style={{ fontSize: '1.5rem' }} />
                  <div>
                    <h6 className="fw-bold mb-1">Estate Manager Login URL</h6>
                    <p className="text-muted mb-0 small">
                      Share this URL with Estate Manager, Landlord, Property Managers and Tenants to log in
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '500px' }}>
                  <code className="bg-white p-2 rounded border flex-grow-1 text-truncate">
                    {getLoginUrl()}
                  </code>
                  <button 
                    className="btn btn-outline-primary btn-sm position-relative"
                    onClick={handleCopyUrl}
                    title="Copy to clipboard"
                  >
                    <IconifyIcon icon={copySuccess ? "bx:check" : "bx:copy"} />
                    {copySuccess && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                        {copySuccess}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {hasBranding ? (
        <BrandingListView 
          branding={branding}
          onEditClick={handleEditClick}
          tenantSlug={tenantSlug}
        />
      ) : (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="border-dashed">
              <CardBody className="text-center py-5">
                <div className="mb-4">
                  <IconifyIcon 
                    icon="bx:image-alt" 
                    style={{ fontSize: '4rem' }} 
                    className="text-muted"
                  />
                </div>
                <h4 className="text-muted mb-3">No Branding Configured</h4>
                <p className="text-muted mb-4">
                  Get started by setting up your estate branding. <br />
                  Add your logo, contact information, and addresses.
                </p>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleAddClick}
                >
                  <IconifyIcon icon="bi:plus" className="me-2" />
                  Set Up Branding
                </button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      <CreateBrandingModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshBranding={refreshBranding}
        editMode={editMode}
        brandingToEdit={selectedBranding}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default BrandingList;