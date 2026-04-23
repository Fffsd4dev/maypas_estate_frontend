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