// import { useState } from 'react';
// import { Button, Form, Alert } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate, useParams } from 'react-router-dom';
// import PasswordFormInput from '@/components/form/PasswordFormInput';

// const ForgotPasswordStep2 = ({ userEmail, onBack }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { tenantSlug } = useParams();

//   // Validation schema
//   const resetPasswordSchema = yup.object({
//     email: yup.string().email().required(),
//     otp: yup.string()
//       .required('Please enter the verification code')
//       .matches(/^\d{6}$/, 'Verification code must be 6 digits'),
//     password: yup.string()
//       .required('Please enter a password')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .matches(/[0-9]/, 'Password must contain at least one number'),
//     password_confirmation: yup.string()
//       .oneOf([yup.ref('password'), null], 'Passwords must match')
//       .required('Please confirm your password')
//   });

//   const { control, register, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(resetPasswordSchema),
//     defaultValues: {
//       email: userEmail
//     }
//   });

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       // Try landlord endpoint first
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/reset-password`,
//         {
//           email: data.email,
//           otp: data.otp,
//           password: data.password,
//           password_confirmation: data.password_confirmation
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (response.status === 200) {
//         toast.success('Password reset successfully!');
//         navigate(`/${tenantSlug}/auth/sign-in`);
//       } else {
//         toast.error(response.data.message || 'Password reset failed');
//       }
//     } catch (landlordError) {
//       // If landlord endpoint fails, try tenant endpoint
//       try {
//         const response = await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/reset-password`,
//           {
//             email: data.email,
//             otp: data.otp,
//             password: data.password,
//             password_confirmation: data.password_confirmation
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           }
//         );

//         if (response.status === 200) {
//           toast.success('Password reset successfully!');
//           navigate(`/${tenantSlug}/auth/sign-in`);
//         } else {
//           toast.error(response.data.message || 'Password reset failed');
//         }
//       } catch (tenantError) {
//         console.error('Reset password error:', tenantError);
        
//         if (tenantError.response?.status === 401) {
//           toast.error('Invalid or expired verification code. Please request a new one.');
//         } else if (tenantError.response?.data?.message) {
//           toast.error(tenantError.response.data.message);
//         } else {
//           toast.error('An error occurred during password reset. Please try again.');
//         }
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
//       {/* Hidden email field */}
//       <input type="hidden" {...register('email')} />
      
//       {/* Display email (read-only) */}
//       <Form.Group className="mb-3">
//         <Form.Label>Email Address</Form.Label>
//         <Form.Control
//           type="email"
//           value={userEmail}
//           readOnly
//           disabled
//           className="bg-light"
//         />
//         <Form.Text className="text-muted">
//           This is the email where we sent your verification code.
//         </Form.Text>
//       </Form.Group>

//       {/* OTP Input */}
//       <Form.Group className="mb-3">
//         <Form.Label>Verification Code</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter 6-digit code"
//           maxLength={6}
//           isInvalid={!!errors.otp}
//           {...register('otp')}
//         />
//         <Form.Control.Feedback type="invalid">
//           {errors.otp?.message}
//         </Form.Control.Feedback>
//         <Form.Text className="text-muted">
//           Check your email for the 6-digit verification code.
//         </Form.Text>
//       </Form.Group>

//       {/* Password Fields */}
//       <PasswordFormInput 
//         control={control} 
//         name="password" 
//         containerClassName="mb-3" 
//         placeholder="Enter your new password" 
//         id="password-id" 
//         isInvalid={!!errors.password}
//         errorMessage={errors.password?.message}
//         label="New Password"
//       />

//       <PasswordFormInput 
//         control={control} 
//         name="password_confirmation" 
//         containerClassName="mb-3" 
//         placeholder="Confirm your new password" 
//         id="password-confirm-id" 
//         isInvalid={!!errors.password_confirmation}
//         errorMessage={errors.password_confirmation?.message}
//         label="Confirm New Password"
//       />
      
//       <div className="d-flex gap-2">
//         <Button 
//           variant="outline-secondary" 
//           type="button" 
//           onClick={onBack}
//           disabled={isSubmitting}
//           className="flex-fill"
//         >
//           Back
//         </Button>
//         <Button 
//           variant="primary" 
//           type="submit" 
//           disabled={isSubmitting}
//           className="flex-fill"
//         >
//           {isSubmitting ? 'Resetting...' : 'Reset Password'}
//         </Button>
//       </div>

//       <Alert variant="info" className="mt-3">
//         <small>
//           Didn't receive the code? Go back and request a new verification code.
//         </small>
//       </Alert>
//     </Form>
//   );
// };

// export default ForgotPasswordStep2;



import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordFormInput from '@/components/form/PasswordFormInput';

const ForgotPasswordStep2 = ({ userEmail, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  // Validation schema
  const resetPasswordSchema = yup.object({
    email: yup.string().email().required(),
    otp: yup.string()
      .required('Please enter the verification code')
      .matches(/^\d{6}$/, 'Verification code must be 6 digits'),
    password: yup.string()
      .required('Please enter a password')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: userEmail
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Try landlord endpoint first
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/reset-password`,
        {
          email: data.email,
          otp: data.otp,
          password: data.password,
          password_confirmation: data.password_confirmation
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        toast.success('Password reset successfully!');
        navigate(`/${tenantSlug}/auth/sign-in`);
      } else {
        toast.error(response.data.message || 'Password reset failed');
      }
    } catch (landlordError) {
      // If landlord endpoint fails, try tenant endpoint
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/reset-password`,
          {
            email: data.email,
            otp: data.otp,
            password: data.password,
            password_confirmation: data.password_confirmation
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          toast.success('Password reset successfully!');
          navigate(`/${tenantSlug}/auth/sign-in`);
        } else {
          toast.error(response.data.message || 'Password reset failed');
        }
      } catch (tenantError) {
        console.error('Reset password error:', tenantError);
        
        if (tenantError.response?.status === 401) {
          toast.error('Invalid or expired verification code. Please request a new one.');
        } else if (tenantError.response?.data?.message) {
          toast.error(tenantError.response.data.message);
        } else {
          toast.error('An error occurred during password reset. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      // Try landlord endpoint first
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/resend-otp`,
        {
          email: userEmail
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        toast.success('Verification code sent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to send verification code');
      }
    } catch (landlordError) {
      // If landlord endpoint fails, try tenant endpoint
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/resend-otp`,
          {
            email: userEmail
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          toast.success('Verification code sent successfully!');
        } else {
          toast.error(response.data.message || 'Failed to send verification code');
        }
      } catch (tenantError) {
        console.error('Resend OTP error:', tenantError);
        
        if (tenantError.response?.data?.message) {
          toast.error(tenantError.response.data.message);
        } else {
          toast.error('An error occurred while sending the verification code. Please try again.');
        }
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Hidden email field */}
      <input type="hidden" {...register('email')} />
      
      {/* Display email (read-only) */}
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          value={userEmail}
          readOnly
          disabled
          className="bg-light"
        />
        <Form.Text className="text-muted">
          This is the email where we sent your verification code.
        </Form.Text>
      </Form.Group>

      {/* OTP Input */}
      <Form.Group className="mb-3">
        <Form.Label>Verification Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          isInvalid={!!errors.otp}
          {...register('otp')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.otp?.message}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Check your email for the 6-digit verification code.
        </Form.Text>
      </Form.Group>

      {/* Password Fields */}
      <PasswordFormInput 
        control={control} 
        name="password" 
        containerClassName="mb-3" 
        placeholder="Enter your new password" 
        id="password-id" 
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        label="New Password"
      />

      <PasswordFormInput 
        control={control} 
        name="password_confirmation" 
        containerClassName="mb-3" 
        placeholder="Confirm your new password" 
        id="password-confirm-id" 
        isInvalid={!!errors.password_confirmation}
        errorMessage={errors.password_confirmation?.message}
        label="Confirm New Password"
      />
      
      <div className="d-flex gap-2">
        <Button 
          variant="outline-secondary" 
          type="button" 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-fill"
        >
          Back
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isSubmitting}
          className="flex-fill"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>

      <Alert variant="info" className="mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <small>
            Didn't receive the code?
          </small>
          <Button 
            variant="link" 
            size="sm" 
            onClick={handleResendOtp}
            disabled={isResending}
            className="p-0 text-decoration-none"
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </Button>
        </div>
      </Alert>
    </Form>
  );
};

export default ForgotPasswordStep2;