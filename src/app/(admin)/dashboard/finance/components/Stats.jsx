// // // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // // import { Card, CardBody, Col, Row } from 'react-bootstrap';
// // // import { currency } from '@/context/constants';
// // // import { statData } from '../data';
// // // const StateCard = ({
// // //   stat
// // // }) => {
// // //   const {
// // //     change,
// // //     changeColor,
// // //     icon,
// // //     iconColor,
// // //     name,
// // //     amount
// // //   } = stat;
// // //   return <Card>
// // //       <CardBody>
// // //         <div className="d-flex align-items-center justify-content-between">
// // //           <div>
// // //             <h3 className="mb-0 fw-bold mb-2">
// // //               {currency}
// // //               {amount}k
// // //             </h3>
// // //             <p className="text-muted">{name}</p>
// // //             <span className={`badge fs-12 badge-soft-${changeColor}`}>{change}%</span>
// // //           </div>
// // //           <div>
// // //             <div className="avatar-lg d-inline-block me-1">
// // //               <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
// // //                 <IconifyIcon icon={icon} className="fs-32" />
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </CardBody>
// // //     </Card>;
// // // };
// // // const Stats = () => {
// // //   return <Row>
// // //       {statData.map((stat, idx) => <Col key={idx}>
// // //           <StateCard stat={stat} />
// // //         </Col>)}
// // //     </Row>;
// // // };
// // // export default Stats;



// // import { Row, Col } from "react-bootstrap";
// // import { useState, useEffect } from "react";
// // import { useAuthContext } from "@/context/useAuthContext";
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';
// // import { Card, CardBody, Spinner, Alert } from 'react-bootstrap';
// // import { currency } from '@/context/constants';

// // // Card configurations with icons and colors
// // const cardConfig = {
// //   estateManagers: {
// //     icon: "mdi:account-tie",
// //     iconColor: "primary",
// //     name: "Total Estate Managers",
// //     variant: "primary",
// //     endpoint: "/system-admin/view-estate-managers",
// //     dataKey: "count" // We'll calculate this from the array
// //   },
// //   landlords: {
// //     icon: "mdi:home-account",
// //     iconColor: "success",
// //     name: "Total Landlords",
// //     variant: "success",
// //     endpoint: "/landlords/stats",
// //     dataKey: "total"
// //   },
// //   tenants: {
// //     icon: "mdi:account-group",
// //     iconColor: "info",
// //     name: "Total Tenants",
// //     variant: "info",
// //     endpoint: "/tenants/stats",
// //     dataKey: "total"
// //   },
// //   properties: {
// //     icon: "mdi:home",
// //     iconColor: "warning",
// //     name: "Total Properties",
// //     variant: "warning",
// //     endpoint: "/properties/stats",
// //     dataKey: "total"
// //   }
// // };

// // const StatisticsWidget = ({ stat, isLoading }) => {
// //   const {
// //     change,
// //     changeColor,
// //     icon,
// //     iconColor,
// //     name,
// //     amount,
// //     error,
// //     variant
// //   } = stat;

// //   if (error) {
// //     return (
// //       <Card>
// //         <CardBody>
// //           <div className="d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
// //             <Alert variant="danger" className="mb-0 py-2">
// //               Failed to load data
// //             </Alert>
// //           </div>
// //         </CardBody>
// //       </Card>
// //     );
// //   }

// //   if (isLoading) {
// //     return (
// //       <Card>
// //         <CardBody>
// //           <div className="d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
// //             <Spinner animation="border" variant={variant || "primary"} />
// //           </div>
// //         </CardBody>
// //       </Card>
// //     );
// //   }

// //   return (
// //     <Card>
// //       <CardBody>
// //         <div className="d-flex align-items-center justify-content-between">
// //           <div>
// //             <h3 className="mb-0 fw-bold mb-2">
// //               {amount}
// //             </h3>
// //             <p className="text-muted">{name}</p>
// //             {change && (
// //               <span className={`badge fs-12 badge-soft-${changeColor}`}>
// //                 {change}%
// //               </span>
// //             )}
// //           </div>
// //           <div>
// //             <div className="avatar-lg d-inline-block me-1">
// //               <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
// //                 <IconifyIcon icon={icon} className="fs-32" />
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //       </CardBody>
// //     </Card>
// //   );
// // };

// // const Stats = () => {
// //   const { user } = useAuthContext();
// //   const [stats, setStats] = useState({
// //     estateManagers: { loading: true, error: null, amount: 0, change: 0 },
// //     landlords: { loading: true, error: null, amount: 0, change: 0 },
// //     tenants: { loading: true, error: null, amount: 0, change: 0 },
// //     properties: { loading: true, error: null, amount: 0, change: 0 }
// //   });

// //   const fetchStatData = async (endpoint, statKey) => {
// //     try {
// //       if (!user?.token) return;

// //       const response = await fetch(
// //         `${import.meta.env.VITE_BACKEND_URL}/api${endpoint}`,
// //         {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //             "Content-Type": "application/json"
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch ${statKey} data`);
// //       }

// //       const data = await response.json();
// //       const config = cardConfig[statKey];
      
// //       let amount = 0;
// //       let change = 0;

// //       // Handle different API response structures
// //       if (statKey === 'estateManagers') {
// //         // Your API returns an array of estate managers
// //         // Count the number of estate managers in the array
// //         const estateManagersArray = data.data?.data || data.data || data;
// //         amount = Array.isArray(estateManagersArray) ? estateManagersArray.length : 0;
        
// //         // If you need change percentage, you might need additional API or calculate from previous data
// //         change = 0; // Set to 0 or fetch from separate API endpoint
        
// //       } else {
// //         // For other stats that return direct counts
// //         amount = data[config.dataKey] || 0;
// //         change = data.change || 0;
// //       }

// //       // Update the specific stat
// //       setStats(prev => ({
// //         ...prev,
// //         [statKey]: {
// //           ...prev[statKey],
// //           loading: false,
// //           error: null,
// //           amount: amount,
// //           change: change,
// //           changeColor: change >= 0 ? 'success' : 'danger',
// //           ...config // Spread the config properties
// //         }
// //       }));

// //     } catch (error) {
// //       console.error(`Error fetching ${statKey}:`, error);
// //       setStats(prev => ({
// //         ...prev,
// //         [statKey]: {
// //           ...prev[statKey],
// //           loading: false,
// //           error: error.message,
// //           ...cardConfig[statKey] // Include config even on error
// //         }
// //       }));
// //     }
// //   };

// //   useEffect(() => {
// //     if (!user?.token) return;

// //     // Fetch all stats in parallel
// //     Object.keys(cardConfig).forEach(statKey => {
// //       fetchStatData(cardConfig[statKey].endpoint, statKey);
// //     });
// //   }, [user?.token]);

// //   // Check if all stats are still loading
// //   const allLoading = Object.values(stats).every(stat => stat.loading);
// //   const hasError = Object.values(stats).some(stat => stat.error && !stat.loading);

// //   if (allLoading) {
// //     return (
// //       <Row>
// //         {Object.keys(cardConfig).map((statKey) => (
// //           <Col key={statKey} lg={3} md={6} className="mb-3">
// //             <Card>
// //               <CardBody className="text-center py-5">
// //                 <Spinner animation="border" variant={cardConfig[statKey].variant} />
// //                 <div className="mt-2">Loading {cardConfig[statKey].name.toLowerCase()}...</div>
// //               </CardBody>
// //             </Card>
// //           </Col>
// //         ))}
// //       </Row>
// //     );
// //   }

// //   return (
// //     <>
// //       {hasError && (
// //         <Alert variant="warning" className="mb-3">
// //           Some statistics failed to load. Please try refreshing the page.
// //         </Alert>
// //       )}

// //       <Row>
// //         {Object.keys(cardConfig).map((statKey) => (
// //           <Col key={statKey} lg={3} md={6} className="mb-3">
// //             <StatisticsWidget 
// //               stat={stats[statKey]} 
// //               isLoading={stats[statKey].loading}
// //             />
// //           </Col>
// //         ))}
// //       </Row>
// //     </>
// //   );
// // };

// // export default Stats;



// import { Row, Col, Button } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import { useAuthContext } from "@/context/useAuthContext";
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { Card, CardBody, Spinner, Alert, Badge } from 'react-bootstrap';

// // Card configurations
// const statCards = [
//   {
//     key: 'estateManagers',
//     icon: "mdi:account-tie",
//     iconColor: "primary",
//     name: "Estate Managers",
//     variant: "primary",
//     endpoint: "/system-admin/view-estate-managers",
//     description: "Total estate managers registered",
//     badgeColor: "primary"
//   },
//   {
//     key: 'apartmentCategories',
//     icon: "mdi:format-list-bulleted-type",
//     iconColor: "success",
//     name: "Apartment Categories",
//     variant: "success",
//     endpoint: "/system-admin/apartment/categories",
//     description: "Types of apartment categories",
//     badgeColor: "success"
//   },
//   {
//     key: 'admins',
//     icon: "mdi:shield-account",
//     iconColor: "info",
//     name: "System Admins",
//     variant: "info",
//     endpoint: "/system-admin/view-admins",
//     description: "Total system administrators",
//     badgeColor: "info"
//   },
//   {
//     key: 'adminRoles',
//     icon: "mdi:account-key",
//     iconColor: "warning",
//     name: "Admin Roles",
//     variant: "warning",
//     endpoint: "/system-admin/view-roles",
//     description: "Available admin role types",
//     badgeColor: "warning"
//   }
// ];

// const StatCard = ({ config, data, isLoading, error, onRetry }) => {
//   const { icon, iconColor, name, variant, description, badgeColor } = config;
//   const { amount = 0, change = 0, changeColor = 'success', lastUpdated } = data || {};

//   if (error) {
//     return (
//       <Card className="border-danger">
//         <CardBody className="text-center">
//           <div className="avatar-lg mx-auto mb-3">
//             <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
//               <IconifyIcon icon={icon} className="fs-24" />
//             </span>
//           </div>
//           <Alert variant="danger" className="mb-3 py-2">
//             <strong>Error Loading</strong>
//             <div className="small mt-1">{error}</div>
//           </Alert>
//           <Button 
//             variant="outline-danger" 
//             size="sm"
//             onClick={onRetry}
//           >
//             <IconifyIcon icon="mdi:refresh" className="me-1" />
//             Retry
//           </Button>
//           <small className="text-muted mt-2 d-block">{description}</small>
//         </CardBody>
//       </Card>
//     );
//   }

//   if (isLoading) {
//     return (
//       <Card>
//         <CardBody className="text-center py-5">
//           <Spinner animation="border" variant={variant} />
//           <div className="mt-2">Loading {name.toLowerCase()}...</div>
//           <small className="text-muted mt-1 d-block">{description}</small>
//         </CardBody>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardBody>
//         <div className="d-flex align-items-center justify-content-between">
//           <div>
//             <div className="d-flex align-items-center mb-1">
//               <h3 className="mb-0 fw-bold">{amount}</h3>
//               <Badge bg={badgeColor} className="ms-2" pill>
//                 {name.split(' ')[0]}
//               </Badge>
//             </div>
//             <p className="text-muted mb-1">{name}</p>
//             <small className="text-muted d-block">{description}</small>
            
//             {change > 0 && (
//               <span className={`badge fs-12 badge-soft-${changeColor} mt-2`}>
//                 <IconifyIcon icon="mdi:trending-up" className="me-1" />
//                 {change}%
//               </span>
//             )}
            
//             {lastUpdated && (
//               <div className="mt-2">
//                 <small className="text-muted">
//                   <IconifyIcon icon="mdi:clock-outline" className="me-1" />
//                   Updated just now
//                 </small>
//               </div>
//             )}
//           </div>
//           <div>
//             <div className="avatar-lg d-inline-block me-1">
//               <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
//                 <IconifyIcon icon={icon} className="fs-32" />
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// const Stats = () => {
//   const { user } = useAuthContext();
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [retryCount, setRetryCount] = useState(0);

//   const extractArrayFromResponse = (data) => {
//     // Common response patterns
//     const possiblePaths = [
//       data.data?.data,
//       data.data,
//       data.results,
//       data.items,
//       data.users,
//       data.admins,
//       data.roles,
//       data.categories,
//       data.managers,
//       data.list,
//       data.records
//     ];
    
//     const foundArray = possiblePaths.find(item => Array.isArray(item));
//     return foundArray || (Array.isArray(data) ? data : []);
//   };

//   const fetchSingleStat = async (card) => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api${card.endpoint}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json"
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }

//       const data = await response.json();
//       const dataArray = extractArrayFromResponse(data);
//       const amount = Array.isArray(dataArray) ? dataArray.length : 0;

//       return {
//         key: card.key,
//         data: {
//           amount: amount,
//           change: 0,
//           changeColor: 'success',
//           lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }
//       };
      
//     } catch (error) {
//       console.error(`Error fetching ${card.name}:`, error);
//       throw error;
//     }
//   };

//   const fetchAllStats = async () => {
//     if (!user?.token) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     const newErrors = {};
//     const newStats = {};

//     // Process cards sequentially to avoid overwhelming the API
//     for (const card of statCards) {
//       try {
//         const result = await fetchSingleStat(card);
//         newStats[card.key] = result.data;
        
//         // Clear any previous error for this card
//         if (errors[card.key]) {
//           delete newErrors[card.key];
//         }
        
//       } catch (error) {
//         newErrors[card.key] = error.message || `Failed to load ${card.name}`;
//         newStats[card.key] = {
//           amount: 0,
//           error: true
//         };
//       }
//     }

//     setStats(newStats);
//     setErrors(newErrors);
//     setLoading(false);
//   };

//   const handleRetry = (cardKey) => {
//     // Retry a specific card
//     const card = statCards.find(c => c.key === cardKey);
//     if (card && user?.token) {
//       setStats(prev => ({
//         ...prev,
//         [cardKey]: { ...prev[cardKey], loading: true }
//       }));
      
//       fetchSingleStat(card)
//         .then(result => {
//           setStats(prev => ({
//             ...prev,
//             [cardKey]: result.data
//           }));
//           setErrors(prev => {
//             const newErrors = { ...prev };
//             delete newErrors[cardKey];
//             return newErrors;
//           });
//         })
//         .catch(error => {
//           setErrors(prev => ({
//             ...prev,
//             [cardKey]: error.message || `Failed to load ${card.name}`
//           }));
//         });
//     }
//   };

//   const handleRefreshAll = () => {
//     setRetryCount(prev => prev + 1);
//     fetchAllStats();
//   };

//   useEffect(() => {
//     fetchAllStats();
//   }, [user?.token, retryCount]);

//   // Show loading skeleton on initial load
//   if (loading && Object.keys(stats).length === 0) {
//     return (
//       <Row>
//         {statCards.map((card) => (
//           <Col key={card.key} lg={3} md={6} className="mb-3">
//             <Card>
//               <CardBody className="text-center py-5">
//                 <Spinner animation="border" variant={card.variant} />
//                 <div className="mt-2">Loading {card.name.toLowerCase()}...</div>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     );
//   }

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4 className="mb-0">System Overview</h4>
//         <Button 
//           variant="outline-primary" 
//           size="sm"
//           onClick={handleRefreshAll}
//           disabled={loading}
//         >
//           <IconifyIcon icon="mdi:refresh" className={loading ? "spin" : ""} />
//           {loading ? ' Refreshing...' : ' Refresh All'}
//         </Button>
//       </div>
      
//       {Object.keys(errors).length === statCards.length && (
//         <Alert variant="danger" className="mb-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <strong>All statistics failed to load!</strong>
//               <div className="small mt-1">Please check your connection and try again.</div>
//             </div>
//             <Button variant="danger" size="sm" onClick={handleRefreshAll}>
//               Retry All
//             </Button>
//           </div>
//         </Alert>
//       )}
      
//       {Object.keys(errors).length > 0 && Object.keys(errors).length < statCards.length && (
//         <Alert variant="warning" className="mb-3">
//           <IconifyIcon icon="mdi:alert-circle-outline" className="me-1" />
//           <strong>Partial Load:</strong> {Object.keys(errors).length} of {statCards.length} cards failed to load.
//         </Alert>
//       )}
      
//       <Row>
//         {statCards.map((card) => (
//           <Col key={card.key} lg={3} md={6} className="mb-3">
//             <StatCard 
//               config={card}
//               data={stats[card.key] || { amount: 0 }}
//               isLoading={loading && stats[card.key]?.loading}
//               error={errors[card.key]}
//               onRetry={() => handleRetry(card.key)}
//             />
//           </Col>
//         ))}
//       </Row>
      
//       <div className="text-end mt-2">
//         <small className="text-muted">
//           <IconifyIcon icon="mdi:information-outline" className="me-1" />
//           Data updates automatically every 5 minutes
//         </small>
//       </div>
//     </>
//   );
// };

// // Add CSS for spinner animation
// const styles = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
//   .spin {
//     animation: spin 1s linear infinite;
//   }
// `;

// // Add styles to document
// if (typeof document !== 'undefined') {
//   const styleSheet = document.createElement("style");
//   styleSheet.innerText = styles;
//   document.head.appendChild(styleSheet);
// }

// export default Stats;



import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Spinner, Alert } from 'react-bootstrap';

// Card configurations in the order you want them displayed
const statCards = [
  {
    key: 'estateManagers',
    icon: "mdi:account-tie",
    iconColor: "primary",
    name: "Estate Managers",
    variant: "primary",
    endpoint: "/system-admin/view-estate-managers",
    // description: "Total estate managers registered"
  },
  {
    key: 'apartmentCategories',
    icon: "mdi:format-list-bulleted-type",
    iconColor: "success",
    name: "Apartment Categories",
    variant: "success",
    endpoint: "/system-admin/apartment/categories",
    // description: "Types of apartment categories"
  },
  {
    key: 'admins',
    icon: "mdi:shield-account",
    iconColor: "info",
    name: "System Admins",
    variant: "info",
    endpoint: "/system-admin/view-admins",
    // description: "Total system administrators"
  },
  {
    key: 'adminRoles',
    icon: "mdi:account-key",
    iconColor: "warning",
    name: "Admin Roles",
    variant: "warning",
    endpoint: "/system-admin/view-roles",
    // description: "Available admin role types"
  }
];

const StatCard = ({ config, data, isLoading, error }) => {
  const { icon, iconColor, name, variant, description } = config;
  const { amount = 0, change = 0, changeColor = 'success' } = data || {};

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-4">
          <div className="avatar-lg mx-auto mb-3">
            <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
              <IconifyIcon icon={icon} className="fs-24" />
            </span>
          </div>
          <Alert variant="danger" className="mb-0 py-2">
            Failed to load
          </Alert>
          <small className="text-muted mt-2 d-block">{description}</small>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Spinner animation="border" variant={variant} />
          <div className="mt-2">Loading {name.toLowerCase()}...</div>
          <small className="text-muted mt-1 d-block">{description}</small>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="mb-0 fw-bold mb-2">{amount}</h3>
            <p className="text-muted">{name}</p>
            <small className="text-muted d-block">{description}</small>
            {change > 0 && (
              <span className={`badge fs-12 badge-soft-${changeColor} mt-1`}>
                {change}%
              </span>
            )}
          </div>
          <div>
            <div className="avatar-lg d-inline-block me-1">
              <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-circle`}>
                <IconifyIcon icon={icon} className="fs-32" />
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const Stats = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Function to extract array from API response
  const extractArrayFromResponse = (data, endpointType) => {
    // Try different possible response structures
    const possibleDataPaths = [
      data.data?.data,    // { data: { data: [] } }
      data.data,          // { data: [] }
      data.results,       // { results: [] }
      data.items,         // { items: [] }
      data.users,         // { users: [] }
      data.admins,        // { admins: [] }
      data.roles,         // { roles: [] }
      data.categories,    // { categories: [] }
      data.managers       // { managers: [] }
    ];
    
    // Find the first array in possible paths
    let dataArray = possibleDataPaths.find(item => Array.isArray(item));
    
    // If no array found in structured paths, check if data is directly an array
    if (!dataArray && Array.isArray(data)) {
      dataArray = data;
    }
    
    return dataArray || [];
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.token) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setErrors({});
        setStats({}); // Clear previous stats

        // Create headers for fetch requests
        const headers = {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        };

        // Fetch all stats in parallel
        const fetchPromises = statCards.map(async (card) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api${card.endpoint}`,
              {
                method: "GET",
                headers: headers,
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch data'}`);
            }

            const data = await response.json();
            
            let amount = 0;
            
            // Extract array from response and count items
            const dataArray = extractArrayFromResponse(data, card.key);
            amount = Array.isArray(dataArray) ? dataArray.length : 0;
            
            return {
              key: card.key,
              data: {
                amount: amount,
                change: 0, // These APIs might not provide change data
                changeColor: 'success'
              }
            };
            
          } catch (error) {
            console.error(`Error fetching ${card.name}:`, error);
            
            // Record error
            setErrors(prev => ({
              ...prev,
              [card.key]: error.message || `Failed to load ${card.name}`
            }));
            
            return {
              key: card.key,
              data: {
                amount: 0,
                error: true
              }
            };
          }
        });

        // Wait for all fetches to complete
        const results = await Promise.allSettled(fetchPromises);
        
        // Process results
        const statsData = {};
        results.forEach((result, index) => {
          const card = statCards[index];
          if (result.status === 'fulfilled') {
            statsData[card.key] = result.value.data;
          } else {
            statsData[card.key] = {
              amount: 0,
              error: true
            };
          }
        });

        setStats(statsData);
        
      } catch (error) {
        console.error("Error in fetchStats:", error);
        setErrors(prev => ({
          ...prev,
          general: error.message || "Failed to load dashboard statistics"
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.token]);

  // Check if any data has loaded
  const hasLoadedData = Object.keys(stats).length > 0;

  return (
    <>
      {errors.general && (
        <Alert variant="danger" className="mb-3">
          <strong>Error:</strong> {errors.general}
        </Alert>
      )}
      
      {Object.keys(errors).filter(key => key !== 'general').length > 0 && (
        <Alert variant="warning" className="mb-3">
          <strong>Note:</strong> Some statistics could not be loaded. 
          You may need to refresh the page or check your connection.
        </Alert>
      )}
      
      <Row>
        {statCards.map((card) => (
          <Col key={card.key} lg={3} md={6} className="mb-3">
            <StatCard 
              config={card}
              data={stats[card.key] || { amount: 0 }}
              isLoading={loading && !stats[card.key]}
              error={errors[card.key]}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Stats;