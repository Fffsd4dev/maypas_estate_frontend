import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { FormBuilder } from '@formio/react';

const CreateTemplate = ({tenantSlug}) => {
  
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({ display: 'form', components: [] });
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }

    try {
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





