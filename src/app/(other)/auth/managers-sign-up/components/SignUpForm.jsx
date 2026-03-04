import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormCheck, Alert, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';

const EstateManagerSignUpForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
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
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(estateManagerSignUpSchema)
  });

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

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
        
        setRegisteredEmail(formData.email);
        // Reset form
        reset({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          estate_name: ''
        });
        
        // Show success modal
        setShowSuccessModal(true);
      }

    } catch (error) {
      if (error.response?.status === 409) {
        setError("Estate manager with this email already exists.");
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
    <>
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
      </form>

      {/* Success Modal */}
      <Modal 
        show={showSuccessModal} 
        onHide={handleCloseModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Sign Up Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <div className="mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="64" 
                fill="currentColor" 
                className="bi bi-check-circle-fill text-success" 
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <h5 className="mb-3">Thank you for registering!</h5>
            <p className="mb-2">
              We've sent a confirmation email to <span className='text-primary'>{registeredEmail}</span> for you to set your password which expires in <span className='text-primary'>15 minutes</span>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EstateManagerSignUpForm;