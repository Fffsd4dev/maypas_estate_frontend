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

const loginSchema = yup.object({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const getUserType = (userTypeId) => {
  switch (userTypeId) {
    case '1': return 'landlord';
    case '2': return 'agent';
    case '3': return 'admin';
    default:  return 'landlord';
  }
};

const LandlordLoginForm = () => {
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const { saveSession }       = useAuthContext();
  const { tenantSlug }        = useParams();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/login`,
        formData,
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      if (response.data) {
        const userTypeId = response.data.landlord?.user_type_id;
        const userType   = getUserType(userTypeId);

        saveSession({
          token:      response.data.token,
          user:       response.data.landlord || response.data.tenant,
          userType,
          userTypeId,
        });

        navigate(`/${tenantSlug}/dashboard`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            <label className="form-label" htmlFor="password-id">Password</label>
          </>
        }
      />

      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in-landlord" />
      </div>

      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};

export default LandlordLoginForm;