

import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormCheck, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';

const TenantSignUpForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const { tenantSlug } = useParams();

  const tenantSignUpSchema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    middle_name: yup.string(),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    dob: yup.string().required('Date of birth is required'),
    password: yup.string().required('Password is required'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required')
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(tenantSignUpSchema)
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/sign-up`,
        formData,
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
        navigate(`/${tenantSlug}/auth/sign-in`);
      }

    } catch (error) {
      if (error.response?.status === 409) {
        setError("Tenant with this email already exists.");
      } else if (error.response?.status === 400) {
        setError("Invalid registration data.");
      } else {
        setError(error.response?.data?.message || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      
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
        label="Email" 
        id="email-id" 
        placeholder="Enter your email" 
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <TextFormInput 
        control={control} 
        name="phone" 
        containerClassName="mb-3" 
        label="Phone Number" 
        id="phone" 
        placeholder="Enter your phone number" 
        isInvalid={!!errors.phone}
        errorMessage={errors.phone?.message}
      />

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
    </form>
  );
};

export default TenantSignUpForm;