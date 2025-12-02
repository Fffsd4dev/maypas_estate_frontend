// import { useState } from 'react';
// import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import RentManagersListView from './RentManagersListView';
// import CreateRentAccountModal from './CreateRentAccountModal';
// import RentCyclesView from './RentCyclesView';
// import { useAuthContext } from '@/context/useAuthContext';
// import axios from 'axios';

// const RentManagersList = ({ 
//   rentAccounts, 
//   tenants, 
//   apartments, 
//   refreshRentAccounts, 
//   updateRentAccounts, 
//   estateSlug 
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showRentCyclesModal, setShowRentCyclesModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedRentAccount, setSelectedRentAccount] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const { user } = useAuthContext();

//   // Ensure rentAccounts is always an array (using data array from paginated response)
//   const rentAccountsArray = Array.isArray(rentAccounts) ? rentAccounts : [];

//   // Helper functions for filtering
//   const getTenantName = (account) => {
//     if (account.user) {
//       return `${account.user.first_name} ${account.user.last_name}`;
//     }
//     return 'Unknown Tenant';
//   };

//   const getUnitName = (account) => {
//     return account.apartment_units?.unit_name || 'Unknown Unit';
//   };

//   const getApartmentInfo = (account) => {
//     return {
//       category: account.apartment?.category || 'N/A',
//       address: account.apartment?.address || 'N/A'
//     };
//   };

//   const handleAddClick = () => {
//     setEditMode(false);
//     setSelectedRentAccount(null);
//     setShowModal(true);
//   };

//   const handleEditClick = (rentAccount) => {
//     setEditMode(true);
//     setSelectedRentAccount(rentAccount);
//     setShowModal(true);
//   };

//   const handleViewRentCycles = (rentAccount) => {
//     setSelectedRentAccount(rentAccount);
//     setShowRentCyclesModal(true);
//   };

//   const handleDeleteClick = (rentAccount) => {
//     setSelectedRentAccount(rentAccount);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!user?.token) {
//         throw new Error('No authentication token found');
//       }

//       if (!estateSlug) {
//         throw new Error('Estate slug not found');
//       }

//       if (!selectedRentAccount?.rent_account?.uuid) {
//         throw new Error('No rent account UUID found for deletion');
//       }

//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/landlord/rent/account/delete/${selectedRentAccount.rent_account.uuid}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json',
//             "Accept": "application/json",
//           }
//         }
//       );
      
//       setSuccess('Rent account deleted successfully!');
      
//       // Update the UI without reloading - create a completely new array
//       const updatedAccounts = rentAccountsArray.filter(
//         account => account.rent_account.uuid !== selectedRentAccount.rent_account.uuid
//       );
//       updateRentAccounts([...updatedAccounts]); // Spread into new array to force re-render
      
//       setTimeout(() => {
//         setShowDeleteModal(false);
//         setSuccess(false);
//       }, 1500);
      
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to delete rent account');
//       console.error('Error deleting rent account:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle rent account updates from the modal
//   const handleRentAccountUpdate = (updatedAccount, isEdit) => {
//     if (isEdit) {
//       // Update existing account
//       const updatedAccounts = rentAccountsArray.map(account => 
//         account.rent_account.uuid === updatedAccount.rent_account.uuid 
//           ? { ...account, ...updatedAccount }
//           : account
//       );
//       updateRentAccounts([...updatedAccounts]);
//     } else {
//       // Add new account
//       const updatedAccounts = [...rentAccountsArray, updatedAccount];
//       updateRentAccounts([...updatedAccounts]);
//     }
//   };

//   const filteredRentAccounts = rentAccountsArray.filter(account => {
//     const tenantName = getTenantName(account).toLowerCase();
//     const unitName = getUnitName(account).toLowerCase();
//     const category = getApartmentInfo(account).category.toLowerCase();
//     const tenantEmail = account.user?.email ? account.user.email.toLowerCase() : '';
    
//     return (
//       tenantName.includes(searchTerm.toLowerCase()) ||
//       unitName.includes(searchTerm.toLowerCase()) ||
//       category.includes(searchTerm.toLowerCase()) ||
//       tenantEmail.includes(searchTerm.toLowerCase())
//     );
//   });

//   const getFullRentAccountInfo = (account) => {
//     if (!account) return { tenantName: 'N/A', unitName: 'N/A', apartmentInfo: 'N/A' };
    
//     return {
//       tenantName: getTenantName(account),
//       unitName: getUnitName(account),
//       apartmentInfo: getApartmentInfo(account)
//     };
//   };

//   return (
//     <>
//       <Row>
//         <Col xs={12}>
//           <Card>
//             <CardBody>
//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
//                 <div>
//                   <form className="d-flex flex-wrap align-items-center gap-2">
//                     <div className="search-bar me-3">
//                       <span>
//                         <IconifyIcon icon="bx:search-alt" className="mb-1" />
//                       </span>
//                       <input 
//                         type="search" 
//                         className="form-control" 
//                         placeholder="Search by tenant, unit, category, or email..." 
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </form>
//                 </div>
//                 <div>
//                   <button 
//                     className="btn btn-primary"
//                     onClick={handleAddClick}
//                   >
//                     <IconifyIcon icon="bi:plus" className="me-1" />
//                     Add Rent Account
//                   </button>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {rentAccountsArray.length > 0 ? (
//         <RentManagersListView 
//           rentAccounts={filteredRentAccounts}
//           onEditClick={handleEditClick}
//           onDeleteClick={handleDeleteClick}
//           onViewRentCycles={handleViewRentCycles}
//         />
//       ) : (
//         <div className="alert alert-info mt-3">No rent accounts found</div>
//       )}

//       <CreateRentAccountModal 
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         refreshRentAccounts={refreshRentAccounts}
//         onRentAccountUpdate={handleRentAccountUpdate}
//         editMode={editMode}
//         rentAccountToEdit={selectedRentAccount}
//         estateSlug={estateSlug}
//         tenants={tenants}
//         apartments={apartments}
//       />

//       <RentCyclesView
//         show={showRentCyclesModal}
//         handleClose={() => setShowRentCyclesModal(false)}
//         rentAccount={selectedRentAccount}
//         estateSlug={estateSlug}
//       />

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {success && (
//             <Alert variant="success">
//               {success}
//             </Alert>
//           )}
          
//           {!success && selectedRentAccount && (
//             <>
//               Are you sure you want to delete the rent account for{' '}
//               <strong>{getFullRentAccountInfo(selectedRentAccount).tenantName}</strong> in{' '}
//               <strong>{getFullRentAccountInfo(selectedRentAccount).unitName}</strong>? 
//               This action cannot be undone.
//               <br /><br />
//               <small className="text-muted">
//                 Rent Account UUID: {selectedRentAccount.rent_account?.uuid}
//               </small>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDeleteConfirm}
//             disabled={loading || success}
//           >
//             {loading ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-1" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon="bx:trash" className="me-1" />
//                 Delete
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default RentManagersList;



// src/pages/components/RentManagersList.jsx
import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import RentManagersListView from './RentManagersListView';
import CreateRentAccountModal from './CreateRentAccountModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const RentManagersList = ({ 
  rentAccounts, 
  tenants, 
  apartments, 
  refreshRentAccounts, 
  updateRentAccounts, 
  estateSlug 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRentAccount, setSelectedRentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Ensure rentAccounts is always an array (using data array from paginated response)
  const rentAccountsArray = Array.isArray(rentAccounts) ? rentAccounts : [];

  // Helper functions for filtering
  const getTenantName = (account) => {
    if (account.user) {
      return `${account.user.first_name} ${account.user.last_name}`;
    }
    return 'Unknown Tenant';
  };

  const getUnitName = (account) => {
    return account.apartment_units?.unit_name || 'Unknown Unit';
  };

  const getApartmentInfo = (account) => {
    return {
      category: account.apartment?.category || 'N/A',
      address: account.apartment?.address || 'N/A'
    };
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedRentAccount(null);
    setShowModal(true);
  };

  const handleEditClick = (rentAccount) => {
    setEditMode(true);
    setSelectedRentAccount(rentAccount);
    setShowModal(true);
  };

  const handleViewRentCycles = (rentAccount) => {
    // Pass the entire rent account object via state instead of URL params
    navigate(`/${estateSlug}/rent-accounts/cycles`, { 
      state: { rentAccount } 
    });
  };

  const handleDeleteClick = (rentAccount) => {
    setSelectedRentAccount(rentAccount);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!estateSlug) {
        throw new Error('Estate slug not found');
      }

      if (!selectedRentAccount?.rent_account?.uuid) {
        throw new Error('No rent account UUID found for deletion');
      }

      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${estateSlug}/rent/account/get/cycles/${selectedRentAccount.rent_account.uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Rent account deleted successfully!');
      
      // Update the UI without reloading - create a completely new array
      const updatedAccounts = rentAccountsArray.filter(
        account => account.rent_account.uuid !== selectedRentAccount.rent_account.uuid
      );
      updateRentAccounts([...updatedAccounts]); // Spread into new array to force re-render
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete rent account');
      console.error('Error deleting rent account:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle rent account updates from the modal
  const handleRentAccountUpdate = (updatedAccount, isEdit) => {
    if (isEdit) {
      // Update existing account
      const updatedAccounts = rentAccountsArray.map(account => 
        account.rent_account.uuid === updatedAccount.rent_account.uuid 
          ? { ...account, ...updatedAccount }
          : account
      );
      updateRentAccounts([...updatedAccounts]);
    } else {
      // Add new account
      const updatedAccounts = [...rentAccountsArray, updatedAccount];
      updateRentAccounts([...updatedAccounts]);
    }
  };

  const filteredRentAccounts = rentAccountsArray.filter(account => {
    const tenantName = getTenantName(account).toLowerCase();
    const unitName = getUnitName(account).toLowerCase();
    const category = getApartmentInfo(account).category.toLowerCase();
    const tenantEmail = account.user?.email ? account.user.email.toLowerCase() : '';
    
    return (
      tenantName.includes(searchTerm.toLowerCase()) ||
      unitName.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase()) ||
      tenantEmail.includes(searchTerm.toLowerCase())
    );
  });

  const getFullRentAccountInfo = (account) => {
    if (!account) return { tenantName: 'N/A', unitName: 'N/A', apartmentInfo: 'N/A' };
    
    return {
      tenantName: getTenantName(account),
      unitName: getUnitName(account),
      apartmentInfo: getApartmentInfo(account)
    };
  };

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search by tenant, unit, category, or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Rent Account
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {rentAccountsArray.length > 0 ? (
        <RentManagersListView 
          rentAccounts={filteredRentAccounts}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onViewRentCycles={handleViewRentCycles}
        />
      ) : (
        <div className="alert alert-info mt-3">No rent accounts found</div>
      )}

      <CreateRentAccountModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshRentAccounts={refreshRentAccounts}
        onRentAccountUpdate={handleRentAccountUpdate}
        editMode={editMode}
        rentAccountToEdit={selectedRentAccount}
        estateSlug={estateSlug}
        tenants={tenants}
        apartments={apartments}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          {!success && selectedRentAccount && (
            <>
              Are you sure you want to delete the rent account for{' '}
              <strong>{getFullRentAccountInfo(selectedRentAccount).tenantName}</strong> in{' '}
              <strong>{getFullRentAccountInfo(selectedRentAccount).unitName}</strong>? 
              This action cannot be undone.
              <br /><br />
              <small className="text-muted">
                Rent Account UUID: {selectedRentAccount.rent_account?.uuid}
              </small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RentManagersList;