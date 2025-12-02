// // // src/pages/RentCyclesPage.jsx
// // import { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Button, Alert, Spinner, Container } from 'react-bootstrap';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// // import PageMetaData from '@/components/PageTitle';
// // import RentCyclesView from './components/RentCyclesView';

// // const RentCyclesPage = () => {
// //   const { tenantSlug, rentAccountUuid } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuthContext();
// //   const [rentAccount, setRentAccount] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (rentAccountUuid) {
// //       fetchRentAccount();
// //     }
// //   }, [rentAccountUuid]);

// //   const fetchRentAccount = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Estate slug not found');
// //       }

// //       // Fetch rent account details
// //       const response = await axios.get(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/rent/account/get`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       // Find the specific rent account from the list
// //       const rentAccounts = response.data.data || [];
// //       const account = rentAccounts.find(acc => 
// //         acc.rent_account?.uuid === rentAccountUuid || acc.uuid === rentAccountUuid
// //       );

// //       if (account) {
// //         setRentAccount(account);
// //       } else {
// //         throw new Error('Rent account not found');
// //       }

// //       setLoading(false);
// //     } catch (err) {
// //       setError(err.response?.data?.message || err.message || 'Failed to fetch rent account');
// //       setLoading(false);
// //       console.error('Error fetching rent account:', err);
// //     }
// //   };

// //   const handleBack = () => {
// //     navigate(`/${tenantSlug}/rent-accounts`);
// //   };

// //   if (loading) {
// //     return (
// //       <Container>
// //         <div className="text-center py-5">
// //           <Spinner animation="border" variant="primary" />
// //           <p className="mt-2">Loading rent account...</p>
// //         </div>
// //       </Container>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Container>
// //         <Alert variant="danger" className="mt-3">
// //           {error}
// //           <div className="mt-2">
// //             <Button variant="outline-primary" onClick={handleBack}>
// //               Back to Rent Accounts
// //             </Button>
// //           </div>
// //         </Alert>
// //       </Container>
// //     );
// //   }

// //   if (!rentAccount) {
// //     return (
// //       <Container>
// //         <Alert variant="warning" className="mt-3">
// //           Rent account not found
// //           <div className="mt-2">
// //             <Button variant="outline-primary" onClick={handleBack}>
// //               Back to Rent Accounts
// //             </Button>
// //           </div>
// //         </Alert>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <>
// //       <PageBreadcrumb 
// //         subName="Rent Accounts" 
// //         title="Rent Cycles" 
// //         parentLink={`/${tenantSlug}/rent-accounts`}
// //         parentTitle="Rent Accounts"
// //       />
// //       <PageMetaData title="Rent Cycles" />
      
// //       <Container>
// //         <div className="d-flex justify-content-between align-items-center mb-4">
// //           <Button variant="outline-secondary" onClick={handleBack}>
// //             <IconifyIcon icon="bx:arrow-back" className="me-1" />
// //             Back to Rent Accounts
// //           </Button>
// //           <Button variant="outline-primary" onClick={fetchRentAccount}>
// //             <IconifyIcon icon="bx:refresh" className="me-1" />
// //             Refresh
// //           </Button>
// //         </div>

// //         <RentCyclesView 
// //           rentAccount={rentAccount}
// //           estateSlug={tenantSlug}
// //           isPage={true}
// //         />
// //       </Container>
// //     </>
// //   );
// // };

// // export default RentCyclesPage;




// // src/pages/RentCyclesPage.jsx
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button, Alert, Spinner, Container } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// // import RentCyclesView from './components/RentCyclesView';

// const RentCyclesPage = () => {
//   const { tenantSlug, rentAccountUuid } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthContext();
//   const [rentAccount, setRentAccount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (rentAccountUuid) {
//       fetchRentAccount();
//     }
//   }, [rentAccountUuid]);

//   const fetchRentAccount = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Estate slug not found');
//       }

//       // Fetch rent account details
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/rent/account/get`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       // Find the specific rent account from the list
//       const rentAccounts = response.data.data || [];
//       const account = rentAccounts.find(acc => 
//         acc.rent_account?.uuid === rentAccountUuid || acc.uuid === rentAccountUuid
//       );

//       if (account) {
//         setRentAccount(account);
//       } else {
//         throw new Error('Rent account not found');
//       }

//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch rent account');
//       setLoading(false);
//       console.error('Error fetching rent account:', err);
//     }
//   };

//   const handleBack = () => {
//     navigate(`/${tenantSlug}/rent-accounts`);
//   };

//   if (loading) {
//     return (
//       <Container>
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading rent account...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container>
//         <Alert variant="danger" className="mt-3">
//           {error}
//           <div className="mt-2">
//             <Button variant="outline-primary" onClick={handleBack}>
//               Back to Rent Accounts
//             </Button>
//           </div>
//         </Alert>
//       </Container>
//     );
//   }

//   if (!rentAccount) {
//     return (
//       <Container>
//         <Alert variant="warning" className="mt-3">
//           Rent account not found
//           <div className="mt-2">
//             <Button variant="outline-primary" onClick={handleBack}>
//               Back to Rent Accounts
//             </Button>
//           </div>
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PageBreadcrumb 
//         subName="Rent Accounts" 
//         title="Rent Cycles" 
//         parentLink={`/${tenantSlug}/rent-accounts`}
//         parentTitle="Rent Accounts"
//       />
//       <PageMetaData title="Rent Cycles" />
      
//       <Container>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <Button variant="outline-secondary" onClick={handleBack}>
//             <IconifyIcon icon="bx:arrow-back" className="me-1" />
//             Back to Rent Accounts
//           </Button>
//           <Button variant="outline-primary" onClick={fetchRentAccount}>
//             <IconifyIcon icon="bx:refresh" className="me-1" />
//             Refresh
//           </Button>
//         </div>

//         {/* <RentCyclesView 
//           rentAccount={rentAccount}
//           estateSlug={tenantSlug}
//           isPage={true}
//         /> */}
//       </Container>
//     </>
//   );
// };

// export default RentCyclesPage;



// src/pages/RentCyclesPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Alert, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import RentCyclesView from '../components/RentCyclesView';

const RentCyclesPage = () => {
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [rentAccount, setRentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get rent account from navigation state
  useEffect(() => {
    if (location.state?.rentAccount) {
      console.log('Rent account from location state:', location.state.rentAccount);
      setRentAccount(location.state.rentAccount);
    } else {
      setError('No rent account data provided. Please go back and select a rent account.');
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(`/${tenantSlug}/rent-manager`);
  };

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-3">
          {error}
          <div className="mt-2">
            <Button variant="outline-primary" onClick={handleBack}>
              Back to Rent Accounts
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!rentAccount) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading rent account...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageBreadcrumb 
        subName="Rent Manager" 
        title="Rent Cycles"
      />
      <PageMetaData title="Rent Cycles" />
      
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-secondary" onClick={handleBack}>
            <IconifyIcon icon="bx:arrow-back" className="me-1" />
            Back to Rent Accounts
          </Button>
        </div>

        <RentCyclesView 
          rentAccount={rentAccount}
          estateSlug={tenantSlug}
          isPage={true}
        />
      </Container>
    </>
  );
};

export default RentCyclesPage;