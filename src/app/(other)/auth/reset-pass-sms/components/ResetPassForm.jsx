import { useNavigate, useParams } from 'react-router-dom';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PHONE_CODES = [
  { code: '+234', country: 'Nigeria (NG)'       },
  { code: '+233', country: 'Ghana (GH)'         },
  { code: '+254', country: 'Kenya (KE)'         },
  { code: '+27',  country: 'South Africa (ZA)'  },
  { code: '+251', country: 'Ethiopia (ET)'      },
  { code: '+255', country: 'Tanzania (TZ)'      },
  { code: '+256', country: 'Uganda (UG)'        },
  { code: '+250', country: 'Rwanda (RW)'        },
  { code: '+221', country: 'Senegal (SN)'       },
  { code: '+225', country: 'Côte d\'Ivoire (CI)'},
  { code: '+237', country: 'Cameroon (CM)'      },
  { code: '+20',  country: 'Egypt (EG)'         },
  { code: '+212', country: 'Morocco (MA)'       },
  { code: '+44',  country: 'United Kingdom (GB)'},
  { code: '+1',   country: 'United States (US)' },
  { code: '+91',  country: 'India (IN)'         },
];

const resetPasswordSchema = yup.object({
  phone_code: yup
    .string()
    .required('Please select a country code'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{6,12}$/, 'Enter digits only, without the country code (6–12 digits)'),
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
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      phone_code: '+234', // Default to Nigeria
      phone: '',
      otp: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Combine code + number, stripping any leading zero from the local number
    const localNumber = data.phone.replace(/^0+/, '');
    const fullPhone   = `${data.phone_code}${localNumber}`;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/sms-verify-otp`,
        {
          phone: fullPhone,
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
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>

      {/* Phone number with country code */}
      <div className="mb-3">
        <Form.Label htmlFor="phone-id">Phone Number</Form.Label>
        <InputGroup>
          <Controller
            name="phone_code"
            control={control}
            render={({ field }) => (
              <Form.Select
                {...field}
                style={{ maxWidth: '180px' }}
                isInvalid={!!errors.phone_code}
                aria-label="Country code"
              >
                {PHONE_CODES.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {code} — {country}
                  </option>
                ))}
              </Form.Select>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                id="phone-id"
                type="tel"
                placeholder="8012345678"
                isInvalid={!!errors.phone}
              />
            )}
          />
          {(errors.phone_code || errors.phone) && (
            <Form.Control.Feedback type="invalid">
              {errors.phone_code?.message || errors.phone?.message}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </div>

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
  );
};

export default ResetPassForm;