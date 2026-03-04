import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ForgotPasswordStep1 = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tenantSlug } = useParams();

  // Validation schema
  const emailSchema = yup.object({
    email: yup.string()
      .email('Please enter a valid email address')
      .required('Please enter your email address')
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(emailSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Try landlord endpoint first
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/confirm-user`,
        {
          email: data.email
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        toast.success('Verification code sent to your email!');
        onSuccess(data.email);
      } else {
        toast.error(response.data.message || 'Failed to send verification code');
      }
    } catch (landlordError) {
      // If landlord endpoint fails, try tenant endpoint
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/confirm-user`,
          {
            email: data.email
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          toast.success('Verification code sent to your email!');
          onSuccess(data.email);
        } else {
          toast.error(response.data.message || 'Failed to send verification code');
        }
      } catch (tenantError) {
        console.error('Forgot password error:', tenantError);
        
        if (tenantError.response?.data?.message) {
          toast.error(tenantError.response.data.message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          isInvalid={!!errors.email}
          {...register('email')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Alert variant="info" className="mb-3">
        <small>
          We'll send a 6-digit verification code to this email address to verify your identity.
        </small>
      </Alert>
      
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </div>
    </Form>
  );
};

export default ForgotPasswordStep1;