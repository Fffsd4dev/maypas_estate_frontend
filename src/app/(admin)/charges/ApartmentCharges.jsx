// // import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// // import PageMetaData from '@/components/PageTitle';
// // import ChargesList from './components/ChargesList';
// // import { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Button, Spinner, Alert, Card } from 'react-bootstrap';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // const ApartmentCharges = () => {
// //   const [charges, setCharges] = useState([]);
// //   const [apartmentUnit, setApartmentUnit] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const { user } = useAuthContext();
// //   const { tenantSlug, apartmentUnitUuid } = useParams();
// //   const navigate = useNavigate();

// //   // Fetch apartment unit details and charges
// //   const fetchApartmentUnitAndCharges = async () => {
// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug || !apartmentUnitUuid) {
// //         throw new Error('Required parameters missing');
// //       }

// //       setLoading(true);

// //       // Fetch all apartments to find the specific unit
// //       const apartmentsResponse = await axios.get(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       // Find the specific apartment unit from the nested structure
// //       let foundUnit = null;
// //       let foundApartment = null;
// //       let foundCategory = null;

// //       apartmentsResponse.data.forEach(category => {
// //         category.apartments.forEach(apartment => {
// //           const unit = apartment.apartment_units.find(
// //             unit => unit.apartment_unit_uuid === apartmentUnitUuid
// //           );
// //           if (unit) {
// //             foundUnit = {
// //               ...unit,
// //               apartment_name: apartment.name,
// //               category_name: category.name,
// //               full_address: apartment.address,
// //               location: apartment.location
// //             };
// //             foundApartment = apartment;
// //             foundCategory = category;
// //           }
// //         });
// //       });

// //       if (!foundUnit) {
// //         throw new Error('Apartment unit not found');
// //       }

// //       setApartmentUnit(foundUnit);

// //       // Fetch charges for the specific apartment unit
// //       try {
// //         const chargesResponse = await axios.get(
// //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnitUuid}`,
// //           {
// //             headers: {
// //               'Authorization': `Bearer ${user.token}`,
// //               'Content-Type': 'application/json'
// //             }
// //           }
// //         );

// //         console.log('Fetched charges data:', chargesResponse.data);

// //         if (chargesResponse.data) {
// //           setCharges(chargesResponse.data || []);
// //         }
// //       } catch (chargesError) {
// //         // If charges endpoint returns 404 or error, set empty array
// //         console.log('No charges found for this unit:', chargesError.message);
// //         setCharges([]);
// //       }
      
// //       setLoading(false);
// //     } catch (err) {
// //       setError(err.response?.data?.message || err.message || 'Failed to fetch apartment charges');
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (tenantSlug && apartmentUnitUuid) {
// //       fetchApartmentUnitAndCharges();
// //     }
// //   }, [user, tenantSlug, apartmentUnitUuid]);

// //   const refreshCharges = () => {
// //     fetchApartmentUnitAndCharges();
// //   };

// //   const handleBackClick = () => {
// //     navigate(`/${tenantSlug}/charges`);
// //   };

// //   if (loading) return <div className="text-center py-4"><Spinner animation="border" /> Loading charges...</div>;
// //   if (error) return <div className="alert alert-danger">{error}</div>;

// //   return (
// //     <>
// //       <PageBreadcrumb 
// //         subName="Account" 
// //         title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} 
// //       />
// //       <PageMetaData title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} />
      
// //       <div className="d-flex align-items-center mb-3">
// //         <Button variant="light" onClick={handleBackClick} className="me-3">
// //           <IconifyIcon icon="bx:arrow-back" className="me-1" />
// //           Back to Apartments
// //         </Button>
// //         <div>
// //           <h4 className="mb-0">{apartmentUnit?.apartment_unit_name}</h4>
// //           <p className="text-muted mb-0 small">
// //             {apartmentUnit?.apartment_name} • {apartmentUnit?.category_name}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Apartment Unit Details Card */}
// //       {apartmentUnit && (
// //         <Card className="mb-4">
// //           <Card.Body>
// //             <Row>
// //               <Col md={6}>
// //                 <div className="mb-2">
// //                   <strong>Unit Name:</strong> {apartmentUnit.apartment_unit_name}
// //                 </div>
// //                 <div className="mb-2">
// //                   <strong>Apartment:</strong> {apartmentUnit.apartment_name}
// //                 </div>
// //                 <div className="mb-2">
// //                   <strong>Category:</strong> {apartmentUnit.category_name}
// //                 </div>
// //               </Col>
// //               <Col md={6}>
// //                 {apartmentUnit.full_address && (
// //                   <div className="mb-2">
// //                     <strong>Address:</strong> {apartmentUnit.full_address}
// //                   </div>
// //                 )}
// //                 {apartmentUnit.location && (
// //                   <div className="mb-2">
// //                     <strong>Location:</strong> {apartmentUnit.location}
// //                   </div>
// //                 )}
// //                 <div className="mb-2">
// //                   <strong>Unit ID:</strong> 
// //                   <code className="ms-1 small">{apartmentUnit.apartment_unit_uuid}</code>
// //                 </div>
// //               </Col>
// //             </Row>
// //           </Card.Body>
// //         </Card>
// //       )}
      
// //       <ChargesList 
// //         charges={charges}
// //         apartmentUnit={apartmentUnit}
// //         refreshCharges={refreshCharges}
// //         tenantSlug={tenantSlug}
// //       />
// //     </>
// //   );
// // };

// // export default ApartmentCharges;


// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import ChargesList from './components/ChargesList';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button, Spinner, Alert, Card } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const ApartmentCharges = () => {
//   const [charges, setCharges] = useState([]);
//   const [apartmentUnit, setApartmentUnit] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug, apartmentUnitUuid } = useParams();
//   const navigate = useNavigate();

//   console.log('ApartmentCharges params:', { tenantSlug, apartmentUnitUuid });
//   console.log('User token:', user?.token ? 'Present' : 'Missing');

//   // Fetch apartment unit details and charges
//   const fetchApartmentUnitAndCharges = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug || !apartmentUnitUuid) {
//         throw new Error('Required parameters missing');
//       }

//       setLoading(true);
//       console.log('Starting to fetch apartment unit and charges...');

//       // Fetch all apartments to find the specific unit
//       const apartmentsResponse = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched apartments data:', apartmentsResponse.data);

//       // Find the specific apartment unit from the nested structure
//       let foundUnit = null;

//       apartmentsResponse.data.forEach(category => {
//         category.apartments.forEach(apartment => {
//           const unit = apartment.apartment_units.find(
//             unit => unit.apartment_unit_uuid === apartmentUnitUuid
//           );
//           if (unit) {
//             foundUnit = {
//               ...unit,
//               apartment_name: apartment.name,
//               category_name: category.name,
//               full_address: apartment.address,
//               location: apartment.location
//             };
//           }
//         });
//       });

//       console.log('Found apartment unit:', foundUnit);

//       if (!foundUnit) {
//         throw new Error('Apartment unit not found');
//       }

//       setApartmentUnit(foundUnit);

//       // Fetch charges for the specific apartment unit
//       try {
//         console.log('Fetching charges from:', `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnitUuid}`);
        
//         const chargesResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnitUuid}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         console.log('Charges API response:', chargesResponse);
//         console.log('Charges data:', chargesResponse.data);

//         if (chargesResponse.data) {
//           setCharges(chargesResponse.data || []);
//         } else {
//           setCharges([]);
//         }
//       } catch (chargesError) {
//         console.error('Charges API error:', chargesError);
//         console.error('Error details:', {
//           message: chargesError.message,
//           response: chargesError.response,
//           status: chargesError.response?.status
//         });
        
//         // If charges endpoint returns 404 or error, set empty array
//         if (chargesError.response?.status === 404) {
//           console.log('No charges found for this unit (404)');
//           setCharges([]);
//         } else {
//           throw new Error(`Failed to fetch charges: ${chargesError.message}`);
//         }
//       }
      
//       setLoading(false);
//     } catch (err) {
//       console.error('Overall error:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch apartment charges');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log('useEffect triggered with:', { tenantSlug, apartmentUnitUuid });
//     if (tenantSlug && apartmentUnitUuid) {
//       fetchApartmentUnitAndCharges();
//     } else {
//       console.log('Missing required parameters:', { tenantSlug, apartmentUnitUuid });
//       setError('Missing required parameters');
//       setLoading(false);
//     }
//   }, [user, tenantSlug, apartmentUnitUuid]);

//   const refreshCharges = () => {
//     fetchApartmentUnitAndCharges();
//   };

//   const handleBackClick = () => {
//     navigate(`/${tenantSlug}/charges`);
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="text-center py-4">
//         <Spinner animation="border" variant="primary" />
//         <div className="mt-2">Loading charges for apartment unit...</div>
//         <div className="text-muted small mt-1">
//           Unit UUID: {apartmentUnitUuid}
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="container py-4">
//         <div className="d-flex align-items-center mb-3">
//           <Button variant="light" onClick={handleBackClick} className="me-3">
//             <IconifyIcon icon="bx:arrow-back" className="me-1" />
//             Back to Apartments
//           </Button>
//           <h4>Error Loading Charges</h4>
//         </div>
//         <Alert variant="danger">
//           <h5>Error</h5>
//           <p>{error}</p>
//           <Button variant="primary" onClick={refreshCharges}>
//             Try Again
//           </Button>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <>
//       <PageBreadcrumb 
//         subName="Account" 
//         title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} 
//       />
//       <PageMetaData title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} />
      
//       <div className="d-flex align-items-center mb-3">
//         <Button variant="light" onClick={handleBackClick} className="me-3">
//           <IconifyIcon icon="bx:arrow-back" className="me-1" />
//           Back to Apartments
//         </Button>
//         <div>
//           <h4 className="mb-0">{apartmentUnit?.apartment_unit_name}</h4>
//           <p className="text-muted mb-0 small">
//             {apartmentUnit?.apartment_name} • {apartmentUnit?.category_name}
//           </p>
//         </div>
//       </div>

//       {/* Apartment Unit Details Card */}
//       {apartmentUnit && (
//         <Card className="mb-4">
//           <Card.Body>
//             <Row>
//               <Col md={6}>
//                 <div className="mb-2">
//                   <strong>Unit Name:</strong> {apartmentUnit.apartment_unit_name}
//                 </div>
//                 <div className="mb-2">
//                   <strong>Apartment:</strong> {apartmentUnit.apartment_name}
//                 </div>
//                 <div className="mb-2">
//                   <strong>Category:</strong> {apartmentUnit.category_name}
//                 </div>
//               </Col>
//               <Col md={6}>
//                 {apartmentUnit.full_address && (
//                   <div className="mb-2">
//                     <strong>Address:</strong> {apartmentUnit.full_address}
//                   </div>
//                 )}
//                 {apartmentUnit.location && (
//                   <div className="mb-2">
//                     <strong>Location:</strong> {apartmentUnit.location}
//                   </div>
//                 )}
//                 <div className="mb-2">
//                   <strong>Unit ID:</strong> 
//                   <code className="ms-1 small">{apartmentUnit.apartment_unit_uuid}</code>
//                 </div>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//       )}
      
//       <ChargesList 
//         charges={charges}
//         apartmentUnit={apartmentUnit}
//         refreshCharges={refreshCharges}
//         tenantSlug={tenantSlug}
//       />
//     </>
//   );
// };

// export default ApartmentCharges;



import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ChargesList from './components/ChargesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ApartmentCharges = () => {
  const [charges, setCharges] = useState([]);
  const [apartmentUnit, setApartmentUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const params = useParams();
  const navigate = useNavigate();

  // Debug: Log all parameters
  console.log('All route params:', params);
  const { tenantSlug, apartmentUnitUuid } = params;
  console.log('Extracted params:', { tenantSlug, apartmentUnitUuid });

  // If apartmentUnitUuid is undefined, show an error immediately
  if (!apartmentUnitUuid) {
    return (
      <div className="container py-4">
        <Alert variant="danger">
          <h4>Route Parameter Error</h4>
          <p>Apartment unit UUID is missing from the URL.</p>
          <p>Current parameters: {JSON.stringify(params)}</p>
          <Button variant="primary" onClick={() => navigate(`/${tenantSlug}/charges`)}>
            Back to Apartments
          </Button>
        </Alert>
      </div>
    );
  }

  // Rest of your component code...
  const fetchApartmentUnitAndCharges = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching data with:', { tenantSlug, apartmentUnitUuid });

      setLoading(true);

      // Fetch all apartments to find the specific unit
      const apartmentsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched apartments data:', apartmentsResponse.data);

      // Find the specific apartment unit from the nested structure
      let foundUnit = null;

      apartmentsResponse.data.forEach(category => {
        category.apartments.forEach(apartment => {
          const unit = apartment.apartment_units.find(
            unit => unit.apartment_unit_uuid === apartmentUnitUuid
          );
          if (unit) {
            foundUnit = {
              ...unit,
              apartment_name: apartment.name,
              category_name: category.name,
              full_address: apartment.address,
              location: apartment.location
            };
          }
        });
      });

      console.log('Found apartment unit:', foundUnit);

      if (!foundUnit) {
        throw new Error('Apartment unit not found');
      }

      setApartmentUnit(foundUnit);

      // Fetch charges for the specific apartment unit
      try {
        console.log('Fetching charges from:', `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnitUuid}`);
        
        const chargesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/charges/${apartmentUnitUuid}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Charges API response:', chargesResponse);
        
        if (chargesResponse.data) {
          setCharges(chargesResponse.data || []);
        } else {
          setCharges([]);
        }
      } catch (chargesError) {
        console.error('Charges API error:', chargesError);
        
        // If charges endpoint returns 404 or error, set empty array
        if (chargesError.response?.status === 404) {
          console.log('No charges found for this unit (404)');
          setCharges([]);
        } else {
          throw new Error(`Failed to fetch charges: ${chargesError.message}`);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Overall error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartment charges');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with:', { tenantSlug, apartmentUnitUuid });
    if (tenantSlug && apartmentUnitUuid) {
      fetchApartmentUnitAndCharges();
    }
  }, [tenantSlug, apartmentUnitUuid]);

  const refreshCharges = () => {
    fetchApartmentUnitAndCharges();
  };

  const handleBackClick = () => {
    navigate(`/${tenantSlug}/charges`);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex align-items-center mb-3">
          <Button variant="light" onClick={handleBackClick} className="me-3">
            <IconifyIcon icon="bx:arrow-back" className="me-1" />
            Back to Apartments
          </Button>
          <h4>Loading Charges</h4>
        </div>
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading charges for apartment unit...</div>
          <div className="text-muted small mt-1">
            Unit UUID: {apartmentUnitUuid}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="d-flex align-items-center mb-3">
          <Button variant="light" onClick={handleBackClick} className="me-3">
            <IconifyIcon icon="bx:arrow-back" className="me-1" />
            Back to Apartments
          </Button>
          <h4>Error Loading Charges</h4>
        </div>
        <Alert variant="danger">
          <h5>Error</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={refreshCharges} className="me-2">
              Try Again
            </Button>
            <Button variant="secondary" onClick={handleBackClick}>
              Back to Apartments
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Account" 
        title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} 
      />
      <PageMetaData title={`Charges - ${apartmentUnit?.apartment_unit_name || 'Apartment Unit'}`} />
      
      <div className="d-flex align-items-center mb-3">
        <Button variant="light" onClick={handleBackClick} className="me-3">
          <IconifyIcon icon="bx:arrow-back" className="me-1" />
          Back to Apartments
        </Button>
        <div>
          <h4 className="mb-0">{apartmentUnit?.apartment_unit_name}</h4>
          <p className="text-muted mb-0 small">
            {apartmentUnit?.apartment_name} • {apartmentUnit?.category_name}
          </p>
        </div>
      </div>

      {/* Apartment Unit Details Card */}
      {apartmentUnit && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <strong>Unit Name:</strong> {apartmentUnit.apartment_unit_name}
                </div>
                <div className="mb-2">
                  <strong>Apartment:</strong> {apartmentUnit.apartment_name}
                </div>
                <div className="mb-2">
                  <strong>Category:</strong> {apartmentUnit.category_name}
                </div>
              </Col>
              <Col md={6}>
                {apartmentUnit.full_address && (
                  <div className="mb-2">
                    <strong>Address:</strong> {apartmentUnit.full_address}
                  </div>
                )}
                {apartmentUnit.location && (
                  <div className="mb-2">
                    <strong>Location:</strong> {apartmentUnit.location}
                  </div>
                )}
                <div className="mb-2">
                  <strong>Unit ID:</strong> 
                  <code className="ms-1 small">{apartmentUnit.apartment_unit_uuid}</code>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <ChargesList 
        charges={charges}
        apartmentUnit={apartmentUnit}
        refreshCharges={refreshCharges}
        tenantSlug={tenantSlug}
      />
    </>
  );
};

export default ApartmentCharges;