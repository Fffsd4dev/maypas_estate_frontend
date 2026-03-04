import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import { useParams } from "react-router-dom";
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Spinner, Alert } from 'react-bootstrap';

// Card configurations in the order you want them displayed
const statCards = [
  {
    key: 'complaints',
    icon: "mdi:alert-circle",
    iconColor: "warning",
    name: "Complaints",
    variant: "warning",
    endpoint: "/complaint/view-all",
    description: "Total complaints logged"
  },
  {
    key: 'maintenance',
    icon: "mdi:toolbox",
    iconColor: "danger",
    name: "Maintenance",
    variant: "danger",
    endpoint: "/maintenance/view-all",
    description: "Active maintenance requests"
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
  const { tenantSlug } = useParams();
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
      data.users?.data,   // { users: { data: [] } }
      data.users,         // { users: [] }
      data.tenants,       // { tenants: [] }
      data.apartments,    // { apartments: [] }
      data.landlords,     // { landlords: [] }
      data.complaints,    // { complaints: [] }
      data.maintenance,   // { maintenance: [] }
      data.requests,      // { requests: [] }
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

  // Function to get count from API response
  const getCountFromResponse = (data, endpointType) => {
    // For endpoints, extract array and count
    const dataArray = extractArrayFromResponse(data, endpointType);
    return Array.isArray(dataArray) ? dataArray.length : 0;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.token) {
          setLoading(false);
          return;
        }

        if (!tenantSlug) {
          throw new Error('Tenant slug not found in URL');
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
            // Build the dynamic URL with tenantSlug from URL params
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}${card.endpoint}`;
            
            const response = await fetch(apiUrl, {
              method: "GET",
              headers: headers,
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch data'}`);
            }

            const data = await response.json();
            
            let amount = getCountFromResponse(data, card.key);
            
            // For maintenance requests, filter only active ones
            if (card.key === 'maintenance') {
              const dataArray = extractArrayFromResponse(data, card.key);
              if (Array.isArray(dataArray)) {
                const activeMaintenance = dataArray.filter(item => {
                  const status = item.status?.toLowerCase() || 
                                item.request_status?.toLowerCase() ||
                                item.maintenance_status?.toLowerCase();
                  return status === 'pending' || 
                         status === 'in-progress' || 
                         status === 'active' ||
                         status === 'open' ||
                         status === 'processing' ||
                         status === 'submitted' ||
                         status === 'new';
                });
                amount = activeMaintenance.length;
              }
            }
            
            // For complaints, filter by status (open/pending complaints)
            if (card.key === 'complaints') {
              const dataArray = extractArrayFromResponse(data, card.key);
              if (Array.isArray(dataArray)) {
                const openComplaints = dataArray.filter(item => {
                  const status = item.status?.toLowerCase() || 
                                item.complaint_status?.toLowerCase();
                  return status === 'open' || 
                         status === 'pending' || 
                         status === 'investigating' ||
                         status === 'new' ||
                         status === 'received' ||
                         !status; // If no status, include it
                });
                amount = openComplaints.length;
              }
            }
            
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

    if (tenantSlug) {
      fetchStats();
    } else {
      setLoading(false);
      setErrors(prev => ({
        ...prev,
        general: "Tenant slug is required to load statistics"
      }));
    }
  }, [user?.token, tenantSlug]);

  // Show error if tenantSlug is missing
  if (!tenantSlug) {
    return (
      <Alert variant="danger" className="mb-3">
        <strong>Error:</strong> Tenant slug not found in URL. Please navigate to a valid tenant dashboard.
      </Alert>
    );
  }

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
          <Col key={card.key} lg={6} md={6} className="mb-3">
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