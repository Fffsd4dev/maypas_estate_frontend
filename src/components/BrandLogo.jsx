// components/BrandLogo.js
import useBranding from '@/hooks/useBranding';

const BrandLogo = ({ tenantSlug, className = '' }) => {
  const { branding, loading } = useBranding(tenantSlug);

  if (loading) {
    return <div className={`logo-placeholder ${className}`}>Loading...</div>;
  }

  const logoUrl = branding?.logo;
  const tenantName = branding?.name || 'Tenant';

  return (
    <div className={`logo-box ${className}`}>
      <a href="/" className="logo-link">
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
                parent.innerHTML = `<span style="
                  font-size: 18px;
                  font-weight: 600;
                  color: #333;
                ">${tenantName}</span>`;
              }
            }}
          />
        ) : (
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            {tenantName}
          </span>
        )}
      </a>
    </div>
  );
};

export default BrandLogo;