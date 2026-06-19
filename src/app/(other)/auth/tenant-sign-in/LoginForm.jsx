import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormCheck, Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/useAuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const loginSchema = yup.object({
  identifier: yup
    .string()
    .required('Email or phone number is required')
    .test('email-or-phone', 'Must be a valid email or phone number', (value, context) => {
      if (!value) return false;
      const { loginType } = context.parent;
      
      if (loginType === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      } else {
        if (!value.startsWith('+')) return false;
        const phoneDigits = value.replace(/[^0-9]/g, '');
        return phoneDigits.length >= 10;
      }
    }),
  password: yup.string().required('Password is required'),
  loginType: yup.string(),
});

const TenantLoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('email');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const { tenantSlug } = useParams();

  const { control, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      loginType: 'email',
    },
    mode: 'onChange',
  });

  const identifier = watch('identifier');

  useEffect(() => {
    setValue('loginType', loginType);
    if (isSubmitted) {
      trigger('identifier');
    }
  }, [loginType, setValue, trigger, isSubmitted]);

  const onSubmit = async (formData) => {
    setIsSubmitted(true);
    
    const isValid = await trigger();
    
    if (!isValid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let loginId = formData.identifier;
    
    if (loginType === 'phone') {
      loginId = formData.identifier.replace(/\s/g, '');
      if (!loginId.startsWith('+')) {
        loginId = '+' + loginId;
      }
    }

    const payload = {
      password: formData.password,
      login_id: loginId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/login`,
        payload,
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      if (response.data) {
        saveSession({
          token: response.data.token,
          user: response.data.user || null,
          userType: 'tenant',
        });

        navigate(`/${tenantSlug}/tenant-dashboard`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginTypeToggle = (type) => {
    setLoginType(type);
    setValue('loginType', type);
    setValue('identifier', '');
    setError(null);
    setIsSubmitted(false);
  };

  const handlePhoneChange = (phone) => {
    let cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone && !cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    }
    setValue('identifier', cleanPhone, { shouldValidate: true });
  };

  const getDisplayValue = () => {
    if (!identifier) return '';
    if (!identifier.startsWith('+')) {
      return '+' + identifier;
    }
    return identifier;
  };

  const shouldShowError = (fieldName) => {
    return isSubmitted && errors[fieldName];
  };

  return (
    <>
      <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="mb-3">
          <div className="btn-group w-100" role="group">
            <Button
              variant={loginType === 'email' ? 'primary' : 'outline-secondary'}
              onClick={() => handleLoginTypeToggle('email')}
              className="w-50"
              type="button"
            >
              Email
            </Button>
            <Button
              variant={loginType === 'phone' ? 'primary' : 'outline-secondary'}
              onClick={() => handleLoginTypeToggle('phone')}
              className="w-50"
              type="button"
            >
              Phone Number
            </Button>
          </div>
        </div>

        {loginType === 'email' ? (
          <TextFormInput
            control={control}
            name="identifier"
            containerClassName="mb-3"
            label="Email Address"
            id="identifier-id"
            placeholder="Enter your email address"
            isInvalid={shouldShowError('identifier')}
            errorMessage={shouldShowError('identifier') ? errors.identifier?.message : ''}
          />
        ) : (
          <div className="mb-3">
            <label className="form-label" htmlFor="phone-input">
              Phone Number
            </label>
            <PhoneInput
              country={'ng'}
              value={getDisplayValue()}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'identifier',
                required: true,
                className: `form-control ${shouldShowError('identifier') ? 'is-invalid' : ''}`,
                id: 'phone-input',
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
            {shouldShowError('identifier') && (
              <Form.Text className="text-danger">
                {errors.identifier?.message}
              </Form.Text>
            )}
            <Form.Text className="text-muted">
              <small>Format: +234XXXXXXXXXX</small>
            </Form.Text>
          </div>
        )}

        <PasswordFormInput
          control={control}
          name="password"
          containerClassName="mb-3"
          placeholder="Enter your password"
          id="password-id"
          isInvalid={shouldShowError('password')}
          errorMessage={shouldShowError('password') ? errors.password?.message : ''}
          label={
            <>
              <Link to={`/${tenantSlug}/forgot-password`} className="float-end text-muted text-unline-dashed ms-1">
                Forgot password?
              </Link>
              <label className="form-label" htmlFor="password-id">Password</label>
            </>
          }
        />

        <div className="mb-3">
          <FormCheck label="Remember me" id="sign-in-tenant" />
        </div>

        <div className="mb-1 text-center d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>

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

        /* Dropdown menu styles */
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

        /* Scrollbar styles */
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

        /* Invalid state styling */
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

        /* Ensure input is clickable and typeable */
        .phone-input-container .form-control {
          pointer-events: auto !important;
          cursor: text !important;
        }

        .phone-input-container .form-control:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .phone-dropdown-menu {
            min-width: 250px !important;
            max-height: 250px !important;
          }
        }
      `}</style>
    </>
  );
};

export default TenantLoginForm;



