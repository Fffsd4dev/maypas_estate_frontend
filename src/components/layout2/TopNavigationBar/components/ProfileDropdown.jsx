
import { Link, useParams } from 'react-router-dom';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import avatar1 from '@/assets/images/users/dummy-avatar.jpg';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ProfileDropdown = () => {
  const { user, removeSession2 } = useAuthContext();
  const { tenantSlug } = useParams();

  const handleLogout = async () => {
    try {
      // Get the token from your auth context
      const token = user?.token;
      
      // Call the logout API
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/logout`, null, {
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
      removeSession2();
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
        <DropdownHeader as="h6">Welcome {user.user.first_name || 'User'} {user.user.last_name || 'User'}!</DropdownHeader>
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