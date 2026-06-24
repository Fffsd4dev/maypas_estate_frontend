// import { lazy, Suspense, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import ActivityStreamToggle from './components/ActivityStreamToggle';
// import LeftSideBarToggle from './components/LeftSideBarToggle';
// import ProfileDropdown from './components/ProfileDropdown';
// import SearchBox from './components/SearchBox';
// import ThemeCustomizerToggle from './components/ThemeCustomizerToggle';
// import ThemeModeToggle from './components/ThemeModeToggle';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const AppsDropdown = lazy(() => import('./components/AppsDropdown'));
// const Notifications = lazy(() => import('./components/Notifications'));

// const TopNavigationBar = () => {
//   const { tenantSlug } = useParams();
//   const [copySuccess, setCopySuccess] = useState('');

//   // Generate login URL using tenantSlug
//   const getLoginUrl = () => {
//     const baseUrl = window.location.origin;
//     return `${baseUrl}/${tenantSlug}/tenant-sign-in`;
//   };

//   const handleCopyUrl = async () => {
//     const url = getLoginUrl();
//     try {
//       await navigator.clipboard.writeText(url);
//       setCopySuccess('Copied!');
//       setTimeout(() => setCopySuccess(''), 2000);
//     } catch (err) {
//       setCopySuccess('Failed to copy');
//       setTimeout(() => setCopySuccess(''), 2000);
//     }
//   };

//   return (
//     <header className="topbar">
//       <div className="container-xxl">
//         <div className="navbar-header">
//           <div className="d-flex align-items-center gap-2">
//             <LeftSideBarToggle />
//             {/* <SearchBox /> */}
//           </div>
          
          

//           <div className="d-flex align-items-center gap-1">

//             {/* Login URL Section - Centered */}
//           <div style={{ 
//             flex: 1,
//             display: 'flex',
//             justifyContent: 'center',
//             padding: '0 20px'
//           }}>
//             <div style={{ 
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               background: '#f8f9fa',
//               padding: '6px 16px',
//               borderRadius: '8px',
//               border: '1px solid #e9ecef',
//               maxWidth: '700px',
//               width: '100%'
//             }}>
//               <IconifyIcon 
//                 icon="bx:link" 
//                 style={{ fontSize: '1.1rem', color: '#0d6efd', flexShrink: 0 }} 
//               />
//               <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#495057' }}>
//               Estate Manager Login URL
//             </span>
//               <code style={{
//                 fontSize: '0.8rem',
//                 background: 'white',
//                 padding: '4px 8px',
//                 borderRadius: '4px',
//                 border: '1px solid #dee2e6',
//                 color: '#495057',
//                 wordBreak: 'break-all',
//                 whiteSpace: 'normal',
//                 lineHeight: '1.4',
//                 flex: 1
//               }}>
//                 {getLoginUrl()}
//               </code>
//               <button 
//                 onClick={handleCopyUrl}
//                 style={{
//                   background: copySuccess ? '#28a745' : 'white',
//                   border: '1px solid #dee2e6',
//                   borderRadius: '4px',
//                   padding: '4px 12px',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '6px',
//                   fontSize: '0.75rem',
//                   transition: 'all 0.2s',
//                   color: copySuccess ? 'white' : '#495057',
//                   flexShrink: 0
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!copySuccess) {
//                     e.currentTarget.style.background = '#f8f9fa';
//                     e.currentTarget.style.borderColor = '#0d6efd';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!copySuccess) {
//                     e.currentTarget.style.background = 'white';
//                     e.currentTarget.style.borderColor = '#dee2e6';
//                   }
//                 }}
//                 title="Copy to clipboard"
//               >
//                 <IconifyIcon 
//                   icon={copySuccess ? "bx:check" : "bx:copy"} 
//                   style={{ fontSize: '0.9rem' }} 
//                 />
//                 {copySuccess ? 'Copied!' : 'Copy'}
//               </button>
//             </div>
//           </div>
          
//             {/* Toggle Theme Mode */}
//             <ThemeModeToggle />

//             {/* Apps Dropdown */}
//             {/* <Suspense>
//               <AppsDropdown />
//             </Suspense> */}

//             {/* Notification Dropdown */}
//             {/* <Suspense>
//               <Notifications />
//             </Suspense> */}

//             {/* Toggle for Theme Customizer */}
//             <ThemeCustomizerToggle />

//             {/* Toggle for Activity Stream */}
//             {/* <ActivityStreamToggle /> */}

//             {/* Admin Profile Dropdown */}
//             <ProfileDropdown />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopNavigationBar;



import { lazy, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import ThemeCustomizerToggle from './components/ThemeCustomizerToggle';
import ThemeModeToggle from './components/ThemeModeToggle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';

const TopNavigationBar = () => {
  const { tenantSlug } = useParams();
  const { user } = useAuthContext();
  const [copySuccess, setCopySuccess] = useState('');

  const getLoginUrl = () => {
    const baseUrl = window.location.origin;
    const userType = user?.userType;

    if (userType === 'tenant') {
      return `${baseUrl}/${tenantSlug}/tenant-sign-in`;
    }
    return `${baseUrl}/${tenantSlug}/sign-in`;
  };

  const getLoginUrlLabel = () => {
    const userType = user?.userType;
    if (userType === 'tenant') return 'Tenant Login URL';
    if (userType === 'agent') return 'Property Manager Login URL';
    if (userType === 'admin') return 'Admin Login URL';
    return 'Estate Manager Login URL';
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getLoginUrl());
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  return (
    <header className="topbar">
      <div className="container-xxl">
        <div className="navbar-header">
          <div className="d-flex align-items-center gap-2">
            <LeftSideBarToggle />
          </div>

          <div className="d-flex align-items-center gap-1">

            {/* Login URL Section */}
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              padding: '0 20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f8f9fa',
                padding: '6px 16px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                maxWidth: '700px',
                width: '100%'
              }}>
                <IconifyIcon
                  icon="bx:link"
                  style={{ fontSize: '1.1rem', color: '#0d6efd', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#495057' }}>
                  {getLoginUrlLabel()}
                </span>
                <code style={{
                  fontSize: '0.8rem',
                  background: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  color: '#495057',
                  wordBreak: 'break-all',
                  whiteSpace: 'normal',
                  lineHeight: '1.4',
                  flex: 1
                }}>
                  {getLoginUrl()}
                </code>
                <button
                  onClick={handleCopyUrl}
                  style={{
                    background: copySuccess ? '#28a745' : 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s',
                    color: copySuccess ? 'white' : '#495057',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!copySuccess) {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#0d6efd';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copySuccess) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#dee2e6';
                    }
                  }}
                  title="Copy to clipboard"
                >
                  <IconifyIcon
                    icon={copySuccess ? 'bx:check' : 'bx:copy'}
                    style={{ fontSize: '0.9rem' }}
                  />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <ThemeModeToggle />
            <ThemeCustomizerToggle />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;