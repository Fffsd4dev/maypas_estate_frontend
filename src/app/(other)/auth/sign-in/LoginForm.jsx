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

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const { tenantSlug } = useParams();

  console.log({ tenantSlug });

  const loginSchema = yup.object({
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const getUserType = (userTypeId) => {
    switch(userTypeId) {
      case '1':
        return 'landlord';
      case '2':
        return 'agent';
      case '3':
        return 'admin';
      default:
        return 'landlord'; // Default fallback
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Try landlord endpoint first
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      console.log('Landlord login response:', response.data.landlord);

      // If landlord login succeeds, redirect based on user type
      if (response.data) {
        const userTypeId = response.data.landlord?.user_type_id;
        const userType = getUserType(userTypeId);
        // console.log({ userTypeId, userTypeId });
        
        const sessionData = {
          token: response.data.token,
          user: response.data.landlord || response.data.tenant,
          userType: userType,
          userTypeId: userTypeId // Optional: store the ID if needed
        };

        saveSession(sessionData);
        
        // Redirect based on user type
        if (userType === 'landlord') {
          navigate(`/${tenantSlug}/dashboard`);
        } else if (userType === 'agent') {
          navigate(`/${tenantSlug}/dashboard`);
        } else if (userType === 'admin') {
          navigate(`/${tenantSlug}/dashboard`);
        } else {
          // Fallback to landlord dashboard
          navigate(`/${tenantSlug}/dashboard`);
        }
      }

    } catch (landlordError) {
      // If landlord login fails, try tenant login
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/login`,
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
            user: response.data.user || null,
            userType: 'tenant'
          };

          saveSession(sessionData);
          navigate(`/${tenantSlug}/tenant-dashboard`);
        }
      } catch (tenantError) {
        // Both logins failed
        if (tenantError.response?.status === 401 || landlordError.response?.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(tenantError.response?.data?.message || "Login failed. Try again.");
        }
        console.log(tenantError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      
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

      <PasswordFormInput 
        control={control} 
        name="password" 
        containerClassName="mb-3" 
        placeholder="Enter your password" 
        id="password-id" 
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        label={
          <>
            <Link to={`/${tenantSlug}/forgot-password`} className="float-end text-muted text-unline-dashed ms-1">
              Forgot password?
            </Link>
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
          </>
        } 
      />
      
      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div>
      
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;