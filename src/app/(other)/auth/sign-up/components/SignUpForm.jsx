import React, { useState, useCallback } from 'react';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormCheck, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import { useAuthContext } from '@/context/useAuthContext';
import 'react-phone-input-2/lib/style.css';

const TenantSignUpForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const { tenantSlug } = useParams();

  const tenantSignUpSchema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    middle_name: yup.string(),
    email: yup.string().email('Must be a valid email'),
    phone: yup.string()
      .required('Phone number is required')
      .test('phone-format', 'Must be a valid phone number with country code', (value) => {
        if (!value) return false;
        const digits = value.replace(/[^0-9]/g, '');
        return value.startsWith('+') && digits.length >= 10;
      }),
    dob: yup.string().required('Date of birth is required'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required')
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(tenantSignUpSchema),
    defaultValues: {
      phone: '',
    }
  });

  // Handle phone change - clean and store
  const handlePhoneChange = useCallback((value) => {
    let cleanValue = value.replace(/\s/g, '');
    if (cleanValue && !cleanValue.startsWith('+')) {
      cleanValue = '+' + cleanValue;
    }
    setPhoneValue(cleanValue);
    setValue('phone', cleanValue, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        phone: formData.phone.replace(/\s/g, '')
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/sign-up`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      if (response.data) {
        const sessionData = {
          token: response.data.token,
          user: response.data.tenant || response.data.user,
          userType: 'tenant'
        };

        saveSession(sessionData);
        navigate(`/${tenantSlug}/sign-in`);
      }

    } catch (error) {
      // Display the actual error message from the backend
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = error.response.data;
        
        // Check for different error formats
        if (responseData.message) {
          setError(responseData.message);
        } else if (responseData.errors) {
          // Handle validation errors from backend
          const errorMessages = [];
          Object.entries(responseData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          setError(errorMessages.join(' | '));
        } else if (typeof responseData === 'string') {
          setError(responseData);
        } else {
          setError(JSON.stringify(responseData));
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <strong>Error:</strong> {error}
        </Alert>
      )}
      
      <div className="row">
        <div className="col-md-6">
          <TextFormInput 
            control={control} 
            name="first_name" 
            containerClassName="mb-3" 
            label="First Name" 
            id="first_name" 
            placeholder="Enter your first name" 
            isInvalid={!!errors.first_name}
            errorMessage={errors.first_name?.message}
          />
        </div>
        <div className="col-md-6">
          <TextFormInput 
            control={control} 
            name="last_name" 
            containerClassName="mb-3" 
            label="Last Name" 
            id="last_name" 
            placeholder="Enter your last name" 
            isInvalid={!!errors.last_name}
            errorMessage={errors.last_name?.message}
          />
        </div>
      </div>

      <TextFormInput 
        control={control} 
        name="middle_name" 
        containerClassName="mb-3" 
        label="Middle Name (Optional)" 
        id="middle_name" 
        placeholder="Enter your middle name" 
        isInvalid={!!errors.middle_name}
        errorMessage={errors.middle_name?.message}
      />

      <TextFormInput 
        control={control} 
        name="email" 
        containerClassName="mb-3" 
        label="Email (Optional)" 
        id="email-id" 
        placeholder="Enter your email (optional)" 
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />

      {/* Phone Number with Country Code Dropdown */}
      <div className="mb-3">
        <Form.Label>Phone Number *</Form.Label>
        <PhoneInput
          country={'ng'}
          value={phoneValue}
          onChange={handlePhoneChange}
          inputProps={{
            name: 'phone',
            required: true,
            className: `form-control ${errors.phone ? 'is-invalid' : ''}`,
            placeholder: 'Enter phone number',
          }}
          containerClass="phone-input-container"
          inputClass="form-control"
          buttonClass="phone-dropdown-button"
          dropdownClass="phone-dropdown-menu"
          enableSearch={true}
          disableSearchIcon={false}
          searchPlaceholder="Search country..."
          countryCodeEditable={true}
          preferredCountries={['ng', 'gh', 'ke', 'za', 'eg']}
          regions={['africa']}
          disableCountryCode={false}
          enableAreaCodes={true}
          enableLongNumbers={true}
          autocompleteSearch={true}
        />
        {errors.phone && (
          <Form.Text className="text-danger">{errors.phone?.message}</Form.Text>
        )}
      </div>

      <TextFormInput 
        control={control} 
        name="dob" 
        containerClassName="mb-3" 
        label="Date of Birth" 
        id="dob" 
        placeholder="YYYY-MM-DD"
        type="date"
        isInvalid={!!errors.dob}
        errorMessage={errors.dob?.message}
      />

      <PasswordFormInput 
        control={control} 
        name="password" 
        containerClassName="mb-3" 
        placeholder="Enter your password" 
        id="password-id" 
        label="Password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />

      <PasswordFormInput 
        control={control} 
        name="password_confirmation" 
        containerClassName="mb-3" 
        placeholder="Confirm your password" 
        id="password-confirmation-id" 
        label="Confirm Password"
        isInvalid={!!errors.password_confirmation}
        errorMessage={errors.password_confirmation?.message}
      />
      
      <div className="mb-3">
        <FormCheck 
          label="I accept Terms and Conditions" 
          id="termAndCondition" 
        />
      </div>
      
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating Tenant Account...' : 'Sign Up as Tenant'}
        </Button>
      </div>

      {/* Styles for Phone Input */}
      <style>{`
        .phone-input-container {
          position: relative;
          width: 100% !important;
        }

        .phone-input-container .form-control {
          padding-left: 90px !important;
          height: calc(1.5em + 1rem + 2px) !important;
          width: 100% !important;
          border-radius: 0.375rem !important;
          border: 1px solid #ced4da !important;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
          font-size: 0.875rem !important;
          color: #212529 !important;
          background-color: #ffffff !important;
          pointer-events: auto !important;
          cursor: text !important;
        }

        .phone-input-container .form-control:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }

        .phone-input-container .form-control::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
        }

        .phone-dropdown-button {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          height: calc(1.5em + 1rem + 2px) !important;
          border-radius: 0.375rem 0 0 0.375rem !important;
          padding: 0 8px !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          background: #f8f9fa !important;
          border: 1px solid #ced4da !important;
          border-right: none !important;
          z-index: 5 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          min-width: 80px !important;
          justify-content: center !important;
        }

        .phone-dropdown-button:hover {
          background: #e9ecef !important;
          border-color: #adb5bd !important;
        }

        .phone-dropdown-button .selected-flag {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          padding: 0 !important;
        }

        .phone-dropdown-button .selected-flag img {
          width: 20px !important;
          height: 15px !important;
          object-fit: cover !important;
          border-radius: 2px !important;
        }

        .phone-dropdown-button .selected-flag .country-code {
          font-size: 14px !important;
          margin-left: 2px !important;
          color: #212529 !important;
          font-weight: 500 !important;
        }

        .phone-dropdown-button .selected-flag .arrow {
          margin-left: 4px !important;
          border-left: 4px solid transparent !important;
          border-right: 4px solid transparent !important;
          border-top: 4px solid #6c757d !important;
          transition: transform 0.2s ease !important;
        }

        .phone-dropdown-button.open .selected-flag .arrow {
          transform: rotate(180deg) !important;
        }

        .phone-dropdown-menu {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          z-index: 1000 !important;
          width: 100% !important;
          min-width: 280px !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          background: #ffffff !important;
          border: 1px solid #ced4da !important;
          border-radius: 0.375rem !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          margin-top: 4px !important;
          padding: 0 !important;
        }

        .phone-dropdown-menu .search {
          padding: 0 !important;
          border-bottom: 1px solid #e9ecef !important;
          background: #ffffff !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 5 !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
        }

        .phone-dropdown-menu .search input {
          width: 100% !important;
          padding: 10px 12px !important;
          border: none !important;
          border-radius: 0 !important;
          font-size: 14px !important;
          background: #ffffff !important;
          color: #212529 !important;
          outline: none !important;
        }

        .phone-dropdown-menu .search input::placeholder {
          color: #adb5bd !important;
        }

        .phone-dropdown-menu .search input:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .phone-dropdown-menu .country-list {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .phone-dropdown-menu .country-list .country {
          display: flex !important;
          align-items: center !important;
          padding: 8px 12px !important;
          cursor: pointer !important;
          transition: background 0.15s ease !important;
          gap: 10px !important;
          text-align: left !important;
          background: #ffffff !important;
          border-bottom: 1px solid #f8f9fa !important;
        }

        .phone-dropdown-menu .country-list .country:hover {
          background: #f1f3f5 !important;
        }

        .phone-dropdown-menu .country-list .country .flag {
          display: flex !important;
          align-items: center !important;
          flex-shrink: 0 !important;
        }

        .phone-dropdown-menu .country-list .country .flag img {
          width: 24px !important;
          height: 16px !important;
          object-fit: cover !important;
          border-radius: 2px !important;
        }

        .phone-dropdown-menu .country-list .country .country-name {
          flex: 1 !important;
          font-size: 14px !important;
          color: #212529 !important;
          text-align: left !important;
          font-weight: 400 !important;
        }

        .phone-dropdown-menu .country-list .country .dial-code {
          font-size: 14px !important;
          color: #6c757d !important;
          text-align: right !important;
          font-weight: 400 !important;
        }

        .phone-dropdown-menu .country-list .country.preferred {
          background: #f8f9fa !important;
        }

        .phone-dropdown-menu .country-list .country.preferred .country-name {
          font-weight: 500 !important;
        }

        .phone-dropdown-menu .country-list .country.preferred:hover {
          background: #e9ecef !important;
        }

        .phone-dropdown-menu .divider {
          height: 1px !important;
          background: #e9ecef !important;
          margin: 4px 0 !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar {
          width: 6px !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-track {
          background: #f8f9fa !important;
          border-radius: 0 0.375rem 0.375rem 0 !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-thumb {
          background: #ced4da !important;
          border-radius: 3px !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #adb5bd !important;
        }

        .phone-input-container .form-control.is-invalid {
          border-color: #dc3545 !important;
          padding-right: calc(1.5em + 0.75rem) !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right calc(0.375em + 0.1875rem) center !important;
          background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem) !important;
        }

        .phone-input-container .form-control.is-invalid + .phone-dropdown-button {
          border-color: #dc3545 !important;
        }

        .phone-input-container .form-control.is-invalid:focus {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
        }

        @media (max-width: 576px) {
          .phone-dropdown-menu {
            min-width: 250px !important;
            max-height: 250px !important;
          }
          .phone-dropdown-button {
            min-width: 70px !important;
            padding: 0 6px !important;
          }
          .phone-dropdown-button .selected-flag .country-code {
            font-size: 12px !important;
          }
          .phone-input-container .form-control {
            padding-left: 80px !important;
            font-size: 0.8125rem !important;
          }
        }
      `}</style>
    </form>
  );
};

export default TenantSignUpForm;