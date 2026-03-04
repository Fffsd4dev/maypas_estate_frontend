// import { useState } from 'react';
// import { Card, CardBody, Col, Row } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import BrandingListView from './BrandingListView';
// import CreateBrandingModal from './CreateBrandingModal';

// const BrandingList = ({ branding, refreshBranding, tenantSlug }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedBranding, setSelectedBranding] = useState(null);

//   const handleAddClick = () => {
//     setEditMode(false);
//     setSelectedBranding(null);
//     setShowModal(true);
//   };

//   const handleEditClick = () => {
//     setEditMode(true);
//     setSelectedBranding(branding);
//     setShowModal(true);
//   };

//   // Since branding is a single object, not an array
//   const hasBranding = branding && Object.keys(branding).length > 0;

//   return (
//     <>
//       <Row>
//         <Col xs={12}>
//           <Card>
//             <CardBody>
//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
//                 <div>
//                   <h5 className="card-title mb-0">
//                     {hasBranding ? 'Current Branding' : 'No Branding Configured'}
//                   </h5>
//                 </div>
//                 <div>
//                   <button 
//                     className="btn btn-primary"
//                     onClick={hasBranding ? handleEditClick : handleAddClick}
//                   >
//                     <IconifyIcon icon={hasBranding ? "bx:edit" : "bi:plus"} className="me-1" />
//                     {hasBranding ? 'Edit Branding' : 'Add Branding'}
//                   </button>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {hasBranding ? (
//         <BrandingListView 
//           branding={branding}
//           onEditClick={handleEditClick}
//         />
//       ) : (
//         <div className="alert alert-info mt-3">
//           No branding configuration found. Click "Add Branding" to set up your estate branding.
//         </div>
//       )}

//       <CreateBrandingModal 
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         refreshBranding={refreshBranding}
//         editMode={editMode}
//         brandingToEdit={selectedBranding}
//         tenantSlug={tenantSlug}
//       />
//     </>
//   );
// };

// export default BrandingList;


import { useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import BrandingListView from './BrandingListView';
import CreateBrandingModal from './CreateBrandingModal';

const BrandingList = ({ branding, refreshBranding, tenantSlug }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState(null);

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

      {hasBranding ? (
        <BrandingListView 
          branding={branding}
          onEditClick={handleEditClick}
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