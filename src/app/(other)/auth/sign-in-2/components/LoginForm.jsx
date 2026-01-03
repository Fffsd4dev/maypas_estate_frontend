import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
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

  // const onSubmit = async (formData) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/login`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Accept": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.token) {
  //       // Create a session object that matches what AuthContext expects
  //       const sessionData = {
  //         token: response.data.token,
  //         user: response.data.user || null, // depends on API response
  //       };

  //       // Save to cookie + update context
  //       saveSession(sessionData);

  //       console.log('Login successful, session saved.', sessionData);

  //       // Redirect to dashboard
  //       navigate("/dashboard");
  //     } else {
  //       throw new Error("No token received");
  //     }
  //   } catch (err) {
  //     if (err.response?.status === 404) {
  //       setError("API endpoint not found. Contact support.");
  //     } else if (err.response?.status === 401) {
  //       setError("Invalid email or password.");
  //     } else {
  //       setError(err.response?.data?.message || "Login failed. Try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (formData) => {
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    console.log('📦 Full API Response:', response);
    console.log('📦 Response data:', response.data);
    
    // Check what the API actually returns
    if (!response.data) {
      throw new Error("No data received from server");
    }

    // Create session data based on API response
    let sessionData;
    
    if (response.data.user && response.data.token) {
      // If API returns user object and token separately
      sessionData = {
        token: response.data.token,
        user: response.data.user
      };
    } else if (response.data.token && response.data.email) {
      // If API returns token and user data at root level
      sessionData = {
        token: response.data.token,
        user: {
          id: response.data.id,
          name: response.data.name || response.data.email.split('@')[0],
          email: response.data.email,
          role: response.data.role || 'user',
          ...response.data
        }
      };
    } else {
      // Fallback: use whatever is in response
      sessionData = {
        token: response.data.token || response.data.access_token,
        user: response.data.admin || response.data
      };
    }

    console.log('💾 Prepared session data:', sessionData);
    
    // Save session
    saveSession(sessionData);
    
    // Wait a moment for state to update, then redirect
    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
    
  } catch (err) {
    console.error('❌ Login error:', err);
    console.error('❌ Error response:', err.response?.data);
    
    if (err.response?.status === 404) {
      setError("API endpoint not found. Contact support.");
    } else if (err.response?.status === 401) {
      setError("Invalid email or password.");
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Login failed. Please try again.");
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
            {/* <Link to="/reset-password" className="float-end text-muted text-unline-dashed ms-1">
              Reset password
            </Link> */}
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