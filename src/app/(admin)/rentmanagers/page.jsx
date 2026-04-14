import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import RentManagersList from './components/RentManagersList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { useParams } from 'react-router-dom';

const RentManagers = () => {
  const [rentAccounts, setRentAccounts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [apartmentUnits, setApartmentUnits] = useState({}); // Store units by apartment UUID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { tenantSlug } = useParams();

  const fetchRentAccounts = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Estate slug not found in URL');
      }

      // Fetch rent accounts
      const rentAccountsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/rent/account/get`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Fetch tenants for occupant_uuid
      const tenantsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenants/view`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Fetch apartments
      const apartmentsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Fetch apartment units for each apartment using POST with body
      const apartmentsData = apartmentsResponse.data.data || [];
      const unitsMap = {};
      
      for (const apartment of apartmentsData) {
        if (apartment.uuid) {
          try {
            const unitsResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/apartments/units/info`,
              {
                apartment_uuid: apartment.uuid
              },
              {
                headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            unitsMap[apartment.uuid] = unitsResponse.data.data || [];
          } catch (unitError) {
            console.error(`Error fetching units for apartment ${apartment.uuid}:`, unitError);
            unitsMap[apartment.uuid] = [];
          }
        }
      }

      setRentAccounts(rentAccountsResponse.data.data || []);
      setTenants(tenantsResponse.data.users?.data || tenantsResponse.data.data || []);
      setApartments(apartmentsData);
      setApartmentUnits(unitsMap);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch rent accounts');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug && user?.token) {
      fetchRentAccounts();
    }
  }, [user, tenantSlug]);

  const refreshRentAccounts = () => {
    fetchRentAccounts();
  };

  // Function to update rent accounts after CRUD operations
  const updateRentAccounts = (updatedAccounts) => {
    setRentAccounts([...updatedAccounts]);
  };

  if (loading) return <div className="text-center py-4">Loading rent accounts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Rent Managers" />
      <PageMetaData title="Rent Managers" />
      
      <RentManagersList 
        rentAccounts={rentAccounts}
        tenants={tenants}
        apartments={apartments}
        apartmentUnits={apartmentUnits}
        refreshRentAccounts={refreshRentAccounts}
        updateRentAccounts={updateRentAccounts}
        estateSlug={tenantSlug}
      />
    </>
  );
};

export default RentManagers;


