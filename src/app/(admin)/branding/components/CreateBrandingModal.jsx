


// // import { useState, useEffect } from 'react';
// // import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // const CreateBrandingModal = ({ 
// //   show, 
// //   handleClose, 
// //   refreshBranding,
// //   editMode = false,
// //   brandingToEdit = null,
// //   tenantSlug
// // }) => {
// //   const { user } = useAuthContext();
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     addresses: [''],
// //     phones: [''],
// //     social_links: [''],
// //     logo: null
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);
// //   const [logoPreview, setLogoPreview] = useState(null);

// //   useEffect(() => {
// //     if (editMode && brandingToEdit) {
// //       setFormData({
// //         name: brandingToEdit.name || '',
// //         addresses: brandingToEdit.addresses && brandingToEdit.addresses.length > 0 ? [...brandingToEdit.addresses] : [''],
// //         phones: brandingToEdit.phones && brandingToEdit.phones.length > 0 ? [...brandingToEdit.phones] : [''],
// //         social_links: brandingToEdit.social_links && brandingToEdit.social_links.length > 0 ? [...brandingToEdit.social_links] : [''],
// //         logo: null
// //       });
      
// //       // Set logo preview if logo exists
// //       if (brandingToEdit.logo) {
// //         setLogoPreview(`${brandingToEdit.logo}`);
// //       }
// //     } else {
// //       setFormData({
// //         name: '',
// //         addresses: [''],
// //         phones: [''],
// //         social_links: [''],
// //         logo: null
// //       });
// //       setLogoPreview(null);
// //     }
// //     setError(null);
// //     setSuccess(false);
// //   }, [show, editMode, brandingToEdit]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleLogoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       // Validate file type
// //       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// //       if (!validTypes.includes(file.type)) {
// //         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
// //         return;
// //       }

// //       // Validate file size (max 5MB)
// //       if (file.size > 5 * 1024 * 1024) {
// //         setError('File size must be less than 5MB');
// //         return;
// //       }

// //       setFormData(prev => ({
// //         ...prev,
// //         logo: file
// //       }));

// //       // Create preview
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setLogoPreview(e.target.result);
// //       };
// //       reader.readAsDataURL(file);
// //       setError(null);
// //     }
// //   };

// //   const removeLogo = () => {
// //     setFormData(prev => ({
// //       ...prev,
// //       logo: null
// //     }));
// //     setLogoPreview(null);
// //   };

// //   const handleArrayChange = (field, index, value) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: prev[field].map((item, i) => i === index ? value : item)
// //     }));
// //   };

// //   const addArrayField = (field) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: [...prev[field], '']
// //     }));
// //   };

// //   const removeArrayField = (field, index) => {
// //     if (formData[field].length > 1) {
// //       setFormData(prev => ({
// //         ...prev,
// //         [field]: prev[field].filter((_, i) => i !== index)
// //       }));
// //     }
// //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError(null);
// // //     setSuccess(false);

// // //     try {
// // //       if (!tenantSlug) {
// // //         throw new Error('Tenant slug not found');
// // //       }

// // //       // Create FormData for file upload
// // //       const formDataToSend = new FormData();
// // //       formDataToSend.append('name', formData.name);
      
// // //       // Append arrays (filter out empty values)
// // //       formData.addresses.filter(addr => addr.trim() !== '').forEach(addr => {
// // //         formDataToSend.append('addresses[]', addr);
// // //       });
      
// // //       formData.phones.filter(phone => phone.trim() !== '').forEach(phone => {
// // //         formDataToSend.append('phones[]', phone);
// // //       });
      
// // //       formData.social_links.filter(link => link.trim() !== '').forEach(link => {
// // //         formDataToSend.append('social_links[]', link);
// // //       });

// // //       // Append logo file if selected
// // //       if (formData.logo) {
// // //         formDataToSend.append('logo', formData.logo);
// // //       }

// // //       if (editMode && brandingToEdit) {
// // //         await axios.post(
// // //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/update`,
// // //           formDataToSend,
// // //           {
// // //             headers: {
// // //               'Authorization': `Bearer ${user.token}`,
// // //               'Content-Type': 'multipart/form-data'
// // //             }
// // //           }
// // //         );
// // //       } else {
// // //         await axios.post(
// // //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/create`,
// // //           formDataToSend,
// // //           {
// // //             headers: {
// // //               'Authorization': `Bearer ${user.token}`,
// // //               'Content-Type': 'multipart/form-data'
// // //             }
// // //           }
// // //         );
// // //       }

// // //       setSuccess(true);
// // //       refreshBranding();
// // //       setTimeout(() => {
// // //         handleClose();
// // //         setSuccess(false);
// // //       }, 1500);
// // //     } catch (err) {
// // //       setError(err.response?.data?.message || 
// // //         (editMode ? 'Failed to update branding' : 'Failed to create branding'));
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setLoading(true);
// //   setError(null);
// //   setSuccess(false);

// //   try {
// //     if (!tenantSlug) {
// //       throw new Error('Tenant slug not found');
// //     }

// //     // Create FormData for file upload
// //     const formDataToSend = new FormData();
// //     formDataToSend.append('name', formData.name);
    
// //     // Append arrays (filter out empty values)
// //     formData.addresses.filter(addr => addr.trim() !== '').forEach(addr => {
// //       formDataToSend.append('addresses[]', addr);
// //     });
    
// //     formData.phones.filter(phone => phone.trim() !== '').forEach(phone => {
// //       formDataToSend.append('phones[]', phone);
// //     });
    
// //     formData.social_links.filter(link => link.trim() !== '').forEach(link => {
// //       formDataToSend.append('social_links[]', link);
// //     });

// //     // Append logo file if selected
// //     if (formData.logo) {
// //       formDataToSend.append('logo', formData.logo);
// //     }

// //     // Console.log the payload
// //     console.log('=== BRANDING UPDATE PAYLOAD ===');
// //     console.log('Edit Mode:', editMode);
// //     console.log('Form Data:', {
// //       name: formData.name,
// //       addresses: formData.addresses.filter(addr => addr.trim() !== ''),
// //       phones: formData.phones.filter(phone => phone.trim() !== ''),
// //       social_links: formData.social_links.filter(link => link.trim() !== ''),
// //       logo: formData.logo ? formData.logo.name : 'No logo selected'
// //     });
    
// //     // Log FormData contents (for debugging)
// //     console.log('FormData contents:');
// //     for (let [key, value] of formDataToSend.entries()) {
// //       console.log(`${key}:`, value);
// //     }
// //     console.log('==============================');

// //     if (editMode && brandingToEdit) {
// //       await axios.post(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/update`,
// //         formDataToSend,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'multipart/form-data'
// //           }
// //         }
// //       );
// //     } else {
// //       await axios.post(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/create`,
// //         formDataToSend,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'multipart/form-data'
// //           }
// //         }
// //       );
// //     }

// //     setSuccess(true);
// //     refreshBranding();
// //     setTimeout(() => {
// //       handleClose();
// //       setSuccess(false);
// //     }, 1500);
// //   } catch (err) {
// //     setError(err.response?.data?.message || 
// //       (editMode ? 'Failed to update branding' : 'Failed to create branding'));
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   return (
// //     <Modal show={show} onHide={handleClose} centered size="lg">
// //       <Modal.Header closeButton>
// //         <Modal.Title>
// //           {editMode ? 'Edit Branding' : 'Create New Branding'}
// //         </Modal.Title>
// //       </Modal.Header>
// //       <Form onSubmit={handleSubmit}>
// //         <Modal.Body>
// //           {error && (
// //             <Alert variant="danger" onClose={() => setError(null)} dismissible>
// //               {error}
// //             </Alert>
// //           )}
          
// //           {success && (
// //             <Alert variant="success">
// //               {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
// //             </Alert>
// //           )}

// //           <Row>
// //             <Col md={12}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Estate Name *</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   name="name"
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                   required
// //                   placeholder="Enter estate name"
// //                 />
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           {/* Logo Upload */}
// //           <Row>
// //             <Col md={12}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Logo</Form.Label>
// //                 <div className="border rounded p-3">
// //                   {logoPreview ? (
// //                     <div className="text-center">
// //                       <img 
// //                         src={logoPreview} 
// //                         alt="Logo preview" 
// //                         style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
// //                         className="mb-3"
// //                       />
// //                       <div className="d-flex gap-2 justify-content-center">
// //                         <Button
// //                           variant="outline-secondary"
// //                           onClick={() => document.getElementById('logo-upload').click()}
// //                           type="button"
// //                         >
// //                           <IconifyIcon icon="bx:edit" className="me-1" />
// //                           Change Logo
// //                         </Button>
// //                         <Button
// //                           variant="outline-danger"
// //                           onClick={removeLogo}
// //                           type="button"
// //                         >
// //                           <IconifyIcon icon="bx:trash" className="me-1" />
// //                           Remove
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="text-center">
// //                       <div className="mb-3">
// //                         <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
// //                       </div>
// //                       <Button
// //                         variant="outline-primary"
// //                         onClick={() => document.getElementById('logo-upload').click()}
// //                         type="button"
// //                       >
// //                         <IconifyIcon icon="bx:upload" className="me-1" />
// //                         Select Logo
// //                       </Button>
// //                       <Form.Text className="d-block text-muted mt-2">
// //                         Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
// //                       </Form.Text>
// //                     </div>
// //                   )}
// //                   <Form.Control
// //                     id="logo-upload"
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleLogoChange}
// //                     style={{ display: 'none' }}
// //                   />
// //                 </div>
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           {/* Addresses */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Addresses</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('addresses')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Address
// //                 </Button>
// //               </div>
// //               {formData.addresses.map((address, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="text"
// //                       value={address}
// //                       onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
// //                       placeholder="Enter address"
// //                     />
// //                     {formData.addresses.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('addresses', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>

// //           {/* Phone Numbers */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Phone Numbers</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('phones')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Phone
// //                 </Button>
// //               </div>
// //               {formData.phones.map((phone, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="tel"
// //                       value={phone}
// //                       onChange={(e) => handleArrayChange('phones', index, e.target.value)}
// //                       placeholder="Enter phone number"
// //                     />
// //                     {formData.phones.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('phones', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>

// //           {/* Social Links */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Social Links</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('social_links')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Social Link
// //                 </Button>
// //               </div>
// //               {formData.social_links.map((link, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="url"
// //                       value={link}
// //                       onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
// //                       placeholder="https://example.com"
// //                     />
// //                     {formData.social_links.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('social_links', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleClose}>
// //             Cancel
// //           </Button>
// //           <Button variant="primary" type="submit" disabled={loading}>
// //             {loading ? (
// //               <>
// //                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
// //                 {editMode ? 'Updating...' : 'Creating...'}
// //               </>
// //             ) : (
// //               <>
// //                 <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
// //                 {editMode ? 'Save Changes' : 'Create Branding'}
// //               </>
// //             )}
// //           </Button>
// //         </Modal.Footer>
// //       </Form>
// //     </Modal>
// //   );
// // };

// // export default CreateBrandingModal;



// // import { useState, useEffect } from 'react';
// // import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // const CreateBrandingModal = ({ 
// //   show, 
// //   handleClose, 
// //   refreshBranding,
// //   editMode = false,
// //   brandingToEdit = null,
// //   tenantSlug
// // }) => {
// //   const { user } = useAuthContext();
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     addresses: [''],
// //     phones: [''],
// //     social_links: [''],
// //     logo: null
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);
// //   const [logoPreview, setLogoPreview] = useState(null);
// //   const [logoChanged, setLogoChanged] = useState(false);

// //   useEffect(() => {
// //     if (editMode && brandingToEdit) {
// //       setFormData({
// //         name: brandingToEdit.name || '',
// //         addresses: brandingToEdit.addresses && brandingToEdit.addresses.length > 0 ? [...brandingToEdit.addresses] : [''],
// //         phones: brandingToEdit.phones && brandingToEdit.phones.length > 0 ? [...brandingToEdit.phones] : [''],
// //         social_links: brandingToEdit.social_links && brandingToEdit.social_links.length > 0 ? [...brandingToEdit.social_links] : [''],
// //         logo: brandingToEdit.logo // Start with null for logo file
// //       });
      
// //       // Set logo preview if logo exists
// //       if (brandingToEdit.logo) {
// //         setLogoPreview(`${brandingToEdit.logo}`);
// //       }
      
// //       setLogoChanged(false);
// //     } else {
// //       setFormData({
// //         name: '',
// //         addresses: [''],
// //         phones: [''],
// //         social_links: [''],
// //         logo: null
// //       });
// //       setLogoPreview(null);
// //       setLogoChanged(false);
// //     }
// //     setError(null);
// //     setSuccess(false);
// //   }, [show, editMode, brandingToEdit]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleLogoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       // Validate file type
// //       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// //       if (!validTypes.includes(file.type)) {
// //         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
// //         return;
// //       }

// //       // Validate file size (max 5MB)
// //       if (file.size > 5 * 1024 * 1024) {
// //         setError('File size must be less than 5MB');
// //         return;
// //       }

// //       setFormData(prev => ({
// //         ...prev,
// //         logo: file
// //       }));

// //       // Create preview
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setLogoPreview(e.target.result);
// //       };
// //       reader.readAsDataURL(file);
// //       setLogoChanged(true);
// //       setError(null);
// //     }
// //   };

// //   const removeLogo = () => {
// //     setFormData(prev => ({
// //       ...prev,
// //       logo: null
// //     }));
// //     setLogoPreview(null);
// //     setLogoChanged(true);
// //   };

// //   const handleArrayChange = (field, index, value) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: prev[field].map((item, i) => i === index ? value : item)
// //     }));
// //   };

// //   const addArrayField = (field) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: [...prev[field], '']
// //     }));
// //   };

// //   const removeArrayField = (field, index) => {
// //     if (formData[field].length > 1) {
// //       setFormData(prev => ({
// //         ...prev,
// //         [field]: prev[field].filter((_, i) => i !== index)
// //       }));
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);
// //     setSuccess(false);

// //     try {
// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found');
// //       }

// //       // Create FormData for file upload
// //       const formDataToSend = new FormData();
// //       formDataToSend.append('name', formData.name);
      
// //       // Append arrays (filter out empty values)
// //       formData.addresses.filter(addr => addr.trim() !== '').forEach(addr => {
// //         formDataToSend.append('addresses[]', addr);
// //       });
      
// //       formData.phones.filter(phone => phone.trim() !== '').forEach(phone => {
// //         formDataToSend.append('phones[]', phone);
// //       });
      
// //       formData.social_links.filter(link => link.trim() !== '').forEach(link => {
// //         formDataToSend.append('social_links[]', link);
// //       });

// //       // Handle logo - only append if it's a new file or changed
// //       if (formData.logo && logoChanged) {
// //         formDataToSend.append('logo', formData.logo);
// //       }

// //       // For edit mode, if logo was removed, send a flag
// //       if (editMode && !formData.logo && logoChanged) {
// //         formDataToSend.append('remove_logo', 'true');
// //       }

// //       console.log('=== BRANDING PAYLOAD ===');
// //       console.log('Edit Mode:', editMode);
// //       console.log('Logo Changed:', logoChanged);
// //       console.log('formdata:', formData);
// //       console.log('Form Data:', {
// //         name: formData.name,
// //         addresses: formData.addresses.filter(addr => addr.trim() !== ''),
// //         phones: formData.phones.filter(phone => phone.trim() !== ''),
// //         social_links: formData.social_links.filter(link => link.trim() !== ''),
// //         logo: formData.logo ? (formData.logo || 'File selected') : 'No logo'
// //       });
// //       console.log('========================');

// //       if (editMode && brandingToEdit) {
// //         await axios.post(
// //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/update`,
// //           formDataToSend,
// //           {
// //             headers: {
// //               'Authorization': `Bearer ${user.token}`,
// //               'Content-Type': 'multipart/form-data'
// //             }
// //           }
// //         );
// //       } else {
// //         await axios.post(
// //           `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/create`,
// //           formDataToSend,
// //           {
// //             headers: {
// //               'Authorization': `Bearer ${user.token}`,
// //               'Content-Type': 'multipart/form-data'
// //             }
// //           }
// //         );
// //       }

// //       setSuccess(true);
// //       refreshBranding();
// //       setTimeout(() => {
// //         handleClose();
// //         setSuccess(false);
// //       }, 1500);
// //     } catch (err) {
// //       setError(err.response?.data?.message || 
// //         (editMode ? 'Failed to update branding' : 'Failed to create branding'));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Modal show={show} onHide={handleClose} centered size="lg">
// //       <Modal.Header closeButton>
// //         <Modal.Title>
// //           {editMode ? 'Edit Branding' : 'Create New Branding'}
// //         </Modal.Title>
// //       </Modal.Header>
// //       <Form onSubmit={handleSubmit}>
// //         <Modal.Body>
// //           {error && (
// //             <Alert variant="danger" onClose={() => setError(null)} dismissible>
// //               {error}
// //             </Alert>
// //           )}
          
// //           {success && (
// //             <Alert variant="success">
// //               {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
// //             </Alert>
// //           )}

// //           <Row>
// //             <Col md={12}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Estate Name *</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   name="name"
// //                   value={formData.name}
// //                   onChange={handleChange}
// //                   required
// //                   placeholder="Enter estate name"
// //                 />
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           {/* Logo Upload */}
// //           <Row>
// //             <Col md={12}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Logo</Form.Label>
// //                 <div className="border rounded p-3">
// //                   {logoPreview ? (
// //                     <div className="text-center">
// //                       <img 
// //                         src={logoPreview} 
// //                         alt="Logo preview" 
// //                         style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
// //                         className="mb-3"
// //                       />
// //                       <div className="d-flex gap-2 justify-content-center">
// //                         <Button
// //                           variant="outline-secondary"
// //                           onClick={() => document.getElementById('logo-upload').click()}
// //                           type="button"
// //                         >
// //                           <IconifyIcon icon="bx:edit" className="me-1" />
// //                           Change Logo
// //                         </Button>
// //                         <Button
// //                           variant="outline-danger"
// //                           onClick={removeLogo}
// //                           type="button"
// //                         >
// //                           <IconifyIcon icon="bx:trash" className="me-1" />
// //                           Remove
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="text-center">
// //                       <div className="mb-3">
// //                         <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
// //                       </div>
// //                       <Button
// //                         variant="outline-primary"
// //                         onClick={() => document.getElementById('logo-upload').click()}
// //                         type="button"
// //                       >
// //                         <IconifyIcon icon="bx:upload" className="me-1" />
// //                         Select Logo
// //                       </Button>
// //                       <Form.Text className="d-block text-muted mt-2">
// //                         Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
// //                       </Form.Text>
// //                     </div>
// //                   )}
// //                   <Form.Control
// //                     id="logo-upload"
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleLogoChange}
// //                     style={{ display: 'none' }}
// //                   />
// //                 </div>
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           {/* Addresses */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Addresses</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('addresses')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Address
// //                 </Button>
// //               </div>
// //               {formData.addresses.map((address, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="text"
// //                       value={address}
// //                       onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
// //                       placeholder="Enter address"
// //                     />
// //                     {formData.addresses.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('addresses', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>

// //           {/* Phone Numbers */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Phone Numbers</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('phones')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Phone
// //                 </Button>
// //               </div>
// //               {formData.phones.map((phone, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="tel"
// //                       value={phone}
// //                       onChange={(e) => handleArrayChange('phones', index, e.target.value)}
// //                       placeholder="Enter phone number"
// //                     />
// //                     {formData.phones.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('phones', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>

// //           {/* Social Links */}
// //           <Row>
// //             <Col md={12}>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <Form.Label>Social Links</Form.Label>
// //                 <Button 
// //                   variant="outline-primary" 
// //                   size="sm" 
// //                   onClick={() => addArrayField('social_links')}
// //                   type="button"
// //                 >
// //                   <IconifyIcon icon="bi:plus" className="me-1" />
// //                   Add Social Link
// //                 </Button>
// //               </div>
// //               {formData.social_links.map((link, index) => (
// //                 <Form.Group key={index} className="mb-2">
// //                   <div className="d-flex gap-2">
// //                     <Form.Control
// //                       type="url"
// //                       value={link}
// //                       onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
// //                       placeholder="https://example.com"
// //                     />
// //                     {formData.social_links.length > 1 && (
// //                       <Button
// //                         variant="outline-danger"
// //                         onClick={() => removeArrayField('social_links', index)}
// //                         type="button"
// //                         style={{ width: '42px' }}
// //                       >
// //                         <IconifyIcon icon="bx:trash" />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Form.Group>
// //               ))}
// //             </Col>
// //           </Row>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleClose}>
// //             Cancel
// //           </Button>
// //           <Button variant="primary" type="submit" disabled={loading}>
// //             {loading ? (
// //               <>
// //                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
// //                 {editMode ? 'Updating...' : 'Creating...'}
// //               </>
// //             ) : (
// //               <>
// //                 <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
// //                 {editMode ? 'Save Changes' : 'Create Branding'}
// //               </>
// //             )}
// //           </Button>
// //         </Modal.Footer>
// //       </Form>
// //     </Modal>
// //   );
// // };

// // export default CreateBrandingModal;


// import { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const CreateBrandingModal = ({ 
//   show, 
//   handleClose, 
//   refreshBranding,
//   editMode = false,
//   brandingToEdit = null,
//   tenantSlug
// }) => {
//   const { user } = useAuthContext();
//   const [formData, setFormData] = useState({
//     name: '',
//     addresses: [''],
//     phones: [''],
//     social_links: [''],
//     logo: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [existingLogo, setExistingLogo] = useState(null);

//   // Initialize form data when modal opens or edit mode changes
//   useEffect(() => {
//     if (editMode && brandingToEdit) {
//       setFormData({
//         name: brandingToEdit.name || '',
//         addresses: brandingToEdit.addresses?.length > 0 ? [...brandingToEdit.addresses] : [''],
//         phones: brandingToEdit.phones?.length > 0 ? [...brandingToEdit.phones] : [''],
//         social_links: brandingToEdit.social_links?.length > 0 ? [...brandingToEdit.social_links] : [''],
//         logo: brandingToEdit.logo || null
//       });
      
//       if (brandingToEdit.logo) {
//         setLogoPreview(`${brandingToEdit.logo}`);
//         setExistingLogo(brandingToEdit.logo);
//       } else {
//         setLogoPreview(null);
//         setExistingLogo(null);
//       }
//     } else {
//       setFormData({
//         name: '',
//         addresses: [''],
//         phones: [''],
//         social_links: [''],
//         logo: null
//       });
//       setLogoPreview(null);
//       setExistingLogo(null);
//     }
//     setError(null);
//     setSuccess(false);
//   }, [show, editMode, brandingToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         logo: file
//       }));

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setLogoPreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//       setError(null);
//     }
//   };

//   const removeLogo = () => {
//     setFormData(prev => ({
//       ...prev,
//       logo: null
//     }));
//     setLogoPreview(null);
//     setExistingLogo(null);
//   };

//   const handleArrayChange = (field, index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => i === index ? value : item)
//     }));
//   };

//   const addArrayField = (field) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: [...prev[field], '']
//     }));
//   };

//   const removeArrayField = (field, index) => {
//     if (formData[field].length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         [field]: prev[field].filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       // Create FormData payload
//       const payload = new FormData();
//       payload.append('name', formData.name);
      
//       // Append arrays (filter out empty values)
//       formData.addresses
//         .filter(addr => addr.trim() !== '')
//         .forEach(addr => payload.append('addresses[]', addr));
      
//       formData.phones
//         .filter(phone => phone.trim() !== '')
//         .forEach(phone => payload.append('phones[]', phone));
      
//       formData.social_links
//         .filter(link => link.trim() !== '')
//         .forEach(link => payload.append('social_links[]', link));

//       // Handle logo - SIMPLE APPROACH
//       if (formData.logo instanceof File) {
//         // New file selected - send it
//         payload.append('logo', formData.logo);
//       } else if (editMode && existingLogo && formData.logo === existingLogo) {
//         // For edit mode with existing logo, send the logo URL as a string
//         // This tells the backend to keep the existing logo
//         payload.append('logo', existingLogo);
//       } else if (editMode && formData.logo === null) {
//         // Logo was removed in edit mode
//         payload.append('logo', ''); // Send empty string to remove logo
//       } else if (!editMode && formData.logo === null) {
//         // Create mode with no logo - don't send logo field
//         // Or send empty if backend requires it
//         // payload.append('logo', '');
//       }

//       // Console.log the payload for debugging
//       console.log('=== BRANDING PAYLOAD ===');
//       console.log('Edit Mode:', editMode);
//       console.log('Form Data:', {
//         name: formData.name,
//         addresses: formData.addresses.filter(addr => addr.trim() !== ''),
//         phones: formData.phones.filter(phone => phone.trim() !== ''),
//         social_links: formData.social_links.filter(link => link.trim() !== ''),
//         logo: formData.logo
//       });
//       console.log('Existing Logo:', existingLogo);
//       console.log('FormData contents:');
//       for (let [key, value] of payload.entries()) {
//         console.log(`${key}:`, value);
//       }
//       console.log('========================');

//       // Determine API endpoint
//       const endpoint = editMode ? 'update' : 'create';
      
//       // Make API call
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/${endpoint}`,
//         payload,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       console.log('API Response:', response.data);

//       setSuccess(true);
//       refreshBranding();
//       setTimeout(() => {
//         handleClose();
//         setSuccess(false);
//       }, 1500);
//     } catch (err) {
//       console.error('API Error:', err);
//       console.error('Error Response:', err.response);
//       setError(err.response?.data?.message || 
//         (editMode ? 'Failed to update branding' : 'Failed to create branding'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {editMode ? 'Edit Branding' : 'Create New Branding'}
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {success && (
//             <Alert variant="success">
//               {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
//             </Alert>
//           )}

//           <Row>
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Estate Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter estate name"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Logo Upload */}
//           <Row>
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Logo</Form.Label>
//                 <div className="border rounded p-3">
//                   {logoPreview ? (
//                     <div className="text-center">
//                       <img 
//                         src={logoPreview} 
//                         alt="Logo preview" 
//                         style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
//                         className="mb-3"
//                       />
//                       <div className="d-flex gap-2 justify-content-center">
//                         <Button
//                           variant="outline-secondary"
//                           onClick={() => document.getElementById('logo-upload').click()}
//                           type="button"
//                         >
//                           <IconifyIcon icon="bx:edit" className="me-1" />
//                           Change Logo
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           onClick={removeLogo}
//                           type="button"
//                         >
//                           <IconifyIcon icon="bx:trash" className="me-1" />
//                           Remove
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <div className="mb-3">
//                         <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
//                       </div>
//                       <Button
//                         variant="outline-primary"
//                         onClick={() => document.getElementById('logo-upload').click()}
//                         type="button"
//                       >
//                         <IconifyIcon icon="bx:upload" className="me-1" />
//                         Select Logo
//                       </Button>
//                       <Form.Text className="d-block text-muted mt-2">
//                         Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
//                       </Form.Text>
//                     </div>
//                   )}
//                   <Form.Control
//                     id="logo-upload"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoChange}
//                     style={{ display: 'none' }}
//                   />
//                 </div>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Rest of your form fields remain the same */}
//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Addresses</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('addresses')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Address
//                 </Button>
//               </div>
//               {formData.addresses.map((address, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="text"
//                       value={address}
//                       onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
//                       placeholder="Enter address"
//                     />
//                     {formData.addresses.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('addresses', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Phone Numbers</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('phones')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Phone
//                 </Button>
//               </div>
//               {formData.phones.map((phone, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => handleArrayChange('phones', index, e.target.value)}
//                       placeholder="Enter phone number"
//                     />
//                     {formData.phones.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('phones', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Social Links</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('social_links')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Social Link
//                 </Button>
//               </div>
//               {formData.social_links.map((link, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="url"
//                       value={link}
//                       onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
//                       placeholder="https://example.com"
//                     />
//                     {formData.social_links.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('social_links', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button variant="primary" type="submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
//                 {editMode ? 'Updating...' : 'Creating...'}
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
//                 {editMode ? 'Save Changes' : 'Create Branding'}
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateBrandingModal;



// import { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const CreateBrandingModal = ({ 
//   show, 
//   handleClose, 
//   refreshBranding,
//   editMode = false,
//   brandingToEdit = null,
//   tenantSlug
// }) => {
//   const { user } = useAuthContext();
//   const [formData, setFormData] = useState({
//     name: '',
//     addresses: [''],
//     phones: [''],
//     social_links: [''],
//     logo: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);
//   const [hasExistingLogo, setHasExistingLogo] = useState(false);

//   // Initialize form data when modal opens or edit mode changes
//   useEffect(() => {
//     if (editMode && brandingToEdit) {
//       setFormData({
//         name: brandingToEdit.name || '',
//         addresses: brandingToEdit.addresses?.length > 0 ? [...brandingToEdit.addresses] : [''],
//         phones: brandingToEdit.phones?.length > 0 ? [...brandingToEdit.phones] : [''],
//         social_links: brandingToEdit.social_links?.length > 0 ? [...brandingToEdit.social_links] : [''],
//         logo: brandingToEdit.logo || null
//       });
      
//       if (brandingToEdit.logo) {
//         setLogoPreview(`${brandingToEdit.logo}`);
//         setHasExistingLogo(true);
//         // Don't try to convert URL to File - this causes CORS issues
//         setLogoFile(null); // We'll handle existing logos differently
//       } else {
//         setLogoPreview(null);
//         setHasExistingLogo(false);
//         setLogoFile(null);
//       }
//     } else {
//       setFormData({
//         name: '',
//         addresses: [''],
//         phones: [''],
//         social_links: [''],
//         logo: null
//       });
//       setLogoPreview(null);
//       setLogoFile(null);
//       setHasExistingLogo(false);
//     }
//     setError(null);
//     setSuccess(false);
//   }, [show, editMode, brandingToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }

//       setLogoFile(file); // Store the actual File object
//       setHasExistingLogo(false); // User uploaded a new file

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setLogoPreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//       setError(null);
//     }
//   };

//   const removeLogo = () => {
//     setLogoFile(null);
//     setLogoPreview(null);
//     setHasExistingLogo(false);
//   };

//   const handleArrayChange = (field, index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => i === index ? value : item)
//     }));
//   };

//   const addArrayField = (field) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: [...prev[field], '']
//     }));
//   };

//   const removeArrayField = (field, index) => {
//     if (formData[field].length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         [field]: prev[field].filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       // Create FormData payload
//       const payload = new FormData();
//       payload.append('name', formData.name);
      
//       // Append arrays (filter out empty values)
//       formData.addresses
//         .filter(addr => addr.trim() !== '')
//         .forEach(addr => payload.append('addresses[]', addr));
      
//       formData.phones
//         .filter(phone => phone.trim() !== '')
//         .forEach(phone => payload.append('phones[]', phone));
      
//       formData.social_links
//         .filter(link => link.trim() !== '')
//         .forEach(link => payload.append('social_links[]', link));

//       // Handle logo based on different scenarios
//       if (logoFile instanceof File) {
//         // Scenario 1: User uploaded a new logo file
//         console.log('Sending new logo file:', logoFile.name);
//         payload.append('logo', logoFile);
//       } else if (editMode && hasExistingLogo && !logoFile) {
//         // Scenario 2: Editing with existing logo, no changes to logo
//         console.log('Keeping existing logo, sending URL:', formData.logo);
//         // Send the existing logo URL to indicate we want to keep it
//         payload.append('existing_logo', formData.logo);
//       } else if (editMode && !hasExistingLogo && !logoFile) {
//         // Scenario 3: Editing and user removed the logo
//         console.log('Removing logo');
//         payload.append('logo', ''); // Send empty to remove logo
//       }
//       // Scenario 4: Creating new branding without logo - don't send logo field

//       // Debug logging
//       console.log('=== BRANDING PAYLOAD ===');
//       console.log('Edit Mode:', editMode);
//       console.log('Has Existing Logo:', hasExistingLogo);
//       console.log('Logo File:', logoFile ? `${logoFile.name} (${logoFile.type})` : 'No file');
//       console.log('FormData contents:');
//       for (let [key, value] of payload.entries()) {
//         if (value instanceof File) {
//           console.log(`${key}:`, `${value.name} (File, ${value.size} bytes)`);
//         } else {
//           console.log(`${key}:`, value);
//         }
//       }
//       console.log('========================');

//       // Determine API endpoint
//       const endpoint = editMode ? 'update' : 'create';
      
//       // Make API call
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/${endpoint}`,
//         payload,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       console.log('API Response:', response.data);

//       setSuccess(true);
//       refreshBranding();
//       setTimeout(() => {
//         handleClose();
//         setSuccess(false);
//       }, 1500);
//     } catch (err) {
//       console.error('API Error:', err);
//       console.error('Error Response:', err.response?.data);
//       setError(err.response?.data?.message || 
//         err.response?.data?.error || 
//         (editMode ? 'Failed to update branding' : 'Failed to create branding'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {editMode ? 'Edit Branding' : 'Create New Branding'}
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           {error && (
//             <Alert variant="danger" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {success && (
//             <Alert variant="success">
//               {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
//             </Alert>
//           )}

//           <Row>
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Estate Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter estate name"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Logo Upload */}
//           <Row>
//             <Col md={12}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Logo</Form.Label>
//                 <div className="border rounded p-3">
//                   {logoPreview ? (
//                     <div className="text-center">
//                       <img 
//                         src={logoPreview} 
//                         alt="Logo preview" 
//                         style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
//                         className="mb-3"
//                       />
//                       <div className="d-flex gap-2 justify-content-center">
//                         <Button
//                           variant="outline-secondary"
//                           onClick={() => document.getElementById('logo-upload').click()}
//                           type="button"
//                         >
//                           <IconifyIcon icon="bx:edit" className="me-1" />
//                           Change Logo
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           onClick={removeLogo}
//                           type="button"
//                         >
//                           <IconifyIcon icon="bx:trash" className="me-1" />
//                           Remove
//                         </Button>
//                       </div>
//                       {hasExistingLogo && !logoFile && (
//                         <div className="mt-2">
//                           <small className="text-muted">
//                             Current logo will be kept. Upload a new file to replace it.
//                           </small>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <div className="mb-3">
//                         <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
//                       </div>
//                       <Button
//                         variant="outline-primary"
//                         onClick={() => document.getElementById('logo-upload').click()}
//                         type="button"
//                       >
//                         <IconifyIcon icon="bx:upload" className="me-1" />
//                         Select Logo
//                       </Button>
//                       <Form.Text className="d-block text-muted mt-2">
//                         Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
//                       </Form.Text>
//                     </div>
//                   )}
//                   <Form.Control
//                     id="logo-upload"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoChange}
//                     style={{ display: 'none' }}
//                   />
//                 </div>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Rest of the form fields (addresses, phones, social_links) */}
//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Addresses</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('addresses')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Address
//                 </Button>
//               </div>
//               {formData.addresses.map((address, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="text"
//                       value={address}
//                       onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
//                       placeholder="Enter address"
//                     />
//                     {formData.addresses.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('addresses', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Phone Numbers</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('phones')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Phone
//                 </Button>
//               </div>
//               {formData.phones.map((phone, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => handleArrayChange('phones', index, e.target.value)}
//                       placeholder="Enter phone number"
//                     />
//                     {formData.phones.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('phones', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>

//           <Row>
//             <Col md={12}>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label>Social Links</Form.Label>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm" 
//                   onClick={() => addArrayField('social_links')}
//                   type="button"
//                 >
//                   <IconifyIcon icon="bi:plus" className="me-1" />
//                   Add Social Link
//                 </Button>
//               </div>
//               {formData.social_links.map((link, index) => (
//                 <Form.Group key={index} className="mb-2">
//                   <div className="d-flex gap-2">
//                     <Form.Control
//                       type="url"
//                       value={link}
//                       onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
//                       placeholder="https://example.com"
//                     />
//                     {formData.social_links.length > 1 && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeArrayField('social_links', index)}
//                         type="button"
//                         style={{ width: '42px' }}
//                       >
//                         <IconifyIcon icon="bx:trash" />
//                       </Button>
//                     )}
//                   </div>
//                 </Form.Group>
//               ))}
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button variant="primary" type="submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
//                 {editMode ? 'Updating...' : 'Creating...'}
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
//                 {editMode ? 'Save Changes' : 'Create Branding'}
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateBrandingModal;


import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateBrandingModal = ({ 
  show, 
  handleClose, 
  refreshBranding,
  editMode = false,
  brandingToEdit = null,
  tenantSlug
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    addresses: [''],
    phones: [''],
    social_links: [''],
    logo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [hasExistingLogo, setHasExistingLogo] = useState(false);

  // Initialize form data when modal opens or edit mode changes
  useEffect(() => {
    if (editMode && brandingToEdit) {
      setFormData({
        name: brandingToEdit.name || '',
        addresses: brandingToEdit.addresses?.length > 0 ? [...brandingToEdit.addresses] : [''],
        phones: brandingToEdit.phones?.length > 0 ? [...brandingToEdit.phones] : [''],
        social_links: brandingToEdit.social_links?.length > 0 ? [...brandingToEdit.social_links] : [''],
        logo: brandingToEdit.logo || null
      });
      
      if (brandingToEdit.logo) {
        setLogoPreview(`${brandingToEdit.logo}`);
        setHasExistingLogo(true);
        setLogoFile(null);
      } else {
        setLogoPreview(null);
        setHasExistingLogo(false);
        setLogoFile(null);
      }
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        addresses: [''],
        phones: [''],
        social_links: [''],
        logo: null
      });
      setLogoPreview(null);
      setLogoFile(null);
      setHasExistingLogo(false);
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, brandingToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      setHasExistingLogo(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setHasExistingLogo(false);
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      
      // Append arrays (filter out empty values)
      formData.addresses
        .filter(addr => addr.trim() !== '')
        .forEach(addr => payload.append('addresses[]', addr.trim()));
      
      formData.phones
        .filter(phone => phone.trim() !== '')
        .forEach(phone => payload.append('phones[]', phone.trim()));
      
      formData.social_links
        .filter(link => link.trim() !== '')
        .forEach(link => payload.append('social_links[]', link.trim()));

      // Handle logo
      if (logoFile instanceof File) {
        payload.append('logo', logoFile);
      } else if (editMode && !logoFile && !hasExistingLogo) {
        // User removed existing logo
        payload.append('logo', '');
      }

      const endpoint = editMode ? 'update' : 'create';
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/brand/${endpoint}`;
      
      console.log('Making request to:', url);
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Branding operation successful:', response.data);
      
      setSuccess(true);
      refreshBranding();
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err) {
      console.error('Branding operation failed:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          (editMode ? 'Failed to update branding' : 'Failed to create branding');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon={editMode ? "bx:edit" : "bi:plus"} className="me-2" />
          {editMode ? 'Edit Branding' : 'Create New Branding'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <strong>Success!</strong> {editMode ? 'Branding updated successfully!' : 'Branding created successfully!'}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Estate Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter estate name"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Logo Upload */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Logo</Form.Label>
                <div className="border rounded p-3">
                  {logoPreview ? (
                    <div className="text-center">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                        className="mb-3"
                      />
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="outline-secondary"
                          onClick={() => document.getElementById('logo-upload').click()}
                          type="button"
                          disabled={loading}
                        >
                          <IconifyIcon icon="bx:edit" className="me-1" />
                          Change Logo
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={removeLogo}
                          type="button"
                          disabled={loading}
                        >
                          <IconifyIcon icon="bx:trash" className="me-1" />
                          Remove
                        </Button>
                      </div>
                      {hasExistingLogo && !logoFile && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Current logo will be kept. Upload a new file to replace it.
                          </small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-3">
                        <IconifyIcon icon="bx:image-add" style={{ fontSize: '3rem' }} className="text-muted" />
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => document.getElementById('logo-upload').click()}
                        type="button"
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:upload" className="me-1" />
                        Select Logo
                      </Button>
                      <Form.Text className="d-block text-muted mt-2">
                        Recommended: Square image, max 5MB (JPEG, PNG, GIF, WebP)
                      </Form.Text>
                    </div>
                  )}
                  <Form.Control
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Addresses */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Addresses</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('addresses')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Address
                </Button>
              </div>
              {formData.addresses.map((address, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={address}
                      onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
                      placeholder="Enter address"
                      disabled={loading}
                    />
                    {formData.addresses.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('addresses', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>

          {/* Phone Numbers */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Phone Numbers</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('phones')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Phone
                </Button>
              </div>
              {formData.phones.map((phone, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => handleArrayChange('phones', index, e.target.value)}
                      placeholder="Enter phone number"
                      disabled={loading}
                    />
                    {formData.phones.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('phones', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>

          {/* Social Links */}
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Social Links</Form.Label>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => addArrayField('social_links')}
                  type="button"
                  disabled={loading}
                >
                  <IconifyIcon icon="bi:plus" className="me-1" />
                  Add Social Link
                </Button>
              </div>
              {formData.social_links.map((link, index) => (
                <Form.Group key={index} className="mb-2">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="url"
                      value={link}
                      onChange={(e) => handleArrayChange('social_links', index, e.target.value)}
                      placeholder="https://example.com"
                      disabled={loading}
                    />
                    {formData.social_links.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayField('social_links', index)}
                        type="button"
                        style={{ width: '42px' }}
                        disabled={loading}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Branding'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateBrandingModal;