// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// import ApartmentAmenitiesList from './components/ApartmentSpecialtiesList';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';

// const ApartmentSpeciality = () => {
//   const [amenities, setAmenities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();

//   const fetchAmenities = async () => {
//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-specialties`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Fetched apartment amenities data:', response.data);

//       // API returns direct array of objects, not nested in data property
//       if (Array.isArray(response.data)) {
//         setAmenities(response.data);
//       } else {
//         setAmenities([]);
//       }
      
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch apartment amenities');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAmenities();
//   }, [user]);

//   const refreshAmenities = () => {
//     fetchAmenities();
//   };

//   if (loading) return <div className="text-center py-4">Loading apartment amenities...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <PageBreadcrumb subName="Inventory" title="Apartment Amenities" />
//       <PageMetaData title="Apartment Amenities" />
      
//       <ApartmentAmenitiesList 
//         amenities={amenities}
//         refreshAmenities={refreshAmenities}
//       />
//     </>
//   );
// };

// export default ApartmentSpeciality;



import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentSpecialtiesList from './components/ApartmentSpecialtiesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const ApartmentSpeciality = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchSpecialties = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-specialties`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched apartment specialties data:', response.data);

      if (Array.isArray(response.data)) {
        setSpecialties(response.data);
      } else {
        setSpecialties([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch apartment specialties');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, [user]);

  const refreshSpecialties = () => {
    fetchSpecialties();
  };

  if (loading) return <div className="text-center py-4">Loading apartment specialties...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Inventory" title="Apartment Specialties" />
      <PageMetaData title="Apartment Specialties" />
      
      <ApartmentSpecialtiesList 
        specialties={specialties}
        refreshSpecialties={refreshSpecialties}
      />
    </>
  );
};

export default ApartmentSpeciality;