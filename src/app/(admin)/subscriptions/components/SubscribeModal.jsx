// components/SubscribeModal.tsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner, Card } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const SubscribeModal = ({ 
  show, 
  handleClose, 
  refreshSubscriptions,
  planToSubscribe = null,
  currentSubscription = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    start_date: '',
    number_months: 1,
    payment_source: 'paystack'
  });
  const [priceDetails, setPriceDetails] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paystack');
  const [showThankYou, setShowThankYou] = useState(false);
  const [paystackPopup, setPaystackPopup] = useState(null);

  // Payment methods configuration
  const paymentMethods = [
    { 
      id: 'paystack', 
      name: 'Paystack', 
      icon: 'bx:credit-card',
      active: true,
      description: 'Pay with Paystack (Card, Bank Transfer, USSD)'
    },
    { 
      id: 'fidelity', 
      name: 'Fidelity Bank', 
      icon: 'bx:bank',
      active: false,
      description: 'Coming soon'
    },
    { 
      id: 'stripe', 
      name: 'Stripe', 
      icon: 'bx:credit-card-front',
      active: false,
      description: 'Coming soon'
    }
  ];

  // Load Paystack script
  useEffect(() => {
    // Check if Paystack script is already loaded
    if (!document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        console.log('Paystack script loaded');
      };
    }
  }, []);

  useEffect(() => {
    if (show && planToSubscribe) {
      // Reset all states when modal opens
      setFormData({
        start_date: new Date().toISOString().split('T')[0],
        number_months: 1,
        payment_source: 'paystack'
      });
      setSelectedPaymentMethod('paystack');
      setPriceDetails(null);
      setError(null);
      setSuccess(false);
      setCalculatingPrice(false);
      setLoading(false);
      setShowThankYou(false);
    }
  }, [show, planToSubscribe]);

  // Check for payment callback when component mounts (for redirect flow)
  useEffect(() => {
    const checkPaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference');
      const trxref = urlParams.get('trxref');
      const paymentRef = reference || trxref;
      
      if (paymentRef && !success && show) {
        console.log('Payment callback detected:', paymentRef);
        
        // Get pending subscription data
        const pendingDataStr = localStorage.getItem('pending_subscription');
        
        if (pendingDataStr) {
          const pendingData = JSON.parse(pendingDataStr);
          
          // Restore form data
          setFormData({
            start_date: pendingData.start_date,
            number_months: pendingData.number_months,
            payment_source: pendingData.payment_source
          });
          setSelectedPaymentMethod(pendingData.payment_source);
          
          // Confirm the payment
          await confirmPayment(paymentRef, pendingData);
          
          // Clean up URL without refreshing the page
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Clear pending subscription
          localStorage.removeItem('pending_subscription');
        }
      }
    };
    
    checkPaymentCallback();
  }, [window.location.search, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset price details when form changes
    setPriceDetails(null);
    setError(null);
  };

  const handlePaymentMethodChange = (methodId) => {
    const selectedMethod = paymentMethods.find(m => m.id === methodId);
    if (selectedMethod && !selectedMethod.active) {
      setError(`${selectedMethod.name} is coming soon. Please use Paystack for now.`);
      return;
    }
    
    setSelectedPaymentMethod(methodId);
    setFormData(prev => ({
      ...prev,
      payment_source: methodId
    }));
    setError(null);
  };

  const calculatePrice = async () => {
    if (!formData.start_date || !formData.number_months) {
      setError('Please fill in all fields');
      return;
    }

    setCalculatingPrice(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!planToSubscribe?.id) {
        throw new Error('Plan ID not found');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/plan/charge`,
        {
          plan_id: planToSubscribe.id,
          start_date: formData.start_date,
          number_months: parseInt(formData.number_months)
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      if (response.data) {
        setPriceDetails(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to calculate price');
      console.error('Error calculating price:', error);
    } finally {
      setCalculatingPrice(false);
    }
  };

  const confirmPayment = async (reference, pendingData) => {
    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/payment/confirm`,
        {
          plan_id: pendingData?.plan_id || planToSubscribe.id,
          start_date: pendingData?.start_date || formData.start_date,
          number_months: parseInt(pendingData?.number_months || formData.number_months),
          payment_source: pendingData?.payment_source || formData.payment_source,
          payment_ref: reference
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );

      if (response.data && response.data.status) {
        setSuccess(true);
        setShowThankYou(true);
        
        setTimeout(() => {
          setShowThankYou(false);
          handleClose();
          if (refreshSubscriptions) {
            refreshSubscriptions();
          }
          setSuccess(false);
          setLoading(false);
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError(error.response?.data?.message || 'Failed to confirm payment. Please contact support.');
      setLoading(false);
    }
  };

  // Paystack inline payment handler
  const handlePaystackPayment = async () => {
    if (!priceDetails) {
      setError('Please calculate the price first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!planToSubscribe?.id) {
        throw new Error('Plan ID not found');
      }

      // Get the current page URL for callback
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}${window.location.pathname}`;

      // Store subscription data in localStorage before payment
      const subscriptionData = {
        plan_id: planToSubscribe.id,
        plan_name: planToSubscribe.name,
        start_date: formData.start_date,
        number_months: formData.number_months,
        payment_source: formData.payment_source,
        tenantSlug: tenantSlug,
        amount: calculateTotalPrice(),
        timestamp: new Date().getTime()
      };
      localStorage.setItem('pending_subscription', JSON.stringify(subscriptionData));

      // Initiate payment to get access code
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/payment/initiate`,
        {
          plan_id: planToSubscribe.id,
          start_date: formData.start_date,
          number_months: parseInt(formData.number_months),
          payment_source: formData.payment_source,
          callback_url: callbackUrl,
          amount: calculateTotalPrice()
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );

      if (response.data && response.data.status && response.data.data) {
        const paymentData = response.data.data;
        
        // For Paystack inline payment, use the access_code
        if (formData.payment_source === 'paystack' && paymentData.access_code) {
          // Initialize Paystack inline popup
          if (typeof PaystackPop !== 'undefined') {
            const popup = new PaystackPop();
            
            // Open inline payment with access code
            popup.resumeTransaction(paymentData.access_code, {
              onSuccess: (response) => {
                // Confirm the payment with the reference
                confirmPayment(response.reference, subscriptionData);
                setLoading(false);
              },
              onCancel: () => {
                setError('Payment was canceled');
                setLoading(false);
                // Clear pending subscription
                localStorage.removeItem('pending_subscription');
              },
              onError: (error) => {
                console.error('Payment error:', error);
                setError(error.message || 'Payment failed. Please try again.');
                setLoading(false);
                // Clear pending subscription
                localStorage.removeItem('pending_subscription');
              }
            });
          } else {
            throw new Error('Paystack library not loaded');
          }
        } else {
          throw new Error('Invalid payment response from server');
        }
      } else {
        throw new Error(response.data?.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
      setLoading(false);
      // Clear pending subscription on error
      localStorage.removeItem('pending_subscription');
    }
  };

  const calculateMonthlyPrice = () => {
    if (!planToSubscribe) return 0;
    const fee = parseFloat(planToSubscribe.fee);
    const discount = parseFloat(planToSubscribe.discount) || 0;
    return fee - (fee * (discount / 100));
  };

  const calculateTotalPrice = () => {
    if (!planToSubscribe || !formData.number_months) return 0;
    const monthlyPrice = calculateMonthlyPrice();
    const total = monthlyPrice * formData.number_months;
    return total.toFixed(2);
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toFixed(2)}`;
  };

  const getPlanChangeType = () => {
    if (!currentSubscription || !planToSubscribe) return null;
    
    const currentFee = parseFloat(currentSubscription.monthly_fee || currentSubscription.amount || 0);
    const newPlanFee = calculateMonthlyPrice();
    
    if (newPlanFee > currentFee) {
      return 'upgrade';
    } else if (newPlanFee < currentFee) {
      return 'downgrade';
    }
    return 'same';
  };

  const getPlanChangeDetails = () => {
    if (!currentSubscription || !planToSubscribe) return null;
    
    const currentFee = parseFloat(currentSubscription.monthly_fee || currentSubscription.amount || 0);
    const newPlanFee = calculateMonthlyPrice();
    const difference = Math.abs(newPlanFee - currentFee);
    const changeType = getPlanChangeType();
    
    if (changeType === 'upgrade') {
      return {
        title: 'Upgrading Your Plan',
        description: `You're upgrading from ${currentSubscription.plan_name} to ${planToSubscribe.name}.`,
        difference: `+${formatCurrency(difference)}/month`,
        icon: 'bx:trending-up',
        variant: 'success',
        message: 'Your new plan will take effect immediately after payment. Enjoy enhanced features!'
      };
    } else if (changeType === 'downgrade') {
      return {
        title: 'Downgrading Your Plan',
        description: `You're switching from ${currentSubscription.plan_name} to ${planToSubscribe.name}.`,
        difference: `-${formatCurrency(difference)}/month`,
        icon: 'bx:trending-down',
        variant: 'warning',
        // message: 'Your new plan will take effect at the start of your next billing cycle. Any remaining balance will be credited to your account.'
      };
    }
    return null;
  };

  const getFeatureComparison = () => {
    if (!currentSubscription || !planToSubscribe) return [];
    
    const features = [
      { 
        name: 'Staff Limit', 
        current: currentSubscription.staff_limit || '∞', 
        new: planToSubscribe.number_of_staff || '∞',
        icon: 'bx:user'
      },
      { 
        name: 'Admin Limit', 
        current: currentSubscription.admin_limit || '∞', 
        new: planToSubscribe.number_of_admins || '∞',
        icon: 'bx:user-check'
      },
      { 
        name: 'Agent Limit', 
        current: currentSubscription.agent_limit || '∞', 
        new: planToSubscribe.number_of_agents || '∞',
        icon: 'bx:user-voice'
      },
      { 
        name: 'Apartment Limit', 
        current: currentSubscription.apartment_limit || '∞', 
        new: planToSubscribe.number_of_apartments || '∞',
        icon: 'bx:home'
      },
      { 
        name: 'Branch Limit', 
        current: currentSubscription.branch_limit || '∞', 
        new: planToSubscribe.number_of_branches || '∞',
        icon: 'bx:store'
      },
      { 
        name: 'Location Limit', 
        current: currentSubscription.location_limit || '∞', 
        new: planToSubscribe.number_of_locations || '∞',
        icon: 'bx:map'
      }
    ];
    
    return features;
  };

  // Thank You Popup Component
  const ThankYouPopup = () => (
    <div className="thankyou-popup-overlay" onClick={() => setShowThankYou(false)}>
      <div className="thankyou-popup-content" onClick={(e) => e.stopPropagation()}>
        <IconifyIcon icon="bx:check-circle" className="success-icon" />
        <h3>Thank You!</h3>
        <p>Your payment was successful. Your subscription has been activated.</p>
        <button className="btn btn-primary" onClick={() => setShowThankYou(false)}>
          Close
        </button>
      </div>
      <style jsx>{`
        .thankyou-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thankyou-popup-content {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          max-width: 420px;
          text-align: center;
        }
        .success-icon {
          font-size: 48px;
          color: #28a745;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );

  if (!planToSubscribe) return null;

  const planChangeDetails = getPlanChangeDetails();
  const featureComparison = getFeatureComparison();

  return (
    <>
      <Modal show={show && !showThankYou} onHide={handleClose} centered size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {planChangeDetails ? (
              <div className="d-flex align-items-center">
                <IconifyIcon icon={planChangeDetails.icon} className={`me-2 text-${planChangeDetails.variant}`} />
                {planChangeDetails.title}: {planToSubscribe.name}
              </div>
            ) : (
              `Subscribe to ${planToSubscribe.name}`
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {!error && !showThankYou && planToSubscribe && (
            <>
              {/* Plan Change Alert for Upgrade/Downgrade */}
              {planChangeDetails && (
                <Alert variant={planChangeDetails.variant} className="mb-3">
                  <div className="d-flex align-items-start">
                    <IconifyIcon icon={planChangeDetails.icon} className="me-2 mt-1" />
                    <div>
                      <strong>{planChangeDetails.title}</strong>
                      <p className="mb-1">{planChangeDetails.description}</p>
                      <small>{planChangeDetails.message}</small>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Feature Comparison for Upgrade/Downgrade */}
              {currentSubscription && featureComparison.length > 0 && (
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3">Feature Comparison</h6>
                  <Row className="g-2">
                    {featureComparison.map((feature, index) => {
                      const hasChanged = feature.current !== feature.new;
                      const isImprovement = parseInt(feature.new) > parseInt(feature.current) || 
                                          (feature.current === '∞' && feature.new !== '∞') ||
                                          (feature.new === '∞' && feature.current !== '∞');
                      
                      return (
                        <Col md={6} key={index}>
                          <div className="d-flex align-items-center p-2 border rounded bg-white">
                            <IconifyIcon icon={feature.icon} className="me-2 text-muted" />
                            <div className="flex-grow-1">
                              <small className="text-muted d-block">{feature.name}</small>
                              <div className="d-flex align-items-center">
                                <span className={hasChanged ? 'text-decoration-line-through text-muted' : ''}>
                                  {feature.current}
                                </span>
                                {hasChanged && (
                                  <>
                                    <IconifyIcon icon="bx:right-arrow-alt" className="mx-2 text-muted" />
                                    <span className={`fw-semibold ${isImprovement ? 'text-success' : 'text-warning'}`}>
                                      {feature.new}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}

              {/* Plan Details Section */}
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-3">Plan Details</h6>
                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>Plan Name:</strong> {planToSubscribe.name}
                    </div>
                    <div className="mb-2">
                      <strong>Monthly Fee:</strong> {formatCurrency(planToSubscribe.fee)}
                    </div>
                    <div className="mb-2">
                      <strong>Discount:</strong> {planToSubscribe.discount}%
                    </div>
                    {planChangeDetails && (
                      <div className="mb-2">
                        <strong>Price Change:</strong>
                        <span className={`ms-2 text-${planChangeDetails.variant}`}>
                          {planChangeDetails.difference}
                        </span>
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>Discounted Monthly Price:</strong>
                      <span className="text-success ms-2">
                        {formatCurrency(calculateMonthlyPrice())}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Total for {formData.number_months} month(s):</strong>
                      <span className="text-primary ms-2">
                        {priceDetails ? formatCurrency(calculateTotalPrice()) : 'Calculate to see'}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Features Section */}
              <div className="mb-4">
                <h6 className="mb-3">Plan Features</h6>
                <Row>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:user" className="me-1" />
                      <strong>Staff Limit:</strong> {planToSubscribe.number_of_staff || 'Unlimited'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:user-check" className="me-1" />
                      <strong>Admin Limit:</strong> {planToSubscribe.number_of_admins || 'Unlimited'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:user-voice" className="me-1" />
                      <strong>Agent Limit:</strong> {planToSubscribe.number_of_agents || 'Unlimited'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:home" className="me-1" />
                      <strong>Apartment Limit:</strong> {planToSubscribe.number_of_apartments || 'Unlimited'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:store" className="me-1" />
                      <strong>Branch Limit:</strong> {planToSubscribe.number_of_branches || 'Unlimited'}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <IconifyIcon icon="bx:map" className="me-1" />
                      <strong>Location Limit:</strong> {planToSubscribe.number_of_locations || 'Unlimited'}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Subscription Form */}
              <Form>
                <h6 className="mb-3">Subscription Details</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <Form.Text className="text-muted">
                        Subscription will start on this date
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Months *</Form.Label>
                      <Form.Control
                        type="number"
                        name="number_months"
                        value={formData.number_months}
                        onChange={handleChange}
                        min="1"
                        max="24"
                        required
                      />
                      <Form.Text className="text-muted">
                        Choose duration (1-24 months)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mb-4">
                  <Button 
                    variant="info" 
                    onClick={calculatePrice}
                    disabled={calculatingPrice || !formData.start_date || !formData.number_months}
                    className="w-100"
                    type="button"
                  >
                    {calculatingPrice ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        Calculating Price...
                      </>
                    ) : (
                      <>
                        <IconifyIcon icon="bx:calculator" className="me-1" />
                        Calculate Total Price
                      </>
                    )}
                  </Button>
                </div>

                {priceDetails && (
                  <Alert variant="success" className="mt-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Total Amount Due:</strong>
                        <div className="mt-1">
                          <span className="h4">{formatCurrency(calculateTotalPrice())}</span>
                          <small className="text-muted ms-2">
                            (includes {planToSubscribe.discount}% discount)
                          </small>
                        </div>
                        {planChangeDetails && (
                          <small className={`d-block mt-1 text-${planChangeDetails.variant}`}>
                            <IconifyIcon icon={planChangeDetails.icon} className="me-1" />
                            {planChangeDetails.difference} per month compared to current plan
                          </small>
                        )}
                      </div>
                      <IconifyIcon icon="bx:check-circle" className="h2 text-success" />
                    </div>
                  </Alert>
                )}

                {/* Payment Method Selection */}
                {priceDetails && (
                  <>
                    <h6 className="mb-3">Select Payment Method</h6>
                    <Row>
                      {paymentMethods.map((method) => (
                        <Col md={4} key={method.id} className="mb-3">
                          <Card 
                            className={`payment-method-card ${selectedPaymentMethod === method.id ? 'border-primary' : ''}`}
                            style={{ 
                              cursor: method.active ? 'pointer' : 'not-allowed',
                              opacity: method.active ? 1 : 0.6,
                              border: selectedPaymentMethod === method.id ? '2px solid #0d6efd' : '1px solid #dee2e6'
                            }}
                            onClick={() => handlePaymentMethodChange(method.id)}
                          >
                            <Card.Body className="text-center">
                              <IconifyIcon 
                                icon={method.icon} 
                                className="h2 mb-2" 
                                style={{ color: method.active ? '#0d6efd' : '#6c757d' }}
                              />
                              <div className="fw-semibold">{method.name}</div>
                              <small className="text-muted">{method.description}</small>
                              {selectedPaymentMethod === method.id && method.active && (
                                <div className="mt-2">
                                  <IconifyIcon icon="bx:check-circle" className="text-success" />
                                </div>
                              )}
                              {!method.active && (
                                <div className="mt-2">
                                  <span className="badge bg-warning">Coming Soon</span>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    
                    {/* Paystack Payment Button */}
                    {selectedPaymentMethod === 'paystack' && priceDetails && (
                      <div className="mt-3">
                        <Button 
                          variant={planChangeDetails?.variant === 'success' ? 'success' : 'primary'}
                          onClick={handlePaystackPayment}
                          disabled={loading}
                          className="w-100"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-1" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <IconifyIcon icon="bx:credit-card" className="me-1" />
                              {planChangeDetails ? (
                                <>Pay with Paystack - {planChangeDetails.title}</>
                              ) : (
                                <>Pay with Paystack</>
                              )}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Form>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>

        <style>{`
          .payment-method-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .payment-method-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </Modal>

      {/* Thank You Popup */}
      {showThankYou && <ThankYouPopup />}
    </>
  );
};

export default SubscribeModal;