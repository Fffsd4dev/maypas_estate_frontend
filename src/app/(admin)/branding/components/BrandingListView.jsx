// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { Card, Badge } from 'react-bootstrap';

// const BrandingListView = ({ branding, onEditClick }) => {
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <Card className="overflow-hidden mt-3">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-start mb-4">
//           <div>
//             <h4 className="card-title">{branding.name}</h4>
//             <p className="text-muted mb-0">Estate Branding Configuration</p>
//           </div>
//           <button 
//             className="btn btn-light"
//             onClick={onEditClick}
//           >
//             <IconifyIcon icon="bx:edit" className="me-1" />
//             Edit
//           </button>
//         </div>

//         <div className="row">
//           {/* Logo Preview */}
//           <div className="col-md-6 mb-3">
//             <h6>Logo</h6>
//             {branding.logo ? (
//               <div className="mt-2">
//                 <img 
//                   src={`${import.meta.env.VITE_BACKEND_URL}/${branding.logo}`} 
//                   alt="Estate Logo" 
//                   style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
//                   className="border rounded p-2"
//                 />
//                 <div className="mt-1">
//                   <small className="text-muted">{branding.logo}</small>
//                 </div>
//               </div>
//             ) : (
//               <Badge bg="secondary">No logo uploaded</Badge>
//             )}
//           </div>

//           {/* Basic Info */}
//           <div className="col-md-6 mb-3">
//             <h6>Basic Information</h6>
//             <div className="mt-2">
//               <p className="mb-1"><strong>Estate Manager ID:</strong> {branding.estate_manager_id}</p>
//               <p className="mb-1"><strong>Created:</strong> {formatDate(branding.created_at)}</p>
//               <p className="mb-0"><strong>Last Updated:</strong> {formatDate(branding.updated_at)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Addresses */}
//         <div className="row">
//           <div className="col-12 mb-3">
//             <h6>Addresses ({branding.addresses.length})</h6>
//             <div className="mt-2">
//               {branding.addresses && branding.addresses.length > 0 ? (
//                 branding.addresses.map((address, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:map" className="text-muted me-2" />
//                     <span>{address}</span>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No addresses configured</Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <h6>Phone Numbers ({branding.phones.length})</h6>
//             <div className="mt-2">
//               {branding.phones && branding.phones.length > 0 ? (
//                 branding.phones.map((phone, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:phone" className="text-muted me-2" />
//                     <span>{phone}</span>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No phone numbers</Badge>
//               )}
//             </div>
//           </div>

//           <div className="col-md-6 mb-3">
//             <h6>Social Links ({branding.social_links.length})</h6>
//             <div className="mt-2">
//               {branding.social_links && branding.social_links.length > 0 ? (
//                 branding.social_links.map((link, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:link" className="text-muted me-2" />
//                     <a href={link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
//                       {link}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No social links</Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default BrandingListView;




// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { Card, Badge } from 'react-bootstrap';

// const BrandingListView = ({ branding, onEditClick }) => {
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <Card className="overflow-hidden mt-3">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-start mb-4">
//           <div>
//             <h4 className="card-title">{branding.name}</h4>
//             <p className="text-muted mb-0">Estate Branding Configuration</p>
//           </div>
//           <button 
//             className="btn btn-light"
//             onClick={onEditClick}
//           >
//             <IconifyIcon icon="bx:edit" className="me-1" />
//             Edit
//           </button>
//         </div>

//         <div className="row">
//           {/* Logo Preview */}
//           <div className="col-md-6 mb-3">
//             <h6>Logo</h6>
//             {branding.logo ? (
//               <div className="mt-2">
//                 <img 
//                   src={`${branding.logo}`} 
//                   alt="Estate Logo" 
//                   style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
//                   className="border rounded p-2 bg-light"
//                 />
//                 <div className="mt-1">
//                   <small className="text-muted">Uploaded logo</small>
//                 </div>
//               </div>
//             ) : (
//               <Badge bg="secondary">No logo uploaded</Badge>
//             )}
//           </div>

//           {/* Basic Info */}
//           <div className="col-md-6 mb-3">
//             <h6>Basic Information</h6>
//             <div className="mt-2">
//               <p className="mb-1"><strong>Estate Manager ID:</strong> {branding.estate_manager_id}</p>
//               <p className="mb-1"><strong>Created:</strong> {formatDate(branding.created_at)}</p>
//               <p className="mb-0"><strong>Last Updated:</strong> {formatDate(branding.updated_at)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Addresses */}
//         <div className="row">
//           <div className="col-12 mb-3">
//             <h6>Addresses ({branding.addresses.length})</h6>
//             <div className="mt-2">
//               {branding.addresses && branding.addresses.length > 0 ? (
//                 branding.addresses.map((address, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:map" className="text-muted me-2" />
//                     <span>{address}</span>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No addresses configured</Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <h6>Phone Numbers ({branding.phones.length})</h6>
//             <div className="mt-2">
//               {branding.phones && branding.phones.length > 0 ? (
//                 branding.phones.map((phone, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:phone" className="text-muted me-2" />
//                     <span>{phone}</span>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No phone numbers</Badge>
//               )}
//             </div>
//           </div>

//           <div className="col-md-6 mb-3">
//             <h6>Social Links ({branding.social_links.length})</h6>
//             <div className="mt-2">
//               {branding.social_links && branding.social_links.length > 0 ? (
//                 branding.social_links.map((link, index) => (
//                   <div key={index} className="d-flex align-items-center mb-1">
//                     <IconifyIcon icon="bx:link" className="text-muted me-2" />
//                     <a href={link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
//                       {link}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <Badge bg="secondary">No social links</Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default BrandingListView;


import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge, Row, Col } from 'react-bootstrap';

const BrandingListView = ({ branding, onEditClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Safe array access
  const addresses = branding?.addresses || [];
  const phones = branding?.phones || [];
  const socialLinks = branding?.social_links || [];

  return (
    <Card className="overflow-hidden mt-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="card-title">{branding?.name || 'Unnamed Estate'}</h4>
            <p className="text-muted mb-0">Estate Branding Configuration</p>
          </div>
          <button 
            className="btn btn-outline-primary"
            onClick={onEditClick}
          >
            <IconifyIcon icon="bx:edit" className="me-1" />
            Edit Branding
          </button>
        </div>

        <Row>
          {/* Logo Preview */}
          <Col md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Logo</h6>
            {branding?.logo ? (
              <div className="mt-2">
                <img 
                  src={`${branding.logo}`} 
                  alt="Estate Logo" 
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                  className="border rounded p-2 bg-light"
                />
                <div className="mt-2">
                  <small className="text-muted">Current logo</small>
                </div>
              </div>
            ) : (
              <div className="text-muted">
                <IconifyIcon icon="bx:image" className="me-2" />
                No logo uploaded
              </div>
            )}
          </Col>

          {/* Basic Info */}
          <Col md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Basic Information</h6>
            <div className="mt-2">
              <p className="mb-2">
                <strong>Estate Name:</strong> {branding?.name || 'Not set'}
              </p>
              <p className="mb-2">
                <strong>Estate Manager ID:</strong> {branding?.estate_manager_id || 'Not available'}
              </p>
              <p className="mb-2">
                <strong>Created:</strong> {formatDate(branding?.created_at)}
              </p>
              <p className="mb-0">
                <strong>Last Updated:</strong> {formatDate(branding?.updated_at)}
              </p>
            </div>
          </Col>
        </Row>

        {/* Addresses */}
        <Row>
          <Col xs={12} className="mb-4">
            <h6 className="fw-bold mb-3">
              Addresses 
              <Badge bg="secondary" className="ms-2">{addresses.length}</Badge>
            </h6>
            <div className="mt-2">
              {addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded">
                    <IconifyIcon icon="bx:map" className="text-primary me-2" />
                    <span>{address}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted">
                  <IconifyIcon icon="bx:map" className="me-2" />
                  No addresses configured
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Contact Information */}
        <Row>
          <Col md={6} className="mb-3">
            <h6 className="fw-bold mb-3">
              Phone Numbers
              <Badge bg="secondary" className="ms-2">{phones.length}</Badge>
            </h6>
            <div className="mt-2">
              {phones.length > 0 ? (
                phones.map((phone, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded">
                    <IconifyIcon icon="bx:phone" className="text-primary me-2" />
                    <span>{phone}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted">
                  <IconifyIcon icon="bx:phone" className="me-2" />
                  No phone numbers
                </div>
              )}
            </div>
          </Col>

          <Col md={6} className="mb-3">
            <h6 className="fw-bold mb-3">
              Social Links
              <Badge bg="secondary" className="ms-2">{socialLinks.length}</Badge>
            </h6>
            <div className="mt-2">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded">
                    <IconifyIcon icon="bx:link" className="text-primary me-2" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-decoration-none text-truncate"
                      style={{ maxWidth: '200px' }}
                    >
                      {link}
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-muted">
                  <IconifyIcon icon="bx:link" className="me-2" />
                  No social links
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BrandingListView;