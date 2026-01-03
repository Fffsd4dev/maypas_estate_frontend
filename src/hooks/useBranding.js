// hooks/useBranding.js
import { useEffect, useState } from 'react';

const useBranding = (tenantSlug) => {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setBranding(data.data || data); // Handle API response structure
        } else {
          console.warn('No branding found or error fetching branding');
          setError('No branding found');
        }
      } catch (err) {
        console.error('Error fetching branding:', err);
        setError('Failed to fetch branding');
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, [tenantSlug]);

  return { branding, loading, error };
};

export default useBranding;