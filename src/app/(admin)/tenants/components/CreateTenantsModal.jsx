// import { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Row, Col, InputGroup } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const COUNTRY_CODES = [
//   { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
//   { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
//   { code: '+44', flag: '🇬🇧', name: 'UK' },
//   { code: '+27', flag: '🇿🇦', name: 'South Africa' },
//   { code: '+233', flag: '🇬🇭', name: 'Ghana' },
//   { code: '+254', flag: '🇰🇪', name: 'Kenya' },
//   { code: '+91', flag: '🇮🇳', name: 'India' },
//   { code: '+49', flag: '🇩🇪', name: 'Germany' },
//   { code: '+33', flag: '🇫🇷', name: 'France' },
//   { code: '+86', flag: '🇨🇳', name: 'China' },
//   { code: '+971', flag: '🇦🇪', name: 'UAE' },
//   { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
//   { code: '+353', flag: '🇮🇪', name: 'Ireland' },
//   { code: '+61', flag: '🇦🇺', name: 'Australia' },
//   { code: '+55', flag: '🇧🇷', name: 'Brazil' },
// ];

// // Helper: split a full phone string like "+2348012345678" into parts
// const splitPhone = (fullPhone) => {
//   if (!fullPhone) return { countryCode: '+234', number: '' };
//   const match = COUNTRY_CODES.find(c => fullPhone.startsWith(c.code));
//   if (match) {
//     return {
//       countryCode: match.code,
//       number: fullPhone.slice(match.code.length).trim(),
//     };
//   }
//   return { countryCode: '+234', number: fullPhone };
// };

// const PhoneInput = ({ label, namePrefix, countryCode, number, onCountryChange, onNumberChange, isInvalid, fieldError, required = false }) => (
//   <Form.Group className="mb-3">
//     <Form.Label>{label}{required && ' *'}</Form.Label>
//     <InputGroup>
//       <Form.Select
//         style={{ maxWidth: '140px', borderRight: 0 }}
//         value={countryCode}
//         onChange={e => onCountryChange(e.target.value)}
//         isInvalid={isInvalid}
//       >
//         {COUNTRY_CODES.map(c => (
//           <option key={c.code} value={c.code}>
//             {c.flag} {c.code} {c.name}
//           </option>
//         ))}
//       </Form.Select>
//       <Form.Control
//         type="tel"
//         placeholder="Phone number"
//         value={number}
//         onChange={e => onNumberChange(e.target.value)}
//         required={required}
//         isInvalid={isInvalid}
//       />
//     </InputGroup>
//     {fieldError && <Form.Text className="text-danger">{fieldError}</Form.Text>}
//   </Form.Group>
// );

// const CreateTenantsModal = ({
//   show,
//   handleClose,
//   refreshTenants,
//   editMode = false,
//   tenantToEdit = null,
//   tenantSlug
// }) => {
//   const { user } = useAuthContext();

//   // Phone fields stored as { countryCode, number } pairs
//   const [phoneFields, setPhoneFields] = useState({
//     phone: { countryCode: '+234', number: '' },
//     other_phone: { countryCode: '+234', number: '' },
//     emergency_contact_number: { countryCode: '+234', number: '' },
//     next_of_kin_number: { countryCode: '+234', number: '' },
//   });

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     middle_name: '',
//     email: '',
//     dob: '',
//     gender: '',
//     nationality: '',
//     state: '',
//     address: '',
//     emergency_contact_name: '',
//     emergency_contact_email: '',
//     next_of_kin_name: '',
//     next_of_kin_address: '',
//     next_of_kin_email: '',
//   });

//   const [idCardFile, setIdCardFile] = useState(null);
//   const [passportPhotoFile, setPassportPhotoFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [success, setSuccess] = useState(false);

//   // Build combined phone string for payload - NO SPACE between country code and number
//   const buildPhone = (field) => {
//     const { countryCode, number } = phoneFields[field];
//     return number ? `${countryCode}${number}` : '';
//   };

//   const updatePhoneCountry = (field, countryCode) => {
//     setPhoneFields(prev => ({ ...prev, [field]: { ...prev[field], countryCode } }));
//     if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: null }));
//   };

//   const updatePhoneNumber = (field, number) => {
//     setPhoneFields(prev => ({ ...prev, [field]: { ...prev[field], number } }));
//     if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: null }));
//   };

//   useEffect(() => {
//     if (editMode && tenantToEdit) {
//       setFormData({
//         first_name: tenantToEdit.first_name || '',
//         last_name: tenantToEdit.last_name || '',
//         middle_name: tenantToEdit.middle_name || '',
//         email: tenantToEdit.email || '',
//         dob: tenantToEdit.dob || '',
//         gender: tenantToEdit.gender || '',
//         nationality: tenantToEdit.nationality || '',
//         state: tenantToEdit.state || '',
//         address: tenantToEdit.address || '',
//         emergency_contact_name: tenantToEdit.emergency_contact_name || '',
//         emergency_contact_email: tenantToEdit.emergency_contact_email || '',
//         next_of_kin_name: tenantToEdit.next_of_kin_name || '',
//         next_of_kin_address: tenantToEdit.next_of_kin_address || '',
//         next_of_kin_email: tenantToEdit.next_of_kin_email || '',
//       });
//       // Parse existing phone values
//       setPhoneFields({
//         phone: splitPhone(tenantToEdit.phone),
//         other_phone: splitPhone(tenantToEdit.other_phone),
//         emergency_contact_number: splitPhone(tenantToEdit.emergency_contact_number),
//         next_of_kin_number: splitPhone(tenantToEdit.next_of_kin_number),
//       });
//     } else {
//       setFormData({
//         first_name: '', last_name: '', middle_name: '', email: '', dob: '',
//         gender: '', nationality: '', state: '', address: '',
//         emergency_contact_name: '', emergency_contact_email: '',
//         next_of_kin_name: '', next_of_kin_address: '', next_of_kin_email: '',
//       });
//       setPhoneFields({
//         phone: { countryCode: '+234', number: '' },
//         other_phone: { countryCode: '+234', number: '' },
//         emergency_contact_number: { countryCode: '+234', number: '' },
//         next_of_kin_number: { countryCode: '+234', number: '' },
//       });
//     }
//     setIdCardFile(null);
//     setPassportPhotoFile(null);
//     setError(null);
//     setFieldErrors({});
//     setSuccess(false);
//   }, [show, editMode, tenantToEdit]);

//   const formatBackendErrors = (errorData) => {
//     const errorMessages = [];
//     const extractErrors = (obj) => {
//       if (typeof obj === 'string') {
//         errorMessages.push(obj);
//       } else if (Array.isArray(obj)) {
//         obj.forEach(err => extractErrors(err));
//       } else if (typeof obj === 'object' && obj !== null) {
//         if (obj.errors) extractErrors(obj.errors);
//         else if (obj.message) errorMessages.push(obj.message);
//         else Object.values(obj).forEach(v => extractErrors(v));
//       }
//     };
//     extractErrors(errorData);
//     if (!errorMessages.length) return editMode ? 'Failed to update tenant' : 'Failed to create tenant';
//     if (errorMessages.length === 1) return errorMessages[0];
//     return `${errorMessages[0]} and ${errorMessages.length - 1} more error${errorMessages.length > 2 ? 's' : ''}`;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
//   };

//   const handleFileChange = (e, setFileFunction) => {
//     setFileFunction(e.target.files[0]);
//     if (fieldErrors.file) setFieldErrors(prev => ({ ...prev, file: null }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setFieldErrors({});
//     setSuccess(false);

//     try {
//       if (!tenantSlug) throw new Error('Tenant slug not found');

//       const formDataToSend = new FormData();

//       // Basic text fields
//       const basicFields = ['first_name', 'last_name', 'middle_name', 'email', 'dob'];
//       basicFields.forEach(key => {
//         if (formData[key]) formDataToSend.append(key, formData[key]);
//       });

//       // Primary phone (always included) - now without space
//       const phoneValue = buildPhone('phone');
//       if (phoneValue) formDataToSend.append('phone', phoneValue);

//       let url, method;

//       if (editMode && tenantToEdit) {
//         const additionalFields = [
//           'gender', 'nationality', 'state', 'address',
//           'emergency_contact_name', 'emergency_contact_email',
//           'next_of_kin_name', 'next_of_kin_address', 'next_of_kin_email',
//         ];
//         additionalFields.forEach(key => {
//           if (formData[key]) formDataToSend.append(key, formData[key]);
//         });

//         // Additional phone fields - now without space
//         ['other_phone', 'emergency_contact_number', 'next_of_kin_number'].forEach(field => {
//           const val = buildPhone(field);
//           if (val) formDataToSend.append(field, val);
//         });

//         if (idCardFile) formDataToSend.append('identity_card', idCardFile);
//         if (passportPhotoFile) formDataToSend.append('passport_photo', passportPhotoFile);

//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/update/${tenantToEdit.uuid}`;
//         method = 'post';
//       } else {
//         url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/create`;
//         method = 'post';
//       }

//       await axios[method](url, formDataToSend, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'multipart/form-data',
//         }
//       });

//       setSuccess(true);
//       refreshTenants();
//       setTimeout(() => { handleClose(); setSuccess(false); }, 1500);
//     } catch (err) {
//       if (err.response?.data) {
//         setError(formatBackendErrors(err.response.data));
//         if (err.response.data.errors) {
//           const fieldSpecificErrors = {};
//           Object.entries(err.response.data.errors).forEach(([field, messages]) => {
//             fieldSpecificErrors[field] = Array.isArray(messages) ? messages[0] : messages;
//           });
//           setFieldErrors(fieldSpecificErrors);
//         }
//       } else {
//         setError(err.message || (editMode ? 'Failed to update tenant' : 'Failed to create tenant'));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showFieldError = (fieldName) =>
//     fieldErrors[fieldName]
//       ? <Form.Text className="text-danger">{fieldErrors[fieldName]}</Form.Text>
//       : null;

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
//       <Modal.Header closeButton>
//         <Modal.Title>{editMode ? 'Edit Tenant' : 'Create New Tenant'}</Modal.Title>
//       </Modal.Header>

//       <Form id="tenant-form" onSubmit={handleSubmit}>
//         <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>
//           )}
//           {success && (
//             <Alert variant="success">
//               {editMode ? 'Tenant updated successfully!' : 'Tenant created successfully!'}
//             </Alert>
//           )}
//           {fieldErrors.identity_card && (
//             <Alert variant="danger" dismissible onClose={() => setFieldErrors(p => ({ ...p, identity_card: null }))}>
//               <strong>ID Card Error:</strong> {fieldErrors.identity_card}
//             </Alert>
//           )}
//           {fieldErrors.passport_photo && (
//             <Alert variant="danger" dismissible onClose={() => setFieldErrors(p => ({ ...p, passport_photo: null }))}>
//               <strong>Passport Photo Error:</strong> {fieldErrors.passport_photo}
//             </Alert>
//           )}

//           <h6 className="mb-3">Basic Information</h6>
//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>First Name *</Form.Label>
//                 <Form.Control type="text" name="first_name" value={formData.first_name}
//                   onChange={handleChange} required isInvalid={!!fieldErrors.first_name} />
//                 {showFieldError('first_name')}
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Middle Name</Form.Label>
//                 <Form.Control type="text" name="middle_name" value={formData.middle_name}
//                   onChange={handleChange} isInvalid={!!fieldErrors.middle_name} />
//                 {showFieldError('middle_name')}
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Last Name *</Form.Label>
//                 <Form.Control type="text" name="last_name" value={formData.last_name}
//                   onChange={handleChange} required isInvalid={!!fieldErrors.last_name} />
//                 {showFieldError('last_name')}
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <PhoneInput
//                 label="Phone Number"
//                 required
//                 countryCode={phoneFields.phone.countryCode}
//                 number={phoneFields.phone.number}
//                 onCountryChange={v => updatePhoneCountry('phone', v)}
//                 onNumberChange={v => updatePhoneNumber('phone', v)}
//                 isInvalid={!!fieldErrors.phone}
//                 fieldError={fieldErrors.phone}
//               />
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email *</Form.Label>
//                 <Form.Control type="email" name="email" value={formData.email}
//                   onChange={handleChange} isInvalid={!!fieldErrors.email} />
//                 {showFieldError('email')}
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Date of Birth</Form.Label>
//                 <Form.Control type="date" name="dob" value={formData.dob}
//                   onChange={handleChange} isInvalid={!!fieldErrors.dob} />
//                 {showFieldError('dob')}
//               </Form.Group>
//             </Col>
//           </Row>

//           {editMode && (
//             <>
//               <h6 className="mb-3 mt-4">Additional Information</h6>
//               <Row>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Gender</Form.Label>
//                     <Form.Select name="gender" value={formData.gender}
//                       onChange={handleChange} isInvalid={!!fieldErrors.gender}>
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </Form.Select>
//                     {showFieldError('gender')}
//                   </Form.Group>
//                 </Col>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Nationality</Form.Label>
//                     <Form.Control type="text" name="nationality" value={formData.nationality}
//                       onChange={handleChange} isInvalid={!!fieldErrors.nationality} />
//                     {showFieldError('nationality')}
//                   </Form.Group>
//                 </Col>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>State</Form.Label>
//                     <Form.Control type="text" name="state" value={formData.state}
//                       onChange={handleChange} isInvalid={!!fieldErrors.state} />
//                     {showFieldError('state')}
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={6}>
//                   <PhoneInput
//                     label="Other Phone"
//                     countryCode={phoneFields.other_phone.countryCode}
//                     number={phoneFields.other_phone.number}
//                     onCountryChange={v => updatePhoneCountry('other_phone', v)}
//                     onNumberChange={v => updatePhoneNumber('other_phone', v)}
//                     isInvalid={!!fieldErrors.other_phone}
//                     fieldError={fieldErrors.other_phone}
//                   />
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={12}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Address</Form.Label>
//                     <Form.Control as="textarea" rows={2} name="address"
//                       value={formData.address} onChange={handleChange}
//                       isInvalid={!!fieldErrors.address} />
//                     {showFieldError('address')}
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <h6 className="mb-3 mt-4">Emergency Contact</h6>
//               <Row>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type="text" name="emergency_contact_name"
//                       value={formData.emergency_contact_name} onChange={handleChange}
//                       isInvalid={!!fieldErrors.emergency_contact_name} />
//                     {showFieldError('emergency_contact_name')}
//                   </Form.Group>
//                 </Col>
//                 <Col md={4}>
//                   <PhoneInput
//                     label="Number"
//                     countryCode={phoneFields.emergency_contact_number.countryCode}
//                     number={phoneFields.emergency_contact_number.number}
//                     onCountryChange={v => updatePhoneCountry('emergency_contact_number', v)}
//                     onNumberChange={v => updatePhoneNumber('emergency_contact_number', v)}
//                     isInvalid={!!fieldErrors.emergency_contact_number}
//                     fieldError={fieldErrors.emergency_contact_number}
//                   />
//                 </Col>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" name="emergency_contact_email"
//                       value={formData.emergency_contact_email} onChange={handleChange}
//                       isInvalid={!!fieldErrors.emergency_contact_email} />
//                     {showFieldError('emergency_contact_email')}
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <h6 className="mb-3 mt-4">Next of Kin</h6>
//               <Row>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type="text" name="next_of_kin_name"
//                       value={formData.next_of_kin_name} onChange={handleChange}
//                       isInvalid={!!fieldErrors.next_of_kin_name} />
//                     {showFieldError('next_of_kin_name')}
//                   </Form.Group>
//                 </Col>
//                 <Col md={4}>
//                   <PhoneInput
//                     label="Number"
//                     countryCode={phoneFields.next_of_kin_number.countryCode}
//                     number={phoneFields.next_of_kin_number.number}
//                     onCountryChange={v => updatePhoneCountry('next_of_kin_number', v)}
//                     onNumberChange={v => updatePhoneNumber('next_of_kin_number', v)}
//                     isInvalid={!!fieldErrors.next_of_kin_number}
//                     fieldError={fieldErrors.next_of_kin_number}
//                   />
//                 </Col>
//                 <Col md={4}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" name="next_of_kin_email"
//                       value={formData.next_of_kin_email} onChange={handleChange}
//                       isInvalid={!!fieldErrors.next_of_kin_email} />
//                     {showFieldError('next_of_kin_email')}
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={12}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Next of Kin Address</Form.Label>
//                     <Form.Control as="textarea" rows={2} name="next_of_kin_address"
//                       value={formData.next_of_kin_address} onChange={handleChange}
//                       isInvalid={!!fieldErrors.next_of_kin_address} />
//                     {showFieldError('next_of_kin_address')}
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <h6 className="mb-3 mt-4">Documents</h6>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>ID Card</Form.Label>
//                     <Form.Control type="file" accept="image/*,.pdf"
//                       onChange={(e) => handleFileChange(e, setIdCardFile)}
//                       isInvalid={!!fieldErrors.identity_card} />
//                     <Form.Text className="text-muted">
//                       {tenantToEdit?.identity_card ? 'Current file exists. Upload new to replace.' : 'Upload ID card image or PDF'}
//                     </Form.Text>
//                     {showFieldError('identity_card')}
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Passport Photo</Form.Label>
//                     <Form.Control type="file" accept="image/*"
//                       onChange={(e) => handleFileChange(e, setPassportPhotoFile)}
//                       isInvalid={!!fieldErrors.passport_photo} />
//                     <Form.Text className="text-muted">
//                       {tenantToEdit?.passport_photo ? 'Current file exists. Upload new to replace.' : 'Upload passport photo'}
//                     </Form.Text>
//                     {showFieldError('passport_photo')}
//                   </Form.Group>
//                 </Col>
//               </Row>
//             </>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose} type="button">
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             disabled={loading} 
//             type="submit"
//             form="tenant-form"
//           >
//             {loading ? (
//               <><IconifyIcon icon="eos-icons:loading" className="me-1" />
//                 {editMode ? 'Updating...' : 'Creating...'}</>
//             ) : (
//               <><IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
//                 {editMode ? 'Save Changes' : 'Create Tenant'}</>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateTenantsModal;



import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Create a memoized PhoneInputField component
const PhoneInputField = React.memo(({ 
  label, 
  field, 
  value, 
  onChange, 
  required = false, 
  placeholder = "Enter phone number",
  isInvalid = false,
  error = null
}) => {
  const handlePhoneChange = useCallback((phone) => {
    // Pass the phone value as-is (it already includes the +)
    onChange(field, phone);
  }, [field, onChange]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}{required && ' *'}</Form.Label>
      <PhoneInput
        country={'ng'}
        value={value || ''}
        onChange={handlePhoneChange}
        inputProps={{
          name: field,
          required: required,
          className: `form-control ${isInvalid ? 'is-invalid' : ''}`,
          placeholder: placeholder,
          autoComplete: 'tel',
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
        isValid={(phone) => {
          if (!phone) return true;
          const digits = phone.replace(/[^0-9]/g, '');
          return digits.length >= 7;
        }}
      />
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
});

PhoneInputField.displayName = 'PhoneInputField';

const CreateTenantsModal = ({
  show,
  handleClose,
  refreshTenants,
  editMode = false,
  tenantToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();

  // Phone fields stored as full phone numbers with country code
  const [phoneFields, setPhoneFields] = useState({
    phone: '',
    other_phone: '',
    emergency_contact_number: '',
    next_of_kin_number: '',
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    dob: '',
    gender: '',
    nationality: '',
    state: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_email: '',
    next_of_kin_name: '',
    next_of_kin_address: '',
    next_of_kin_email: '',
  });

  const [idCardFile, setIdCardFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Update phone number - stable callback
  const updatePhoneNumber = useCallback((field, value) => {
    // Store the value as-is (it already includes the +)
    setPhoneFields(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (editMode && tenantToEdit) {
      setFormData({
        first_name: tenantToEdit.first_name || '',
        last_name: tenantToEdit.last_name || '',
        middle_name: tenantToEdit.middle_name || '',
        email: tenantToEdit.email || '',
        dob: tenantToEdit.dob || '',
        gender: tenantToEdit.gender || '',
        nationality: tenantToEdit.nationality || '',
        state: tenantToEdit.state || '',
        address: tenantToEdit.address || '',
        emergency_contact_name: tenantToEdit.emergency_contact_name || '',
        emergency_contact_email: tenantToEdit.emergency_contact_email || '',
        next_of_kin_name: tenantToEdit.next_of_kin_name || '',
        next_of_kin_address: tenantToEdit.next_of_kin_address || '',
        next_of_kin_email: tenantToEdit.next_of_kin_email || '',
      });
      // Set phone fields with existing values
      setPhoneFields({
        phone: tenantToEdit.phone || '',
        other_phone: tenantToEdit.other_phone || '',
        emergency_contact_number: tenantToEdit.emergency_contact_number || '',
        next_of_kin_number: tenantToEdit.next_of_kin_number || '',
      });
    } else {
      setFormData({
        first_name: '', last_name: '', middle_name: '', email: '', dob: '',
        gender: '', nationality: '', state: '', address: '',
        emergency_contact_name: '', emergency_contact_email: '',
        next_of_kin_name: '', next_of_kin_address: '', next_of_kin_email: '',
      });
      setPhoneFields({
        phone: '',
        other_phone: '',
        emergency_contact_number: '',
        next_of_kin_number: '',
      });
    }
    setIdCardFile(null);
    setPassportPhotoFile(null);
    setError(null);
    setFieldErrors({});
    setSuccess(false);
  }, [show, editMode, tenantToEdit]);

  const formatBackendErrors = (errorData) => {
    const errorMessages = [];
    const extractErrors = (obj) => {
      if (typeof obj === 'string') {
        errorMessages.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(err => extractErrors(err));
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.errors) extractErrors(obj.errors);
        else if (obj.message) errorMessages.push(obj.message);
        else Object.values(obj).forEach(v => extractErrors(v));
      }
    };
    extractErrors(errorData);
    if (!errorMessages.length) return editMode ? 'Failed to update tenant' : 'Failed to create tenant';
    if (errorMessages.length === 1) return errorMessages[0];
    return `${errorMessages[0]} and ${errorMessages.length - 1} more error${errorMessages.length > 2 ? 's' : ''}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e, setFileFunction) => {
    setFileFunction(e.target.files[0]);
    if (fieldErrors.file) setFieldErrors(prev => ({ ...prev, file: null }));
  };

  // Helper function to clean phone number (remove spaces but keep +)
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove all spaces but keep the + sign
    let cleaned = phone.replace(/\s/g, '');
    // Ensure it starts with +
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      if (!tenantSlug) throw new Error('Tenant slug not found');

      const formDataToSend = new FormData();

      // Basic text fields
      const basicFields = ['first_name', 'last_name', 'middle_name', 'email', 'dob'];
      basicFields.forEach(key => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });

      // Primary phone (always included) - clean and ensure + is present
      if (phoneFields.phone) {
        const cleanPhone = cleanPhoneNumber(phoneFields.phone);
        formDataToSend.append('phone', cleanPhone);
      }

      let url, method;

      if (editMode && tenantToEdit) {
        const additionalFields = [
          'gender', 'nationality', 'state', 'address',
          'emergency_contact_name', 'emergency_contact_email',
          'next_of_kin_name', 'next_of_kin_address', 'next_of_kin_email',
        ];
        additionalFields.forEach(key => {
          if (formData[key]) formDataToSend.append(key, formData[key]);
        });

        // Additional phone fields - clean and ensure + is present
        ['other_phone', 'emergency_contact_number', 'next_of_kin_number'].forEach(field => {
          if (phoneFields[field]) {
            const cleanPhone = cleanPhoneNumber(phoneFields[field]);
            formDataToSend.append(field, cleanPhone);
          }
        });

        if (idCardFile) formDataToSend.append('identity_card', idCardFile);
        if (passportPhotoFile) formDataToSend.append('passport_photo', passportPhotoFile);

        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/update/${tenantToEdit.uuid}`;
        method = 'post';
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/create`;
        method = 'post';
      }

      await axios[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccess(true);
      refreshTenants();
      setTimeout(() => { handleClose(); setSuccess(false); }, 1500);
    } catch (err) {
      if (err.response?.data) {
        setError(formatBackendErrors(err.response.data));
        if (err.response.data.errors) {
          const fieldSpecificErrors = {};
          Object.entries(err.response.data.errors).forEach(([field, messages]) => {
            fieldSpecificErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          setFieldErrors(fieldSpecificErrors);
        }
      } else {
        setError(err.message || (editMode ? 'Failed to update tenant' : 'Failed to create tenant'));
      }
    } finally {
      setLoading(false);
    }
  };

  const showFieldError = (fieldName) =>
    fieldErrors[fieldName]
      ? <Form.Text className="text-danger">{fieldErrors[fieldName]}</Form.Text>
      : null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Tenant' : 'Create New Tenant'}</Modal.Title>
      </Modal.Header>

      <Form id="tenant-form" onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>
          )}
          {success && (
            <Alert variant="success">
              {editMode ? 'Tenant updated successfully!' : 'Tenant created successfully!'}
            </Alert>
          )}
          {fieldErrors.identity_card && (
            <Alert variant="danger" dismissible onClose={() => setFieldErrors(p => ({ ...p, identity_card: null }))}>
              <strong>ID Card Error:</strong> {fieldErrors.identity_card}
            </Alert>
          )}
          {fieldErrors.passport_photo && (
            <Alert variant="danger" dismissible onClose={() => setFieldErrors(p => ({ ...p, passport_photo: null }))}>
              <strong>Passport Photo Error:</strong> {fieldErrors.passport_photo}
            </Alert>
          )}

          <h6 className="mb-3">Basic Information</h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control type="text" name="first_name" value={formData.first_name}
                  onChange={handleChange} required isInvalid={!!fieldErrors.first_name} />
                {showFieldError('first_name')}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control type="text" name="middle_name" value={formData.middle_name}
                  onChange={handleChange} isInvalid={!!fieldErrors.middle_name} />
                {showFieldError('middle_name')}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control type="text" name="last_name" value={formData.last_name}
                  onChange={handleChange} required isInvalid={!!fieldErrors.last_name} />
                {showFieldError('last_name')}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <PhoneInputField
                label="Phone Number"
                field="phone"
                value={phoneFields.phone}
                onChange={updatePhoneNumber}
                required={true}
                placeholder="Enter phone number"
                isInvalid={!!fieldErrors.phone}
                error={fieldErrors.phone}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" name="email" value={formData.email}
                  onChange={handleChange} isInvalid={!!fieldErrors.email} />
                {showFieldError('email')}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dob" value={formData.dob}
                  onChange={handleChange} isInvalid={!!fieldErrors.dob} />
                {showFieldError('dob')}
              </Form.Group>
            </Col>
          </Row>

          {editMode && (
            <>
              <h6 className="mb-3 mt-4">Additional Information</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender}
                      onChange={handleChange} isInvalid={!!fieldErrors.gender}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                    {showFieldError('gender')}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control type="text" name="nationality" value={formData.nationality}
                      onChange={handleChange} isInvalid={!!fieldErrors.nationality} />
                    {showFieldError('nationality')}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={formData.state}
                      onChange={handleChange} isInvalid={!!fieldErrors.state} />
                    {showFieldError('state')}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <PhoneInputField
                    label="Other Phone"
                    field="other_phone"
                    value={phoneFields.other_phone}
                    onChange={updatePhoneNumber}
                    placeholder="Enter other phone number"
                    isInvalid={!!fieldErrors.other_phone}
                    error={fieldErrors.other_phone}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={2} name="address"
                      value={formData.address} onChange={handleChange}
                      isInvalid={!!fieldErrors.address} />
                    {showFieldError('address')}
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Emergency Contact</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="emergency_contact_name"
                      value={formData.emergency_contact_name} onChange={handleChange}
                      isInvalid={!!fieldErrors.emergency_contact_name} />
                    {showFieldError('emergency_contact_name')}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <PhoneInputField
                    label="Number"
                    field="emergency_contact_number"
                    value={phoneFields.emergency_contact_number}
                    onChange={updatePhoneNumber}
                    placeholder="Enter emergency contact number"
                    isInvalid={!!fieldErrors.emergency_contact_number}
                    error={fieldErrors.emergency_contact_number}
                  />
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="emergency_contact_email"
                      value={formData.emergency_contact_email} onChange={handleChange}
                      isInvalid={!!fieldErrors.emergency_contact_email} />
                    {showFieldError('emergency_contact_email')}
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Next of Kin</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="next_of_kin_name"
                      value={formData.next_of_kin_name} onChange={handleChange}
                      isInvalid={!!fieldErrors.next_of_kin_name} />
                    {showFieldError('next_of_kin_name')}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <PhoneInputField
                    label="Number"
                    field="next_of_kin_number"
                    value={phoneFields.next_of_kin_number}
                    onChange={updatePhoneNumber}
                    placeholder="Enter next of kin number"
                    isInvalid={!!fieldErrors.next_of_kin_number}
                    error={fieldErrors.next_of_kin_number}
                  />
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="next_of_kin_email"
                      value={formData.next_of_kin_email} onChange={handleChange}
                      isInvalid={!!fieldErrors.next_of_kin_email} />
                    {showFieldError('next_of_kin_email')}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Next of Kin Address</Form.Label>
                    <Form.Control as="textarea" rows={2} name="next_of_kin_address"
                      value={formData.next_of_kin_address} onChange={handleChange}
                      isInvalid={!!fieldErrors.next_of_kin_address} />
                    {showFieldError('next_of_kin_address')}
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Documents</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Card</Form.Label>
                    <Form.Control type="file" accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, setIdCardFile)}
                      isInvalid={!!fieldErrors.identity_card} />
                    <Form.Text className="text-muted">
                      {tenantToEdit?.identity_card ? 'Current file exists. Upload new to replace.' : 'Upload ID card image or PDF'}
                    </Form.Text>
                    {showFieldError('identity_card')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Passport Photo</Form.Label>
                    <Form.Control type="file" accept="image/*"
                      onChange={(e) => handleFileChange(e, setPassportPhotoFile)}
                      isInvalid={!!fieldErrors.passport_photo} />
                    <Form.Text className="text-muted">
                      {tenantToEdit?.passport_photo ? 'Current file exists. Upload new to replace.' : 'Upload passport photo'}
                    </Form.Text>
                    {showFieldError('passport_photo')}
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            disabled={loading} 
            type="submit"
            form="tenant-form"
          >
            {loading ? (
              <><IconifyIcon icon="eos-icons:loading" className="me-1" />
                {editMode ? 'Updating...' : 'Creating...'}</>
            ) : (
              <><IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Tenant'}</>
            )}
          </Button>
        </Modal.Footer>
      </Form>

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
          border: 1px solid #ced4da !important;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
          font-size: 0.875rem !important;
          color: #212529 !important;
          background-color: #ffffff !important;
          pointer-events: auto !important;
          cursor: text !important;
        }

        .phone-input-container .form-control:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }

        .phone-input-container .form-control::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
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

        .phone-dropdown-button .selected-flag .country-code {
          font-size: 14px !important;
          margin-left: 2px !important;
          color: #212529 !important;
          font-weight: 500 !important;
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
          border-radius: 0.375rem 0.375rem 0 0 !important;
        }

        .phone-dropdown-menu .search input {
          width: 100% !important;
          padding: 10px 12px !important;
          border: none !important;
          border-radius: 0 !important;
          font-size: 14px !important;
          background: #ffffff !important;
          color: #212529 !important;
          outline: none !important;
        }

        .phone-dropdown-menu .search input::placeholder {
          color: #adb5bd !important;
        }

        .phone-dropdown-menu .search input:focus {
          outline: none !important;
          box-shadow: none !important;
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
          text-align: left !important;
          background: #ffffff !important;
          border-bottom: 1px solid #f8f9fa !important;
        }

        .phone-dropdown-menu .country-list .country:hover {
          background: #f1f3f5 !important;
        }

        .phone-dropdown-menu .country-list .country .flag {
          display: flex !important;
          align-items: center !important;
          flex-shrink: 0 !important;
        }

        .phone-dropdown-menu .country-list .country .flag img {
          width: 24px !important;
          height: 16px !important;
          object-fit: cover !important;
          border-radius: 2px !important;
        }

        .phone-dropdown-menu .country-list .country .country-name {
          flex: 1 !important;
          font-size: 14px !important;
          color: #212529 !important;
          text-align: left !important;
          font-weight: 400 !important;
        }

        .phone-dropdown-menu .country-list .country .dial-code {
          font-size: 14px !important;
          color: #6c757d !important;
          text-align: right !important;
          font-weight: 400 !important;
        }

        .phone-dropdown-menu .country-list .country.preferred {
          background: #f8f9fa !important;
        }

        .phone-dropdown-menu .country-list .country.preferred .country-name {
          font-weight: 500 !important;
        }

        .phone-dropdown-menu .country-list .country.preferred:hover {
          background: #e9ecef !important;
        }

        .phone-dropdown-menu .divider {
          height: 1px !important;
          background: #e9ecef !important;
          margin: 4px 0 !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar {
          width: 6px !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-track {
          background: #f8f9fa !important;
          border-radius: 0 0.375rem 0.375rem 0 !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-thumb {
          background: #ced4da !important;
          border-radius: 3px !important;
        }

        .phone-dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #adb5bd !important;
        }

        .phone-input-container .form-control.is-invalid {
          border-color: #dc3545 !important;
          padding-right: calc(1.5em + 0.75rem) !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right calc(0.375em + 0.1875rem) center !important;
          background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem) !important;
        }

        .phone-input-container .form-control.is-invalid + .phone-dropdown-button {
          border-color: #dc3545 !important;
        }

        .phone-input-container .form-control.is-invalid:focus {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
        }

        @media (max-width: 576px) {
          .phone-dropdown-menu {
            min-width: 250px !important;
            max-height: 250px !important;
          }
          .phone-dropdown-button {
            min-width: 70px !important;
            padding: 0 6px !important;
          }
          .phone-dropdown-button .selected-flag .country-code {
            font-size: 12px !important;
          }
          .phone-input-container .form-control {
            padding-left: 80px !important;
            font-size: 0.8125rem !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default CreateTenantsModal;