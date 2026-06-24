// import { useNavigate, useParams } from 'react-router-dom';
// import PasswordFormInput from '@/components/form/PasswordFormInput';
// import TextFormInput from '@/components/form/TextFormInput';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Button, InputGroup, Form } from 'react-bootstrap';
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import axios from 'axios';
// import { useState } from 'react';
// import { toast } from 'react-toastify';

// const PHONE_CODES = [
//   { code: '+234', country: 'Nigeria (NG)'       },
//   { code: '+233', country: 'Ghana (GH)'         },
//   { code: '+254', country: 'Kenya (KE)'         },
//   { code: '+27',  country: 'South Africa (ZA)'  },
//   { code: '+251', country: 'Ethiopia (ET)'      },
//   { code: '+255', country: 'Tanzania (TZ)'      },
//   { code: '+256', country: 'Uganda (UG)'        },
//   { code: '+250', country: 'Rwanda (RW)'        },
//   { code: '+221', country: 'Senegal (SN)'       },
//   { code: '+225', country: 'Côte d\'Ivoire (CI)'},
//   { code: '+237', country: 'Cameroon (CM)'      },
//   { code: '+20',  country: 'Egypt (EG)'         },
//   { code: '+212', country: 'Morocco (MA)'       },
//   { code: '+44',  country: 'United Kingdom (GB)'},
//   { code: '+1',   country: 'United States (US)' },
//   { code: '+91',  country: 'India (IN)'         },
// ];

// const resetPasswordSchema = yup.object({
//   phone_code: yup
//     .string()
//     .required('Please select a country code'),
//   phone: yup
//     .string()
//     .required('Phone number is required')
//     .matches(/^[0-9]{6,12}$/, 'Enter digits only, without the country code (6–12 digits)'),
//   otp: yup
//     .string()
//     .required('OTP is required')
//     .matches(/^[0-9]+$/, 'OTP must be numeric')
//     .min(4, 'OTP must be at least 4 digits'),
//   password: yup
//     .string()
//     .required('Please enter a new password')
//     .min(8, 'Password must be at least 8 characters')
//     .matches(/[a-z]/, 'Must contain at least one lowercase letter')
//     .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
//     .matches(/[0-9]/, 'Must contain at least one number'),
//   password_confirmation: yup
//     .string()
//     .oneOf([yup.ref('password'), null], 'Passwords must match')
//     .required('Please confirm your password'),
// });

// const ResetPassForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { tenantSlug } = useParams();

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(resetPasswordSchema),
//     defaultValues: {
//       phone_code: '+234', // Default to Nigeria
//       phone: '',
//       otp: '',
//       password: '',
//       password_confirmation: '',
//     },
//   });

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);

//     // Combine code + number, stripping any leading zero from the local number
//     const localNumber = data.phone.replace(/^0+/, '');
//     const fullPhone   = `${data.phone_code}${localNumber}`;

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/sms-verify-otp`,
//         {
//           phone: fullPhone,
//           otp: data.otp,
//           password: data.password,
//           password_confirmation: data.password_confirmation,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//         }
//       );

//       toast.success('Password reset successfully!');
//       navigate(`/${tenantSlug}/tenant-sign-in`);

//     } catch (error) {
//       const status  = error.response?.status;
//       const message = error.response?.data?.message;

//       if (status === 401 || status === 400) {
//         toast.error(message || 'Invalid or expired OTP. Please try again.');
//       } else if (status === 422) {
//         const validationErrors = error.response?.data?.errors;
//         if (validationErrors) {
//           const first = Object.values(validationErrors)[0];
//           toast.error(Array.isArray(first) ? first[0] : first);
//         } else {
//           toast.error(message || 'Please check your details and try again.');
//         }
//       } else {
//         toast.error(message || 'An error occurred. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>

//       {/* Phone number with country code */}
//       <div className="mb-3">
//         <Form.Label htmlFor="phone-id">Phone Number</Form.Label>
//         <InputGroup>
//           <Controller
//             name="phone_code"
//             control={control}
//             render={({ field }) => (
//               <Form.Select
//                 {...field}
//                 style={{ maxWidth: '180px' }}
//                 isInvalid={!!errors.phone_code}
//                 aria-label="Country code"
//               >
//                 {PHONE_CODES.map(({ code, country }) => (
//                   <option key={code} value={code}>
//                     {code} — {country}
//                   </option>
//                 ))}
//               </Form.Select>
//             )}
//           />
//           <Controller
//             name="phone"
//             control={control}
//             render={({ field }) => (
//               <Form.Control
//                 {...field}
//                 id="phone-id"
//                 type="tel"
//                 placeholder="8012345678"
//                 isInvalid={!!errors.phone}
//               />
//             )}
//           />
//           {(errors.phone_code || errors.phone) && (
//             <Form.Control.Feedback type="invalid">
//               {errors.phone_code?.message || errors.phone?.message}
//             </Form.Control.Feedback>
//           )}
//         </InputGroup>
//       </div>

//       <TextFormInput
//         control={control}
//         name="otp"
//         containerClassName="mb-3"
//         label="OTP"
//         id="otp-id"
//         placeholder="Enter the OTP sent to your phone"
//         isInvalid={!!errors.otp}
//         errorMessage={errors.otp?.message}
//       />

//       <PasswordFormInput
//         control={control}
//         name="password"
//         containerClassName="mb-3"
//         label="New Password"
//         id="password-id"
//         placeholder="Enter your new password"
//         isInvalid={!!errors.password}
//         errorMessage={errors.password?.message}
//       />

//       <PasswordFormInput
//         control={control}
//         name="password_confirmation"
//         containerClassName="mb-3"
//         label="Confirm New Password"
//         id="password-confirm-id"
//         placeholder="Confirm your new password"
//         isInvalid={!!errors.password_confirmation}
//         errorMessage={errors.password_confirmation?.message}
//       />

//       <div className="mb-1 text-center d-grid">
//         <Button variant="primary" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Resetting...' : 'Reset Password'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default ResetPassForm;



import { useNavigate, useParams } from 'react-router-dom';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'react-bootstrap'; // removed InputGroup
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const resetPasswordSchema = yup.object({
  phone: yup
    .string()
    .required('Phone number is required')
    .test('valid-phone', 'Enter a valid phone number', (value) => {
      if (!value) return false;
      const digits = value.replace(/[^0-9]/g, '');
      return digits.length >= 10;
    }),
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP must be numeric')
    .min(4, 'OTP must be at least 4 digits'),
  password: yup
    .string()
    .required('Please enter a new password')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      phone: '',
      otp: '',
      password: '',
      password_confirmation: '',
    },
  });

  const phoneValue = watch('phone');

  const handlePhoneChange = (phone) => {
    let cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone && !cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    }
    setValue('phone', cleanPhone, { shouldValidate: true });
  };

  const getDisplayValue = () => {
    if (!phoneValue) return '';
    if (!phoneValue.startsWith('+')) return '+' + phoneValue;
    return phoneValue;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/sms-verify-otp`,
        {
          phone: data.phone,
          otp: data.otp,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      toast.success('Password reset successfully!');
      navigate(`/${tenantSlug}/tenant-sign-in`);

    } catch (error) {
      const status  = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401 || status === 400) {
        toast.error(message || 'Invalid or expired OTP. Please try again.');
      } else if (status === 422) {
        const validationErrors = error.response?.data?.errors;
        if (validationErrors) {
          const first = Object.values(validationErrors)[0];
          toast.error(Array.isArray(first) ? first[0] : first);
        } else {
          toast.error(message || 'Please check your details and try again.');
        }
      } else {
        toast.error(message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        className="authentication-form"
        onSubmit={(e) => {
          setIsSubmitted(true);
          handleSubmit(onSubmit)(e);
        }}
      >
        {/* Phone number — now uses react-phone-input-2 */}
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-input">
            Phone Number
          </label>
          <PhoneInput
            country={'ng'}
            value={getDisplayValue()}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              className: `form-control ${isSubmitted && errors.phone ? 'is-invalid' : ''}`,
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
          {isSubmitted && errors.phone && (
            <Form.Text className="text-danger">
              {errors.phone?.message}
            </Form.Text>
          )}
          <Form.Text className="text-muted">
            <small>Format: +234XXXXXXXXXX</small>
          </Form.Text>
        </div>

        {/* Everything below is untouched from your original */}
        <TextFormInput
          control={control}
          name="otp"
          containerClassName="mb-3"
          label="OTP"
          id="otp-id"
          placeholder="Enter the OTP sent to your phone"
          isInvalid={!!errors.otp}
          errorMessage={errors.otp?.message}
        />

        <PasswordFormInput
          control={control}
          name="password"
          containerClassName="mb-3"
          label="New Password"
          id="password-id"
          placeholder="Enter your new password"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <PasswordFormInput
          control={control}
          name="password_confirmation"
          containerClassName="mb-3"
          label="Confirm New Password"
          id="password-confirm-id"
          placeholder="Confirm your new password"
          isInvalid={!!errors.password_confirmation}
          errorMessage={errors.password_confirmation?.message}
        />

        <div className="mb-1 text-center d-grid">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
        }
        .phone-dropdown-menu .search input {
          width: 100% !important;
          padding: 10px 12px !important;
          border: none !important;
          font-size: 14px !important;
          background: #ffffff !important;
          color: #212529 !important;
          outline: none !important;
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
          background: #ffffff !important;
        }
        .phone-dropdown-menu .country-list .country:hover {
          background: #f1f3f5 !important;
        }
        .phone-dropdown-menu .country-list .country .country-name {
          flex: 1 !important;
          font-size: 14px !important;
          color: #212529 !important;
        }
        .phone-dropdown-menu .country-list .country .dial-code {
          font-size: 14px !important;
          color: #6c757d !important;
        }
        .phone-dropdown-menu .divider {
          height: 1px !important;
          background: #e9ecef !important;
          margin: 4px 0 !important;
        }
        .phone-input-container .form-control.is-invalid {
          border-color: #dc3545 !important;
        }
        .phone-input-container .form-control:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }
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

export default ResetPassForm;