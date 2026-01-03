// // import { Link } from 'react-router-dom';
// // import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // import avatar1 from '@/assets/images/users/avatar-1.jpg';
// // const ProfileDropdown = () => {
// //   return <Dropdown className="topbar-item" align={'end'}>
// //       <DropdownToggle as="button" type="button" className="topbar-button content-none" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
// //         <span className="d-flex align-items-center">
// //           <img className="rounded-circle" width={32} height={32} src={avatar1} alt="avatar-3" />
// //         </span>
// //       </DropdownToggle>
// //       <DropdownMenu>
// //         <DropdownHeader as="h6">Welcome Gaston!</DropdownHeader>
// //         <DropdownItem as={Link} to="/pages/profile">
// //           <IconifyIcon icon="bx:user-circle" className="text-muted fs-18 align-middle me-1" />
// //           <span className="align-middle">Profile</span>
// //         </DropdownItem>
// //         <DropdownItem as={Link} to="/apps/chat">
// //           <IconifyIcon icon="bx:message-dots" className="text-muted fs-18 align-middle me-1" />
// //           <span className="align-middle">Messages</span>
// //         </DropdownItem>
// //         <DropdownItem as={Link} to="/pages/pricing">
// //           <IconifyIcon icon="bx:wallet" className="text-muted fs-18 align-middle me-1" />
// //           <span className="align-middle">Pricing</span>
// //         </DropdownItem>
// //         <DropdownItem as={Link} to="/pages/faqs">
// //           <IconifyIcon icon="bx:help-circle" className="text-muted fs-18 align-middle me-1" />
// //           <span className="align-middle">Help</span>
// //         </DropdownItem>
// //         <DropdownItem as={Link} to="/auth/lock-screen">
// //           <IconifyIcon icon="bx:lock" className="text-muted fs-18 align-middle me-1" />
// //           <span className="align-middle">Lock screen</span>
// //         </DropdownItem>
// //         <DropdownDivider className="dropdown-divider my-1" />
// //         <DropdownItem as={Link} className="text-danger" to="/auth/sign-in">
// //           <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
// //           <span className="align-middle">Logout</span>
// //         </DropdownItem>
// //       </DropdownMenu>
// //     </Dropdown>;
// // };
// // export default ProfileDropdown;




import { Link } from 'react-router-dom';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import avatar1 from '@/assets/images/users/dummy-avatar.jpg';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ProfileDropdown = () => {
  const { user, removeSession } = useAuthContext();
  console.log('Displaying User:', user);
  
  const handleLogout = async () => {
    try {
      // Get the token from your auth context
      const token = user?.token; // Adjust this based on your actual session structure
      
      
      // Call the logout API
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/system-admin/logout`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // We'll still proceed with local session cleanup even if API fails
    } finally {
      // This will:
      // 1. Delete the cookie
      // 2. Clear the user state
      // 3. Redirect to /auth/sign-in-2
      removeSession();
    }
  };

  return (
    <Dropdown className="topbar-item" align={'end'}>
      <DropdownToggle as="button" type="button" className="topbar-button content-none" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className="d-flex align-items-center">
          <img className="rounded-circle" width={32} height={32} src={avatar1} alt="avatar-3" />
        </span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownHeader as="h6">Welcome {user?.name || 'Hello'}!</DropdownHeader>
        {/* <DropdownItem as={Link} to="/pages/profile">
          <IconifyIcon icon="bx:user-circle" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem as={Link} to="/apps/chat">
          <IconifyIcon icon="bx:message-dots" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Messages</span>
        </DropdownItem>
        <DropdownItem as={Link} to="/pages/pricing">
          <IconifyIcon icon="bx:wallet" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem as={Link} to="/pages/faqs">
          <IconifyIcon icon="bx:help-circle" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Help</span>
        </DropdownItem>
        <DropdownItem as={Link} to="/auth/lock-screen">
          <IconifyIcon icon="bx:lock" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Lock screen</span>
        </DropdownItem> */}
        <DropdownDivider className="dropdown-divider my-1" />
        <DropdownItem className="text-danger" onClick={handleLogout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;




// import { Link } from 'react-router-dom';
// import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import avatar1 from '@/assets/images/users/dummy-avatar.jpg';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';

// const ProfileDropdown = () => {
//   const { user, token, removeSession, isAuthenticated } = useAuthContext();
  
//   console.log('ProfileDropdown - User:', user);
//   console.log('ProfileDropdown - Token exists:', !!token);
//   console.log('✅ ProfileDropdown - Is authenticated:', isAuthenticated);
  
//   const handleLogout = async () => {
//     try {
//       // Use token from context
//       if (token) {
//         await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/logout`, 
//           null, 
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );
//       }
//     } catch (error) {
//       console.error('Logout API call failed:', error);
//       // Continue with local cleanup
//     } finally {
//       removeSession();
//     }
//   };

//   // Show sign in button if not authenticated
//   if (!isAuthenticated || !user) {
//     console.log('❌ Not authenticated or no user, showing sign in button');
//     return (
//       <div className="topbar-item">
//         <Link to="/auth/sign-in-2" className="btn btn-outline-primary btn-sm">
//           Sign In
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <Dropdown className="topbar-item" align={'end'}>
//       <DropdownToggle as="button" type="button" className="topbar-button content-none" id="page-header-user-dropdown">
//         <span className="d-flex align-items-center">
//           <img 
//             className="rounded-circle" 
//             width={32} 
//             height={32} 
//             src={user.avatar || avatar1} 
//             alt={user.name || user.email || 'User'} 
//           />
//           <span className="ms-2 d-none d-md-inline">
//             {user.name || user.email || 'User'}
//           </span>
//         </span>
//       </DropdownToggle>
      
//       <DropdownMenu>
//         <DropdownHeader as="h6">
//           Welcome {user.name || user.email || 'User'}!
//           {user.role && <div className="text-muted small mt-1">{user.role}</div>}
//         </DropdownHeader>
//         <DropdownItem as={Link} to="/pages/profile">
//           <IconifyIcon icon="bx:user-circle" className="text-muted fs-18 align-middle me-1" />
//           <span className="align-middle">Profile</span>
//         </DropdownItem>
//         {/* ... other dropdown items ... */}
//         <DropdownDivider className="dropdown-divider my-1" />
//         <DropdownItem className="text-danger" onClick={handleLogout}>
//           <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
//           <span className="align-middle">Logout</span>
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

// export default ProfileDropdown;