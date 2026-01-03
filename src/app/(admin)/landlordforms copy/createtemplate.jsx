// import { useState } from 'react';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';

// const Complaints = () => {
//   const [elements, setElements] = useState([]); // store added elements
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   // Handle adding a textbox
//   const handleAddTextbox = () => {
//     const newElement = {
//       id: Date.now(),
//       type: 'textbox',
//       value: ''
//     };
//     setElements(prev => [...prev, newElement]);
//   };

//   // Handle text change
//   const handleTextChange = (id, value) => {
//     setElements(prev =>
//       prev.map(el => (el.id === id ? { ...el, value } : el))
//     );
//   };

//   return (
//     <>
//       <PageBreadcrumb subName="Apps" title="Create Template" />
//       <PageMetaData title="Template" />

//       <div className="container-fluid bg-light min-vh-100 py-4">
//         <div className="row h-100 justify-content-around">
//           {/* Main editable area */}
//           <div className="col-8 bg-white shadow p-4 rounded-3 min-vh-100">
//             {elements.length === 0 ? (
//               <p className="text-muted text-center">Click a button to add elements</p>
//             ) : (
//               elements.map(el =>
//                 el.type === 'textbox' ? (
//                   <textarea
//                     key={el.id}
//                     className="form-control mb-3"
//                     placeholder="Enter text..."
//                     value={el.value}
//                     onChange={e => handleTextChange(el.id, e.target.value)}
//                     rows={3}
//                   />
//                 ) : null
//               )
//             )}
//           </div>

//           {/* Toolbar */}
//           <div className="col-3 bg-white shadow p-4 rounded-3 min-vh-100 m-auto d-flex flex-column gap-3">
//             <button className="btn btn-primary" onClick={handleAddTextbox}>
//               Add Textbox
//             </button>
//             <button className="btn btn-success">Add Paragraph</button>
//             <button className="btn btn-danger">Add Image</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

//export default Complaints;

// import { useState } from 'react';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useParams } from 'react-router-dom';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';
// //import './Complaints.css';

// const Complaints = () => {
//   const [elements, setElements] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const { user } = useAuthContext();
//   const { tenantSlug } = useParams();

//   // Add new textbox
//   const handleAddTextbox = () => {
//     const newElement = {
//       id: Date.now(),
//       type: 'textbox',
//       value: '',
//     };
//     setElements(prev => [...prev, newElement]);
//   };

//   // Handle text change
//   const handleTextChange = (id, value) => {
//     setElements(prev =>
//       prev.map(el => (el.id === id ? { ...el, value } : el))
//     );
//   };

//   // Delete element
//   const handleDelete = id => {
//     setElements(prev => prev.filter(el => el.id !== id));
//   };

//   return (
//     <>
//       <PageBreadcrumb subName="Apps" title="Create Template" />
//       <PageMetaData title="Template" />

//       <div className="container-fluid bg-light min-vh-100 py-4">
//         <div className="row h-100 justify-content-around">
//           {/* Main editable area */}
//           <div className="col-8 bg-white shadow p-4 rounded-3 min-vh-100 position-relative">
//             {elements.length === 0 ? (
//               <p className="text-muted text-center">
//                 Click a button to add elements
//               </p>
//             ) : (
//               elements.map(el => (
//                 <div
//                   key={el.id}
//                   className={`resizable-container ${selectedId === el.id ? 'selected' : ''}`}
//                   onClick={() => setSelectedId(el.id)}
//                 >
//                   {selectedId === el.id && (
//                     <button
//                       className="delete-btn btn btn-sm btn-danger"
//                       onClick={() => handleDelete(el.id)}
//                     >
//                       ×
//                     </button>
//                   )}
//                   <textarea
//                     className="resizable-textarea"
//                     value={el.value}
//                     onChange={e => handleTextChange(el.id, e.target.value)}
//                     placeholder="Enter text..."
//                   />
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Toolbar */}
//           <div className="col-3 bg-white shadow p-4 rounded-3 min-vh-100 m-auto d-flex flex-column gap-3">
//             <button className="btn btn-primary" onClick={handleAddTextbox}>
//               Add Textbox
//             </button>
//             <button className="btn btn-success">Add Paragraph</button>
//             <button className="btn btn-danger">Add Image</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Complaints;

// import { useState } from 'react';
// import { FormBuilder } from '@formio/react';
// import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
// import PageMetaData from '@/components/PageTitle';

// const CreateTemplate = () => {
//   const [formJson, setFormJson] = useState({ display: 'form', components: [] });

//   const handleChange = (schema) => {
//     setFormJson(schema);
//   };

//   const handleSave = () => {
//     console.log('Template saved:', formJson);
//     // You can POST `formJson` to your Laravel backend here via axios
//   };

//   return (
//     <>
//       <PageBreadcrumb subName="Apps" title="Create Template" />
//       <PageMetaData title="Template" />

//       <div className="container-fluid bg-light min-vh-100 py-4">
//         <div className="bg-white shadow rounded-3 p-4">
//           <h4 className="mb-3">Document Template Builder</h4>
//           <FormBuilder form={formJson} onChange={handleChange} />
//           <div className="text-end mt-3">
//             <button className="btn btn-primary" onClick={handleSave}>
//               Save Template
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateTemplate;


// 'use client';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '@/context/useAuthContext';
// import { FormBuilder } from '@formio/react';

// export default function CreateTemplate({tenantSlug}) {
//   console.log(tenantSlug)
//   const { user } = useAuthContext();
//   const [formData, setFormData] = useState({ display: 'form', components: [] });
//   const [templateName, setTemplateName] = useState('');
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     if (!templateName.trim()) {
//       alert('Please enter a template name.');
//       return;
//     }

//     try {
//       console.log(formData); 
//       console.log(tenantSlug);
//       setSaving(true);
//       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/create`, {
//         name: templateName,
//         form_json: formData,        
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       alert('Template saved successfully!');
//       setTemplateName('');
//       setFormData({ display: 'form', components: [] });
//     } catch (error) {
//       console.error(error);
//       alert('Error saving template');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="h4 mb-3 fw-semibold">Create Template</h2>

//       {/* Input for dynamic template name */}
//       <div className="mb-3">
//         <label className="form-label fw-medium">Template Name</label>
//         <input
//           type="text"
//           value={templateName}
//           onChange={(e) => setTemplateName(e.target.value)}
//           placeholder="e.g. Tenant Onboarding Form"
//           className="form-control"
//         />
//       </div>

//       {/* Form Builder */}
//       <div className="border rounded p-3 bg-white shadow-sm">
//         <FormBuilder
//           form={formData}
//           onChange={(schema) => setFormData(schema)}
//         />
//       </div>

//       {/* Save button */}
//       <button
//         onClick={handleSave}
//         inactive={saving}
//         className="mt-3 btn btn-primary px-4 py-2 rounded inactive opacity-50"
//       >
//         {saving ? 'Saving...' : 'Save Template'}
//       </button>
//     </div>

//   );
// }







// 'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { FormBuilder } from '@formio/react';

const CreateTemplate = ({tenantSlug}) => {
  
  const { user } = useAuthContext();
  console.log(tenantSlug);
  const [formData, setFormData] = useState({ display: 'form', components: [] });
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }

    try {
      console.log(formData); 
      console.log(tenantSlug);
      setSaving(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/create`, {
        name: templateName,
        form_json: formData,        
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert('Template saved successfully!');
      setTemplateName('');
      setFormData({ display: 'form', components: [] });
    } catch (error) {
      console.error(error);
      alert('Error saving template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="h4 mb-3 fw-semibold">Create Template</h2>

      {/* Input for dynamic template name */}
      <div className="mb-3">
        <label className="form-label fw-medium">Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="e.g. Tenant Onboarding Form"
          className="form-control"
        />
      </div>

      {/* Form Builder */}
      <div className="border rounded p-3 bg-white shadow-sm">
        <FormBuilder
          form={formData}
          onChange={(schema) => setFormData(schema)}
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        inactive={saving}
        className="mt-3 btn btn-primary px-4 py-2 rounded inactive opacity-50"
      >
        {saving ? 'Saving...' : 'Save Template'}
      </button>
    </div>

  );
}

export default CreateTemplate;





