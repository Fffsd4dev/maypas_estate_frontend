
// hooks/useBranding.js
import { useEffect, useState } from 'react';

const useBranding = (tenantSlug) => {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estateManagerName, setEstateManagerName] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      if (!tenantSlug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://live.maypashomes.com/api/${tenantSlug}/get/brand/data`
        );
        
        if (response.ok) {
          const data = await response.json();
          const brandingData = data.data || data;
          setBranding(brandingData);
          
          // Extract estate manager name from the response if available
          if (brandingData?.estate_manager_name) {
            setEstateManagerName(brandingData.estate_manager_name);
          } else if (brandingData?.manager_name) {
            setEstateManagerName(brandingData.manager_name);
          } else if (brandingData?.name) {
            setEstateManagerName(brandingData.name);
          }
        } else {
          console.warn('No branding found or error fetching branding');
          setError('No branding found');
          // Try to fetch estate manager info from a separate endpoint if needed
          await fetchEstateManagerInfo();
        }
      } catch (err) {
        console.error('Error fetching branding:', err);
        setError('Failed to fetch branding');
        // Try to fetch estate manager info from a separate endpoint if needed
        await fetchEstateManagerInfo();
      } finally {
        setLoading(false);
      }
    };

    const fetchEstateManagerInfo = async () => {
      try {
        // Optional: Fetch estate manager info from another endpoint
        const response = await fetch(
          `https://live.maypashomes.com/api/${tenantSlug}/get/manager/info`
        );
        if (response.ok) {
          const data = await response.json();
          setEstateManagerName(data.name || data.manager_name);
        } else {
          // Fallback to tenantSlug formatted as name
          setEstateManagerName(formatTenantName(tenantSlug));
        }
      } catch (err) {
        // Ultimate fallback
        setEstateManagerName(formatTenantName(tenantSlug));
      }
    };

    const formatTenantName = (slug) => {
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    fetchBranding();
  }, [tenantSlug]);

  return { branding, loading, error, estateManagerName };
};

export default useBranding;