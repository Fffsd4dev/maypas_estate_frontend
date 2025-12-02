// import TextFormInput from '@/components/form/TextFormInput';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { Button, FormCheck, Alert } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import axios from 'axios';
// import { useState } from 'react';
// import { useAuthContext } from '@/context/useAuthContext';

// const EstateManagerSignUpForm = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { saveSession } = useAuthContext();
//   const { tenantSlug } = useParams();

//   const estateManagerSignUpSchema = yup.object({
//     first_name: yup.string().required('First name is required'),
//     last_name: yup.string().required('Last name is required'),
//     email: yup.string().email('Must be a valid email').required('Email is required'),
//     phone: yup.string().required('Phone number is required'),
//     estate_name: yup.string().required('Estate name is required')
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     resolver: yupResolver(estateManagerSignUpSchema)
//   });

//   const onSubmit = async (formData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/estate-manager/sign-up`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//           },
//         }
//       );

//       if (response.data) {
//         const sessionData = {
//           token: response.data.token,
//           user: response.data.estate_manager || response.data.user,
//           userType: 'estate_manager'
//         };

//         saveSession(sessionData);
//         navigate(`/auth/sign-up`);
//       }

//     } catch (error) {
//       if (error.response?.status === 409) {
//         setError("Estate manager with this email already exists.");
//       } else if (error.response?.status === 400) {
//         setError("Invalid registration data.");
//       } else {
//         setError(error.response?.data?.message || "Registration failed. Try again.");
//       }
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
//       {error && <Alert variant="danger">{error}</Alert>}
      
//       <div className="row">
//         <div className="col-md-6">
//           <TextFormInput 
//             control={control} 
//             name="first_name" 
//             containerClassName="mb-3" 
//             label="First Name" 
//             id="first_name" 
//             placeholder="Enter your first name" 
//             isInvalid={!!errors.first_name}
//             errorMessage={errors.first_name?.message}
//           />
//         </div>
//         <div className="col-md-6">
//           <TextFormInput 
//             control={control} 
//             name="last_name" 
//             containerClassName="mb-3" 
//             label="Last Name" 
//             id="last_name" 
//             placeholder="Enter your last name" 
//             isInvalid={!!errors.last_name}
//             errorMessage={errors.last_name?.message}
//           />
//         </div>
//       </div>

//       <TextFormInput 
//         control={control} 
//         name="email" 
//         containerClassName="mb-3" 
//         label="Email" 
//         id="email-id" 
//         placeholder="Enter your email" 
//         isInvalid={!!errors.email}
//         errorMessage={errors.email?.message}
//       />

//       <TextFormInput 
//         control={control} 
//         name="phone" 
//         containerClassName="mb-3" 
//         label="Phone Number" 
//         id="phone" 
//         placeholder="Enter your phone number" 
//         isInvalid={!!errors.phone}
//         errorMessage={errors.phone?.message}
//       />

//       <TextFormInput 
//         control={control} 
//         name="estate_name" 
//         containerClassName="mb-3" 
//         label="Estate Name" 
//         id="estate_name" 
//         placeholder="Enter your estate name" 
//         isInvalid={!!errors.estate_name}
//         errorMessage={errors.estate_name?.message}
//       />
      
//       <div className="mb-3">
//         <FormCheck 
//           label="I accept Terms and Conditions" 
//           id="termAndCondition" 
//         />
//       </div>
      
//       <div className="mb-1 text-center d-grid">
//         <Button variant="primary" type="submit" disabled={loading}>
//           {loading ? 'Creating Estate Manager Account...' : 'Sign Up as Estate Manager'}
//         </Button>
//       </div>

//       {/* <div className="text-center mt-3">
//         <p className="text-muted">
//           Already have an account?{' '}
//           <Link to={`/${tenantSlug}/login`} className="text-muted text-unline-dashed ms-1">
//             Sign In
//           </Link>
//         </p>
//       </div> */}
//     </form>
//   );
// };

// export default EstateManagerSignUpForm;




import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormCheck, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';

const EstateManagerSignUpForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const { tenantSlug } = useParams();

  const estateManagerSignUpSchema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    estate_name: yup.string().required('Estate name is required')
  });

  const {
    control,
    handleSubmit,
    reset, // Add reset function
    formState: { errors }
  } = useForm({
    resolver: yupResolver(estateManagerSignUpSchema)
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/estate-manager/sign-up`,
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
          user: response.data.estate_manager || response.data.user,
          userType: 'estate_manager'
        };

        saveSession(sessionData);
        
        // Reset form after successful submission
        reset({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          estate_name: ''
        });
        
        // You can choose to navigate or stay on the same page with cleared form
        // Option 1: Stay on the same page with cleared form and show success message
        setError(null); // Clear any previous errors
        
        // Option 2: Navigate to a different page (if you still want navigation)
        // navigate(`/auth/sign-up`);
        
        // Option 3: Show success message instead of navigating
        alert('Registration successful! Your account has been created.');
      }

    } catch (error) {
      if (error.response?.status === 409) {
        setError("Estate manager with this email already exists.");
      } else if (error.response?.status === 400) {
        setError("Invalid registration data.");
      } else {
        setError(error.response?.data?.message || "Registration failed. Try again.");
      }
      console.log(error);
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
        name="estate_name" 
        containerClassName="mb-3" 
        label="Estate Name" 
        id="estate_name" 
        placeholder="Enter your estate name" 
        isInvalid={!!errors.estate_name}
        errorMessage={errors.estate_name?.message}
      />
      
      <div className="mb-3">
        <FormCheck 
          label="I accept Terms and Conditions" 
          id="termAndCondition" 
        />
      </div>
      
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating Estate Manager Account...' : 'Sign Up as Estate Manager'}
        </Button>
      </div>

      {/* <div className="text-center mt-3">
        <p className="text-muted">
          Already have an account?{' '}
          <Link to={`/${tenantSlug}/login`} className="text-muted text-unline-dashed ms-1">
            Sign In
          </Link>
        </p>
      </div> */}
    </form>
  );
};

export default EstateManagerSignUpForm;