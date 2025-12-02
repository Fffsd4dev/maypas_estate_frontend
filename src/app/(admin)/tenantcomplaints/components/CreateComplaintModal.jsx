// // // import { useState, useEffect } from 'react';
// // // import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// // // import axios from 'axios';
// // // import { useAuthContext } from '@/context/useAuthContext';
// // // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // // const CreateComplaintModal = ({ show, handleClose, refreshComplaints, tenantSlug }) => {
// // //   const { user } = useAuthContext();
// // //   const [formData, setFormData] = useState({
// // //     title: '',
// // //     description: '',
// // //     category_id: '',
// // //     priority: 'medium',
// // //     apartment_unit_uuid: ''
// // //   });
// // //   const [evidence, setEvidence] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [success, setSuccess] = useState(false);
// // //   const [categories, setCategories] = useState([]);
// // //   const [apartmentUnits, setApartmentUnits] = useState([]);
// // //   const [loadingData, setLoadingData] = useState(false);

// // //   // Fetch categories and apartment units when modal opens
// // //   useEffect(() => {
// // //     if (show) {
// // //       fetchCategories();
// // //       fetchApartmentUnits();
// // //     }
// // //   }, [show]);

// // //   const fetchCategories = async () => {
// // //     try {
// // //       if (!user?.token) {
// // //         throw new Error('Authentication required');
// // //       }

// // //       const response = await axios.get(
// // //         `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/apartment/categories`,
// // //         {
// // //           headers: {
// // //             'Authorization': `Bearer ${user.token}`,
// // //             'Content-Type': 'application/json'
// // //           }
// // //         }
// // //       );

// // //       console.log('Categories API Response:', response.data);
      
// // //       // Handle different response structures and extract UUID
// // //       let categoriesData = [];
// // //       if (Array.isArray(response.data)) {
// // //         categoriesData = response.data;
// // //       } else if (response.data.categories && Array.isArray(response.data.categories)) {
// // //         categoriesData = response.data.categories;
// // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // //         categoriesData = response.data.data;
// // //       }

// // //       setCategories(categoriesData);
      
// // //       // Set default category if categories are available
// // //       if (categoriesData.length > 0) {
// // //         const firstCategory = categoriesData[0];
// // //         setFormData(prev => ({
// // //           ...prev,
// // //           category_id: firstCategory.uuid || firstCategory.id || ''
// // //         }));
// // //       }
// // //     } catch (err) {
// // //       console.error('Failed to fetch categories:', err);
// // //       setError('Failed to load categories: ' + (err.response?.data?.message || err.message));
// // //       setCategories([]);
// // //     }
// // //   };

// // //   const fetchApartmentUnits = async () => {
// // //     try {
// // //       setLoadingData(true);
// // //       if (!user?.token) {
// // //         throw new Error('Authentication required');
// // //       }

// // //       if (!tenantSlug) {
// // //         throw new Error('Tenant slug not found');
// // //       }

// // //       const response = await axios.get(
// // //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/apartments`,
// // //         {
// // //           headers: {
// // //             'Authorization': `Bearer ${user.token}`,
// // //             'Content-Type': 'application/json'
// // //           }
// // //         }
// // //       );

// // //       console.log('Apartment Units API Response:', response.data);

// // //       // Handle different response structures
// // //       let unitsData = [];
// // //       if (Array.isArray(response.data)) {
// // //         unitsData = response.data;
// // //       } else if (response.data.apartments && Array.isArray(response.data.apartments)) {
// // //         unitsData = response.data.apartments;
// // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // //         unitsData = response.data.data;
// // //       } else if (response.data.units && Array.isArray(response.data.units)) {
// // //         unitsData = response.data.units;
// // //       } else {
// // //         // If it's an object, try to convert it to an array
// // //         unitsData = Object.values(response.data);
// // //       }

// // //       // Ensure we have an array
// // //       if (!Array.isArray(unitsData)) {
// // //         unitsData = [];
// // //       }

// // //       console.log('Processed apartment units:', unitsData);
      
// // //       // Log the first unit to see its structure
// // //       if (unitsData.length > 0) {
// // //         console.log('First apartment unit structure:', unitsData[0]);
// // //         console.log('Available keys in first unit:', Object.keys(unitsData[0]));
// // //       }

// // //       setApartmentUnits(unitsData);
      
// // //       // Set default apartment unit if available - prioritize UUID
// // //       if (unitsData.length > 0) {
// // //         const firstUnit = unitsData[0];
// // //         const unitUuid = firstUnit.uuid || firstUnit.id || firstUnit._id || firstUnit.unit_id || '';
// // //         console.log('Setting default apartment unit UUID:', unitUuid);
        
// // //         setFormData(prev => ({
// // //           ...prev,
// // //           apartment_unit_uuid: unitUuid
// // //         }));
// // //       }
// // //     } catch (err) {
// // //       console.error('Failed to fetch apartment units:', err);
// // //       console.error('Error details:', err.response?.data);
// // //       setError('Failed to load apartment units: ' + (err.response?.data?.message || err.message));
// // //       setApartmentUnits([]);
// // //     } finally {
// // //       setLoadingData(false);
// // //     }
// // //   };

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     console.log(`Field ${name} changed to:`, value);
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: value
// // //     }));
// // //   };

// // //   const handleEvidenceChange = (e) => {
// // //     const file = e.target.files[0];
// // //     if (file) {
// // //       // Validate file type
// // //       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// // //       if (!validTypes.includes(file.type)) {
// // //         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
// // //         return;
// // //       }
      
// // //       // Validate file size (5MB max)
// // //       const maxSize = 5 * 1024 * 1024; // 5MB in bytes
// // //       if (file.size > maxSize) {
// // //         setError('Image size should be less than 5MB');
// // //         return;
// // //       }
      
// // //       setEvidence(file);
// // //       setError(null);
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError(null);

// // //     try {
// // //       if (!user?.token) {
// // //         throw new Error('Authentication required');
// // //       }

// // //       if (!tenantSlug) {
// // //         throw new Error('Tenant slug not found');
// // //       }

// // //       if (!formData.apartment_unit_uuid) {
// // //         throw new Error('Please select an apartment unit');
// // //       }

// // //       if (!formData.category_id) {
// // //         throw new Error('Please select a category');
// // //       }

// // //       // Create FormData for file upload
// // //       const formDataToSend = new FormData();
// // //       formDataToSend.append('title', formData.title);
// // //       formDataToSend.append('description', formData.description);
// // //       formDataToSend.append('category_id', formData.category_id);
// // //       formDataToSend.append('priority', formData.priority);
// // //       // Removed apartment_unit_uuid from FormData since we're putting it in the URL
      
// // //       if (evidence) {
// // //         formDataToSend.append('evidence', evidence);
// // //       }

// // //       console.log('Submitting complaint with data:', {
// // //         title: formData.title,
// // //         description: formData.description,
// // //         category_id: formData.category_id,
// // //         priority: formData.priority,
// // //         apartment_unit_uuid: formData.apartment_unit_uuid,
// // //         hasEvidence: !!evidence
// // //       });

// // //       // Log FormData contents for debugging
// // //       for (let [key, value] of formDataToSend.entries()) {
// // //         console.log(`FormData - ${key}:`, value);
// // //       }

// // //       // Use apartment_unit_uuid in the URL path
// // //       const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/create/${formData.apartment_unit_uuid}`;
// // //       console.log('API URL:', apiUrl);

// // //       await axios.post(
// // //         apiUrl,
// // //         formDataToSend,
// // //         {
// // //           headers: {
// // //             'Authorization': `Bearer ${user.token}`,
// // //             'Content-Type': 'multipart/form-data'
// // //           }
// // //         }
// // //       );

// // //       setSuccess(true);
// // //       refreshComplaints();
// // //       setTimeout(() => {
// // //         handleClose();
// // //         setSuccess(false);
// // //         resetForm();
// // //       }, 1500);
// // //     } catch (err) {
// // //       console.error('Complaint creation error:', err);
// // //       console.error('Error response:', err.response?.data);
// // //       setError(err.response?.data?.message || err.message || 'Failed to create complaint');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     const firstCategory = categories[0];
// // //     const firstUnit = apartmentUnits[0];
    
// // //     setFormData({
// // //       title: '',
// // //       description: '',
// // //       category_id: firstCategory ? (firstCategory.uuid || firstCategory.id || '') : '',
// // //       priority: 'medium',
// // //       apartment_unit_uuid: firstUnit ? (firstUnit.uuid || firstUnit.id || firstUnit._id || firstUnit.unit_id || '') : ''
// // //     });
// // //     setEvidence(null);
// // //     setError(null);
// // //     setSuccess(false);
// // //   };

// // //   const handleModalClose = () => {
// // //     resetForm();
// // //     handleClose();
// // //   };

// // //   const removeEvidence = () => {
// // //     setEvidence(null);
// // //   };

// // //   // Helper function to get display name for apartment unit
// // //   const getApartmentDisplayName = (unit) => {
// // //     if (typeof unit === 'string') return unit;
// // //     if (unit.name) return unit.name;
// // //     if (unit.unitNumber) return `Unit ${unit.unitNumber}`;
// // //     if (unit.apartmentNumber) return `Apartment ${unit.apartmentNumber}`;
// // //     if (unit.unitName) return unit.unitName;
// // //     if (unit.unit_name) return unit.unit_name;
// // //     if (unit.building && unit.unit_number) return `${unit.building} - Unit ${unit.unit_number}`;
// // //     if (unit.unit_number) return `Unit ${unit.unit_number}`;
// // //     if (unit.building_name && unit.unit_number) return `${unit.building_name} - Unit ${unit.unit_number}`;
// // //     return `Unit ${unit.uuid || unit.id || unit._id || unit.unit_id || 'Unknown'}`;
// // //   };

// // //   // Helper function to get display name for category
// // //   const getCategoryDisplayName = (category) => {
// // //     if (typeof category === 'string') return category;
// // //     return category.name || category.title || 'Unknown Category';
// // //   };

// // //   // Helper function to get UUID for category
// // //   const getCategoryValue = (category) => {
// // //     if (typeof category === 'string') return category;
// // //     return category.uuid || category.id || '';
// // //   };

// // //   // Helper function to get UUID for apartment unit - try multiple possible field names
// // //   const getApartmentValue = (unit) => {
// // //     if (typeof unit === 'string') return unit;
    
// // //     // Try various possible UUID field names
// // //     const possibleUuidFields = [
// // //       'uuid', 'id', '_id', 'unit_id', 'apartment_id', 
// // //       'apartment_uuid', 'unit_uuid', 'apartmentUnitId'
// // //     ];
    
// // //     for (const field of possibleUuidFields) {
// // //       if (unit[field]) {
// // //         console.log(`Found UUID in field "${field}":`, unit[field]);
// // //         return unit[field];
// // //       }
// // //     }
    
// // //     // If no UUID field found, return empty string
// // //     console.warn('No UUID field found in unit:', unit);
// // //     return '';
// // //   };

// // //   return (
// // //     <Modal show={show} onHide={handleModalClose} centered size="lg">
// // //       <Modal.Header closeButton>
// // //         <Modal.Title>Create New Complaint</Modal.Title>
// // //       </Modal.Header>
// // //       <Form onSubmit={handleSubmit}>
// // //         <Modal.Body>
// // //           {error && (
// // //             <Alert variant="danger" onClose={() => setError(null)} dismissible>
// // //               {error}
// // //             </Alert>
// // //           )}
          
// // //           {success && (
// // //             <Alert variant="success">
// // //               Complaint created successfully!
// // //             </Alert>
// // //           )}

// // //           {loadingData && (
// // //             <Alert variant="info">
// // //               <IconifyIcon icon="eos-icons:loading" className="me-2" />
// // //               Loading data...
// // //             </Alert>
// // //           )}

// // //           <Row>
// // //             <Col md={6}>
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>Apartment Unit *</Form.Label>
// // //                 <Form.Select
// // //                   name="apartment_unit_uuid"
// // //                   value={formData.apartment_unit_uuid}
// // //                   onChange={handleChange}
// // //                   required
// // //                   disabled={loadingData || !Array.isArray(apartmentUnits) || apartmentUnits.length === 0}
// // //                 >
// // //                   <option value="">Select Apartment Unit</option>
// // //                   {Array.isArray(apartmentUnits) && apartmentUnits.map((unit, index) => {
// // //                     const unitValue = getApartmentValue(unit);
// // //                     const displayName = getApartmentDisplayName(unit);
                    
// // //                     console.log(`Unit ${index}:`, { value: unitValue, display: displayName, unit });
                    
// // //                     return (
// // //                       <option 
// // //                         key={unitValue || index} 
// // //                         value={unitValue}
// // //                       >
// // //                         {displayName}
// // //                       </option>
// // //                     );
// // //                   })}
// // //                 </Form.Select>
// // //                 {(!Array.isArray(apartmentUnits) || apartmentUnits.length === 0) && !loadingData && (
// // //                   <Form.Text className="text-danger">
// // //                     No apartment units available
// // //                   </Form.Text>
// // //                 )}
// // //                 {formData.apartment_unit_uuid && (
// // //                   <Form.Text className="text-muted">
// // //                     Selected UUID: {formData.apartment_unit_uuid}
// // //                   </Form.Text>
// // //                 )}
// // //               </Form.Group>
// // //             </Col>
// // //             <Col md={6}>
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>Complaint Title *</Form.Label>
// // //                 <Form.Control
// // //                   type="text"
// // //                   name="title"
// // //                   value={formData.title}
// // //                   onChange={handleChange}
// // //                   placeholder="Enter complaint title"
// // //                   required
// // //                 />
// // //               </Form.Group>
// // //             </Col>
// // //           </Row>

// // //           <Row>
// // //             <Col md={6}>
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>Category *</Form.Label>
// // //                 <Form.Select
// // //                   name="category_id"
// // //                   value={formData.category_id}
// // //                   onChange={handleChange}
// // //                   required
// // //                   disabled={loadingData || !Array.isArray(categories) || categories.length === 0}
// // //                 >
// // //                   <option value="">Select Category</option>
// // //                   {Array.isArray(categories) && categories.map((category, index) => (
// // //                     <option 
// // //                       key={getCategoryValue(category) || index} 
// // //                       value={getCategoryValue(category)}
// // //                     >
// // //                       {getCategoryDisplayName(category)}
// // //                     </option>
// // //                   ))}
// // //                 </Form.Select>
// // //                 {(!Array.isArray(categories) || categories.length === 0) && !loadingData && (
// // //                   <Form.Text className="text-danger">
// // //                     No categories available
// // //                   </Form.Text>
// // //                 )}
// // //               </Form.Group>
// // //             </Col>
// // //             <Col md={6}>
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>Priority</Form.Label>
// // //                 <Form.Select
// // //                   name="priority"
// // //                   value={formData.priority}
// // //                   onChange={handleChange}
// // //                 >
// // //                   <option value="low">Low</option>
// // //                   <option value="medium">Medium</option>
// // //                   <option value="high">High</option>
// // //                   <option value="urgent">Urgent</option>
// // //                 </Form.Select>
// // //               </Form.Group>
// // //             </Col>
// // //           </Row>

// // //           <Form.Group className="mb-3">
// // //             <Form.Label>Description *</Form.Label>
// // //             <Form.Control
// // //               as="textarea"
// // //               rows={4}
// // //               name="description"
// // //               value={formData.description}
// // //               onChange={handleChange}
// // //               placeholder="Describe your complaint in detail..."
// // //               required
// // //             />
// // //           </Form.Group>

// // //           <Form.Group className="mb-3">
// // //             <Form.Label>Evidence (Image - Optional)</Form.Label>
// // //             <Form.Control
// // //               type="file"
// // //               accept="image/*"
// // //               onChange={handleEvidenceChange}
// // //             />
// // //             <Form.Text className="text-muted">
// // //               Upload an image as evidence (JPEG, PNG, GIF, WebP, max 5MB)
// // //             </Form.Text>
// // //           </Form.Group>

// // //           {evidence && (
// // //             <Alert variant="info" className="d-flex justify-content-between align-items-center">
// // //               <div>
// // //                 <IconifyIcon icon="mdi:file-image" className="me-2" />
// // //                 {evidence.name}
// // //               </div>
// // //               <Button variant="outline-danger" size="sm" onClick={removeEvidence}>
// // //                 <IconifyIcon icon="mdi:close" />
// // //               </Button>
// // //             </Alert>
// // //           )}
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" onClick={handleModalClose}>
// // //             Cancel
// // //           </Button>
// // //           <Button 
// // //             variant="primary" 
// // //             type="submit" 
// // //             disabled={loading || loadingData || !Array.isArray(apartmentUnits) || apartmentUnits.length === 0 || !Array.isArray(categories) || categories.length === 0}
// // //           >
// // //             {loading ? (
// // //               <>
// // //                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
// // //                 Creating...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <IconifyIcon icon="bx:plus" className="me-1" />
// // //                 Create Complaint
// // //               </>
// // //             )}
// // //           </Button>
// // //         </Modal.Footer>
// // //       </Form>
// // //     </Modal>
// // //   );
// // // };

// // // export default CreateComplaintModal;




// // import { useState, useEffect } from 'react';
// // import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// // import axios from 'axios';
// // import { useAuthContext } from '@/context/useAuthContext';
// // import IconifyIcon from '@/components/wrappers/IconifyIcon';

// // const CreateComplaintModal = ({ 
// //   show, 
// //   handleClose, 
// //   refreshComplaints, 
// //   tenantSlug,
// //   editMode = false,
// //   complaintToEdit = null
// // }) => {
// //   const { user } = useAuthContext();
// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     priority: 'medium',
// //     apartment_unit_uuid: ''
// //   });
// //   const [evidence, setEvidence] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);
// //   const [apartmentUnits, setApartmentUnits] = useState([]);
// //   const [loadingData, setLoadingData] = useState(false);

// //   // Fetch apartment units when modal opens and set form data for edit mode
// //   useEffect(() => {
// //     if (show) {
// //       fetchApartmentUnits();
      
// //       if (editMode && complaintToEdit) {
// //         console.log('Editing complaint:', complaintToEdit);
// //         // Get the complaint ID - try different possible fields
// //         const complaintId = complaintToEdit.id || complaintToEdit.complaint_id;
// //         console.log('Complaint ID for editing:', complaintId);
        
// //         setFormData({
// //           title: complaintToEdit.title || '',
// //           description: complaintToEdit.description || '',
// //           priority: complaintToEdit.priority || 'medium',
// //           apartment_unit_uuid: complaintToEdit.apartment_unit_uuid || ''
// //         });
// //       } else {
// //         resetForm();
// //       }
// //     }
// //     setError(null);
// //     setSuccess(false);
// //   }, [show, editMode, complaintToEdit]);

// //   const fetchApartmentUnits = async () => {
// //     try {
// //       setLoadingData(true);
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found');
// //       }

// //       const response = await axios.get(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/tenant/apartments`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       console.log('Apartment Units API Response:', response.data);

// //       // Extract the data array from the response
// //       let unitsData = [];
// //       if (response.data.data && Array.isArray(response.data.data)) {
// //         unitsData = response.data.data;
// //       } else if (Array.isArray(response.data)) {
// //         unitsData = response.data;
// //       } else {
// //         console.warn('Unexpected apartment units response structure:', response.data);
// //         unitsData = [];
// //       }

// //       console.log('Processed apartment units:', unitsData);
      
// //       setApartmentUnits(unitsData);
      
// //       // Set default apartment unit if available and not in edit mode
// //       if (unitsData.length > 0 && !editMode && !formData.apartment_unit_uuid) {
// //         const firstUnit = unitsData[0];
// //         const unitUuid = firstUnit.apartment_unit_uuid;
// //         console.log('Setting default apartment unit UUID:', unitUuid);
        
// //         setFormData(prev => ({
// //           ...prev,
// //           apartment_unit_uuid: unitUuid
// //         }));
// //       }
// //     } catch (err) {
// //       console.error('Failed to fetch apartment units:', err);
// //       console.error('Error details:', err.response?.data);
// //       setError('Failed to load apartment units: ' + (err.response?.data?.message || err.message));
// //       setApartmentUnits([]);
// //     } finally {
// //       setLoadingData(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     console.log(`Field ${name} changed to:`, value);
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleEvidenceChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       // Validate file type
// //       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// //       if (!validTypes.includes(file.type)) {
// //         setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
// //         return;
// //       }
      
// //       // Validate file size (5MB max)
// //       const maxSize = 5 * 1024 * 1024; // 5MB in bytes
// //       if (file.size > maxSize) {
// //         setError('Image size should be less than 5MB');
// //         return;
// //       }
      
// //       setEvidence(file);
// //       setError(null);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       if (!user?.token) {
// //         throw new Error('Authentication required');
// //       }

// //       if (!tenantSlug) {
// //         throw new Error('Tenant slug not found');
// //       }

// //       // For edit mode, we don't require apartment_unit_uuid validation since it's pre-filled and disabled
// //       if (!editMode && !formData.apartment_unit_uuid) {
// //         throw new Error('Please select an apartment unit');
// //       }

// //       // Get the complaint ID for editing
// //       const complaintId = editMode ? (complaintToEdit.id || complaintToEdit.complaint_id) : null;
      
// //       if (editMode && !complaintId) {
// //         throw new Error('Complaint ID not found for editing');
// //       }

// //       // Create FormData for file upload
// //       const formDataToSend = new FormData();
// //       formDataToSend.append('title', formData.title);
// //       formDataToSend.append('description', formData.description);
// //       formDataToSend.append('priority', formData.priority);
      
// //       if (evidence) {
// //         formDataToSend.append('evidence', evidence);
// //       }

// //       console.log('Submitting complaint with data:', {
// //         title: formData.title,
// //         description: formData.description,
// //         priority: formData.priority,
// //         apartment_unit_uuid: formData.apartment_unit_uuid,
// //         hasEvidence: !!evidence,
// //         editMode: editMode,
// //         complaintId: complaintId
// //       });

// //       // Log FormData contents for debugging
// //       for (let [key, value] of formDataToSend.entries()) {
// //         console.log(`FormData - ${key}:`, value);
// //       }

// //       let apiUrl;
// //       let method;

// //       if (editMode) {
// //         // Use PUT method for editing and include complaint ID in URL
// //         method = 'post';
// //         apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/update/${complaintId}`;
// //         console.log('Edit API URL:', apiUrl);
        
// //         // For edit, also send the apartment_unit_uuid in FormData
// //         formDataToSend.append('apartment_unit_uuid', formData.apartment_unit_uuid);
// //       } else {
// //         // Use POST method for creating new complaint
// //         method = 'post';
// //         apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/create/${formData.apartment_unit_uuid}`;
// //         console.log('Create API URL:', apiUrl);
// //       }

// //       const response = await axios({
// //         method: method,
// //         url: apiUrl,
// //         data: formDataToSend,
// //         headers: {
// //           'Authorization': `Bearer ${user.token}`,
// //           'Content-Type': 'multipart/form-data'
// //         }
// //       });

// //       console.log(`${editMode ? 'Update' : 'Create'} response:`, response.data);

// //       setSuccess(true);
// //       refreshComplaints();
// //       setTimeout(() => {
// //         handleClose();
// //         setSuccess(false);
// //         resetForm();
// //       }, 1500);
// //     } catch (err) {
// //       console.error('Complaint operation error:', err);
// //       console.error('Error response:', err.response?.data);
// //       console.error('Error status:', err.response?.status);
// //       setError(err.response?.data?.message || err.message || 
// //         (editMode ? 'Failed to update complaint' : 'Failed to create complaint'));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetForm = () => {
// //     const firstUnit = apartmentUnits[0];
    
// //     setFormData({
// //       title: '',
// //       description: '',
// //       priority: 'medium',
// //       apartment_unit_uuid: firstUnit ? firstUnit.apartment_unit_uuid : ''
// //     });
// //     setEvidence(null);
// //     setError(null);
// //     setSuccess(false);
// //   };

// //   const handleModalClose = () => {
// //     resetForm();
// //     handleClose();
// //   };

// //   const removeEvidence = () => {
// //     setEvidence(null);
// //   };

// //   // Helper function to get display name for apartment unit
// //   const getApartmentDisplayName = (unit) => {
// //     if (!unit) return 'Unknown Unit';
    
// //     // Use apartment_unit_name from the API response
// //     if (unit.apartment_unit_name) return unit.apartment_unit_name;
    
// //     // Fallback to other possible fields
// //     if (unit.name) return unit.name;
// //     if (unit.unitNumber) return `Unit ${unit.unitNumber}`;
// //     if (unit.apartmentNumber) return `Apartment ${unit.apartmentNumber}`;
    
// //     return `Unit ${unit.apartment_unit_uuid || 'Unknown'}`;
// //   };

// //   // Helper function to get UUID for apartment unit
// //   const getApartmentValue = (unit) => {
// //     if (!unit) return '';
    
// //     // Use apartment_unit_uuid from the API response
// //     if (unit.apartment_unit_uuid) {
// //       return unit.apartment_unit_uuid;
// //     }
    
// //     // Fallback to other possible UUID fields
// //     const possibleUuidFields = ['uuid', 'id', '_id', 'unit_id'];
// //     for (const field of possibleUuidFields) {
// //       if (unit[field]) {
// //         return unit[field];
// //       }
// //     }
    
// //     return '';
// //   };

// //   return (
// //     <Modal show={show} onHide={handleModalClose} centered size="lg">
// //       <Modal.Header closeButton>
// //         <Modal.Title>
// //           {editMode ? 'Edit Complaint' : 'Create New Complaint'}
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
// //               {editMode ? 'Complaint updated successfully!' : 'Complaint created successfully!'}
// //             </Alert>
// //           )}

// //           {loadingData && (
// //             <Alert variant="info">
// //               <IconifyIcon icon="eos-icons:loading" className="me-2" />
// //               Loading data...
// //             </Alert>
// //           )}

// //           <Row>
// //             <Col md={6}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Apartment Unit {!editMode && '*'}</Form.Label>
// //                 <Form.Select
// //                   name="apartment_unit_uuid"
// //                   value={formData.apartment_unit_uuid}
// //                   onChange={handleChange}
// //                   required={!editMode} // Only require for create mode
// //                   disabled={loadingData || apartmentUnits.length === 0 || editMode}
// //                 >
// //                   <option value="">Select Apartment Unit</option>
// //                   {apartmentUnits.map((unit, index) => {
// //                     const unitValue = getApartmentValue(unit);
// //                     const displayName = getApartmentDisplayName(unit);
                    
// //                     return (
// //                       <option 
// //                         key={unitValue || index} 
// //                         value={unitValue}
// //                       >
// //                         {displayName}
// //                       </option>
// //                     );
// //                   })}
// //                 </Form.Select>
// //                 {apartmentUnits.length === 0 && !loadingData && (
// //                   <Form.Text className="text-danger">
// //                     No apartment units available
// //                   </Form.Text>
// //                 )}
// //                 {editMode && (
// //                   <Form.Text className="text-muted">
// //                     Apartment unit cannot be changed when editing a complaint
// //                   </Form.Text>
// //                 )}
// //               </Form.Group>
// //             </Col>
// //             <Col md={6}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Complaint Title *</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   name="title"
// //                   value={formData.title}
// //                   onChange={handleChange}
// //                   placeholder="Enter complaint title"
// //                   required
// //                 />
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           <Row>
// //             <Col md={6}>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Priority</Form.Label>
// //                 <Form.Select
// //                   name="priority"
// //                   value={formData.priority}
// //                   onChange={handleChange}
// //                 >
// //                   <option value="low">Low</option>
// //                   <option value="medium">Medium</option>
// //                   <option value="high">High</option>
// //                   <option value="urgent">Urgent</option>
// //                 </Form.Select>
// //               </Form.Group>
// //             </Col>
// //           </Row>

// //           <Form.Group className="mb-3">
// //             <Form.Label>Description *</Form.Label>
// //             <Form.Control
// //               as="textarea"
// //               rows={4}
// //               name="description"
// //               value={formData.description}
// //               onChange={handleChange}
// //               placeholder="Describe your complaint in detail..."
// //               required
// //             />
// //           </Form.Group>

// //           <Form.Group className="mb-3">
// //             <Form.Label>Evidence (Image - Optional)</Form.Label>
// //             <Form.Control
// //               type="file"
// //               accept="image/*"
// //               onChange={handleEvidenceChange}
// //             />
// //             <Form.Text className="text-muted">
// //               Upload an image as evidence (JPEG, PNG, GIF, WebP, max 5MB)
// //             </Form.Text>
// //             {editMode && complaintToEdit?.evidence && (
// //               <Form.Text className="text-info">
// //                 Current evidence: {complaintToEdit.evidence}
// //               </Form.Text>
// //             )}
// //           </Form.Group>

// //           {evidence && (
// //             <Alert variant="info" className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <IconifyIcon icon="mdi:file-image" className="me-2" />
// //                 {evidence.name}
// //               </div>
// //               <Button variant="outline-danger" size="sm" onClick={removeEvidence}>
// //                 <IconifyIcon icon="mdi:close" />
// //               </Button>
// //             </Alert>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={handleModalClose}>
// //             Cancel
// //           </Button>
// //           <Button 
// //             variant="primary" 
// //             type="submit" 
// //             disabled={loading || loadingData || (!editMode && apartmentUnits.length === 0)}
// //           >
// //             {loading ? (
// //               <>
// //                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
// //                 {editMode ? 'Updating...' : 'Creating...'}
// //               </>
// //             ) : (
// //               <>
// //                 <IconifyIcon icon={editMode ? "bx:save" : "bx:plus"} className="me-1" />
// //                 {editMode ? 'Save Changes' : 'Create Complaint'}
// //               </>
// //             )}
// //           </Button>
// //         </Modal.Footer>
// //       </Form>
// //     </Modal>
// //   );
// // };

// // export default CreateComplaintModal;



// import { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';

// const CreateComplaintModal = ({ 
//   show, 
//   handleClose, 
//   refreshComplaints, 
//   tenantSlug,
//   complaintToEdit = null
// }) => {
//   const { user } = useAuthContext();
//   const [formData, setFormData] = useState({
//     status: 'open'
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Set form data when modal opens or complaintToEdit changes
//   useEffect(() => {
//     if (show && complaintToEdit) {
//       console.log('Editing complaint:', complaintToEdit);
      
//       // Set the current status from the complaint data
//       setFormData({
//         status: complaintToEdit.status || 'open'
//       });
//     }
//     setError(null);
//     setSuccess(false);
//   }, [show, complaintToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(`Field ${name} changed to:`, value);
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('Authentication required');
//       }

//       if (!tenantSlug) {
//         throw new Error('Tenant slug not found');
//       }

//       // Get the complaint ID for updating
//       const complaintId = complaintToEdit?.id || complaintToEdit?.complaint_id;
      
//       if (!complaintId) {
//         throw new Error('Complaint ID not found for updating');
//       }

//       // Prepare the data for the API - only status field
//       const updateData = {
//         status: formData.status
//       };

//       console.log('Updating complaint status with data:', updateData);
//       console.log('Complaint ID:', complaintId);

//       const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/complaint/update/${complaintId}`;
//       console.log('Update API URL:', apiUrl);

//       const response = await axios.put(
//         apiUrl,
//         updateData,
//         {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Update response:', response.data);

//       setSuccess(true);
//       refreshComplaints();
//       setTimeout(() => {
//         handleClose();
//         setSuccess(false);
//         resetForm();
//       }, 1500);
//     } catch (err) {
//       console.error('Complaint update error:', err);
//       console.error('Error response:', err.response?.data);
//       console.error('Error status:', err.response?.status);
//       setError(err.response?.data?.message || err.message || 'Failed to update complaint status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       status: 'open'
//     });
//     setError(null);
//     setSuccess(false);
//   };

//   const handleModalClose = () => {
//     resetForm();
//     handleClose();
//   };

//   // Helper function to display complaint information
//   const getComplaintInfo = () => {
//     if (!complaintToEdit) return null;
    
//     return (
//       <Alert variant="info">
//         <strong>Complaint:</strong> {complaintToEdit.title}<br />
//         <strong>Current Status:</strong> <span className="text-capitalize">{complaintToEdit.status?.replace('_', ' ')}</span>
//       </Alert>
//     );
//   };

//   return (
//     <Modal show={show} onHide={handleModalClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Update Complaint Status</Modal.Title>
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
//               Complaint status updated successfully!
//             </Alert>
//           )}

//           {complaintToEdit && getComplaintInfo()}

//           <Form.Group className="mb-3">
//             <Form.Label>Status *</Form.Label>
//             <Form.Select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//             >
//               <option value="open">Open</option>
//               <option value="under_review">Under Review</option>
//               <option value="resolved">Resolved</option>
//               <option value="closed">Closed</option>
//             </Form.Select>
//             <Form.Text className="text-muted">
//               Select the new status for this complaint
//             </Form.Text>
//           </Form.Group>

//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleModalClose}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             type="submit" 
//             disabled={loading || !complaintToEdit}
//           >
//             {loading ? (
//               <>
//                 <IconifyIcon icon="eos-icons:loading" className="me-1" />
//                 Updating...
//               </>
//             ) : (
//               <>
//                 <IconifyIcon icon="bx:save" className="me-1" />
//                 Update Status
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateComplaintModal;



import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateComplaintModal = ({ 
  show, 
  handleClose, 
  refreshComplaints, 
  tenantSlug,
  editMode = false,
  complaintToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    status: 'open'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Set form data when modal opens or complaintToEdit changes
  useEffect(() => {
    if (show && complaintToEdit) {
      console.log('CreateComplaintModal - Editing complaint:', complaintToEdit);
      console.log('Current status:', complaintToEdit.status);
      
      // Set the current status from the complaint data
      setFormData({
        status: complaintToEdit.status || 'open'
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, complaintToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      if (!tenantSlug) {
        throw new Error('Tenant slug not found');
      }

      // Get the complaint ID for updating
      const complaintId = complaintToEdit?.id || complaintToEdit?.complaint_id;
      
      if (!complaintId) {
        throw new Error('Complaint ID not found for updating');
      }

      // Prepare the data for the API - only status field
      const updateData = {
        status: formData.status
      };

      console.log('Updating complaint status with data:', updateData);
      console.log('Complaint ID:', complaintId);

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/complaint/update/${complaintId}`;
      console.log('Update API URL:', apiUrl);

      const response = await axios.patch(
        apiUrl,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);

      setSuccess(true);
      refreshComplaints();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        resetForm();
      }, 1500);
    } catch (err) {
      console.error('Complaint update error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.message || 'Failed to update complaint status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      status: 'open'
    });
    setError(null);
    setSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Helper function to display complaint information
  const getComplaintInfo = () => {
    if (!complaintToEdit) return null;
    
    return (
      <Alert variant="info">
        <strong>Complaint:</strong> {complaintToEdit.title}<br />
        <strong>Current Status:</strong> <span className="text-capitalize">{complaintToEdit.status?.replace('_', ' ')}</span>
      </Alert>
    );
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMode ? 'Update Complaint Status' : 'Create New Complaint'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              Complaint status updated successfully!
            </Alert>
          )}

          {complaintToEdit && getComplaintInfo()}

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Select the new status for this complaint
            </Form.Text>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !complaintToEdit}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                Updating...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:save" className="me-1" />
                Update Status
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateComplaintModal;