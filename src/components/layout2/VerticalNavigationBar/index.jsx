import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import FallbackLoading from '@/components/FallbackLoading';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/menu2';
import HoverMenuToggle from './components/HoverMenuToggle';
import useBranding from '@/hooks/useBranding';

const AppMenu = lazy(() => import('./components/AppMenu'));

const VerticalNavigationBar = () => {
  const { tenantSlug } = useParams();
  const { branding, loading, estateManagerName } = useBranding(tenantSlug);
  const menuItems = getMenuItems();

  const formatTenantName = (slug) => {
    if (!slug) return 'Estate Manager';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <FallbackLoading />;
  }

  const logoUrl = branding?.logo;
  const displayName = estateManagerName || branding?.name || formatTenantName(tenantSlug);

  return (
    <div className="main-nav" id="leftside-menu-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div className="logo-box" style={{ padding: '20px 24px', textAlign: 'center', flexShrink: 0 }}>
        <a href="" style={{ display: 'inline-block', textDecoration: 'none' }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={displayName}
              style={{ 
                maxHeight: '40px',
                height: 'auto',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.style.cssText = `
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    background: #f5f5f5;
                    border-radius: 4px;
                    padding: 0 16px;
                    white-space: nowrap;
                  `;
                  fallbackDiv.textContent = displayName;
                  parent.innerHTML = '';
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          ) : (
            <div style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              background: '#f5f5f5',
              borderRadius: '4px',
              padding: '0 16px',
              whiteSpace: 'nowrap'
            }}>
              {displayName}
            </div>
          )}
        </a>
      </div>

      <HoverMenuToggle />

      <SimplebarReactClient 
        className="scrollbar" 
        style={{ 
          flex: 1,
          minHeight: 0,
          height: '100%'
        }}
      >
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;



