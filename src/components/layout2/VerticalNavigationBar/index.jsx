import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FallbackLoading from '@/components/FallbackLoading';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/menu2';
import HoverMenuToggle from './components/HoverMenuToggle';

const AppMenu = lazy(() => import('./components/AppMenu'));

const VerticalNavigationBar = () => {
  const { tenantSlug } = useParams(); // Get tenantSlug from URL
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const menuItems = getMenuItems();

  useEffect(() => {
    const fetchBranding = async () => {
      if (!tenantSlug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://trial.maypaspace.com/api/${tenantSlug}/get/brand/data`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Access the logo from data.data.logo (since logo is inside data.data)
          setBranding(data.data || data);
        } else {
          console.warn('No branding found or error fetching branding');
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, [tenantSlug]);

  if (loading) {
    return <FallbackLoading />;
  }

  // Extract logo and name from the API response structure
  // branding contains the 'data' object from the response
  const logoUrl = branding?.logo;
  const tenantName = branding?.name || 'Tenant';

  return (
    <div className="main-nav" id="leftside-menu-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh', // Full viewport height
      overflow: 'hidden' // Prevent outer container from scrolling
    }}>
      {/* Logo section - simple image */}
      <div className="logo-box" style={{ padding: '20px 24px', textAlign: 'center', flexShrink: 0 }}>
        <a href="" style={{ display: 'inline-block' }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={tenantName}
              style={{ 
                maxHeight: '40px',
                height: 'auto',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback if image fails to load
                console.error('Logo failed to load:', logoUrl);
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="
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
                  ">${tenantName}</div>`;
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
              padding: '0 16px'
            }}>
              {tenantName}
            </div>
          )}
        </a>
      </div>

      <HoverMenuToggle />

      {/* Make sure SimplebarReactClient takes remaining height and scrolls */}
      <SimplebarReactClient 
        className="scrollbar" 
        style={{ 
          flex: 1, // Take remaining space
          minHeight: 0, // Important for flex children to respect overflow
          height: '100%' // Ensure it has a height
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