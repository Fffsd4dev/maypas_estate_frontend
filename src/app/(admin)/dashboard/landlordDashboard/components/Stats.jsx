import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import { useParams } from "react-router-dom";
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Spinner, Alert } from 'react-bootstrap';

// Card configurations in the order you want them displayed
const statCards = [
  {
    key: 'tenants',
    icon: "mdi:account-multiple",
    iconColor: "primary",
    name: "Tenants",
    variant: "primary",
    endpoint: "/tenants/view",
    description: "Total registered tenants"
  },
  {
    key: 'apartments',
    icon: "mdi:home-group",
    iconColor: "success",
    name: "Apartments",
    variant: "success",
    endpoint: "/apartments",
    description: "Total apartments available"
  },
  {
    key: 'landlords',
    icon: "mdi:account-tie",
    iconColor: "info",
    name: "Landlords",
    variant: "info",
    endpoint: "/view-landlords",
    description: "Total property owners"
  },
  {
    key: 'complaints',
    icon: "mdi:alert-circle",
    iconColor: "warning",
    name: "Complaints",
    variant: "warning",
    endpoint: "/landlord/complaint/view-all",
    description: "Total complaints logged"
  },
  {
    key: 'maintenance',
    icon: "mdi:toolbox",
    iconColor: "danger",
    name: "Maintenance",
    variant: "danger",
    endpoint: "/landlord/maintenance/view-all",
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
          <Alert variant="danger" className="mb-2 py-2">
            {error}
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

  const extractArrayFromResponse = (data, endpointType) => {
    if (endpointType === 'apartments') {
      if (data.data && Array.isArray(data.data)) {
        const allApartments = data.data.flatMap(category => 
          category.apartments && Array.isArray(category.apartments) ? category.apartments : []
        );
        return allApartments;
      }
    }
    
    const possibleDataPaths = [
      data.data?.data,
      data.data?.data?.data,
      data.data,
      data.results,
      data.items,
      data.users?.data,
      data.users,
      data.tenants,
      data.apartments,
      data.landlords,
      data.complaints,
      data.maintenance,
      data.requests,
      data.categories,
      data.managers
    ];
    
    let dataArray = possibleDataPaths.find(item => Array.isArray(item));
    
    if (!dataArray && Array.isArray(data)) {
      dataArray = data;
    }
    
    return dataArray || [];
  };

  const getCountFromResponse = (data, endpointType) => {
    if (endpointType === 'complaints') {
      if (data.data?.total !== undefined) {
        return data.data.total;
      }
      if (data.data?.data && Array.isArray(data.data.data)) {
        return data.data.data.length;
      }
    }
    
    if (endpointType === 'maintenance') {
      if (data.data?.total !== undefined) {
        return data.data.total;
      }
      if (data.data?.data && Array.isArray(data.data.data)) {
        return data.data.data.length;
      }
    }
    
    if (endpointType === 'apartments') {
      const apartmentsArray = extractArrayFromResponse(data, endpointType);
      return Array.isArray(apartmentsArray) ? apartmentsArray.length : 0;
    }
    
    if (endpointType === 'tenants' && data.users) {
      if (data.users.total !== undefined) {
        return data.users.total;
      }
      const tenantsArray = extractArrayFromResponse(data, endpointType);
      return Array.isArray(tenantsArray) ? tenantsArray.length : 0;
    }
    
    if (data.data?.total !== undefined) {
      return data.data.total;
    }
    
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
        setStats({});

        const headers = {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        };

        const fetchPromises = statCards.map(async (card) => {
          try {
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}${card.endpoint}`;
            
            const response = await fetch(apiUrl, {
              method: "GET",
              headers: headers,
            });

            if (!response.ok) {
              let errorMessage = `Failed to load ${card.name}`;
              
              try {
                const errorData = await response.json();
                errorMessage = errorData.message || 
                              errorData.error || 
                              errorData.detail || 
                              errorData.msg ||
                              `HTTP ${response.status}: ${response.statusText}`;
                
                if (response.status === 403 || response.status === 401) {
                  if (errorMessage.toLowerCase().includes('subscription')) {
                    errorMessage = `Subscription Required: ${errorMessage}`;
                  } else if (errorMessage.toLowerCase().includes('access')) {
                    errorMessage = `🔒 Access Denied: ${errorMessage}`;
                  }
                } else if (response.status === 404) {
                  errorMessage = `❌ Not Found: ${errorMessage}`;
                }
              } catch (e) {
                try {
                  const errorText = await response.text();
                  if (errorText) {
                    errorMessage = errorText;
                  } else {
                    errorMessage = `HTTP ${response.status}: ${response.statusText || 'Failed to fetch data'}`;
                  }
                } catch (textError) {
                  errorMessage = `HTTP ${response.status}: ${response.statusText || 'Failed to fetch data'}`;
                }
              }
              
              throw new Error(errorMessage);
            }

            const data = await response.json();
            
            let amount = getCountFromResponse(data, card.key);
            
            if (card.key === 'maintenance') {
              const dataArray = extractArrayFromResponse(data, card.key);
              if (Array.isArray(dataArray)) {
                // Use the count as is
              }
            }
            
            if (card.key === 'complaints') {
              const dataArray = extractArrayFromResponse(data, card.key);
              if (Array.isArray(dataArray)) {
                // Use the count as is
              }
            }
            
            return {
              key: card.key,
              data: {
                amount: amount,
                change: 0,
                changeColor: 'success'
              }
            };
            
          } catch (error) {
            console.error(`Error fetching ${card.name}:`, error);
            
            let errorMsg = error.message || `Failed to load ${card.name}`;
            
            if (errorMsg.toLowerCase().includes('subscription') || 
                errorMsg.toLowerCase().includes('subscribe') ||
                errorMsg.toLowerCase().includes('plan')) {
              errorMsg = `⚠️ ${errorMsg}`;
            } else if (errorMsg.toLowerCase().includes('permission') || 
                       errorMsg.toLowerCase().includes('access')) {
              errorMsg = `🔒 ${errorMsg}`;
            }
            
            setErrors(prev => ({
              ...prev,
              [card.key]: errorMsg
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

        const results = await Promise.allSettled(fetchPromises);
        
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
            if (result.reason) {
              setErrors(prev => ({
                ...prev,
                [card.key]: result.reason.message || `Failed to load ${card.name}`
              }));
            }
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