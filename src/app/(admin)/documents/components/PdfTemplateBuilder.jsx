import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Button, Form, Card, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

// Register fonts (optional)
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf'
});

// PDF Field Types
const FIELD_TYPES = [
  { id: 'text', label: 'Text Field', icon: 'bx:text' },
  { id: 'textarea', label: 'Multi-line Text', icon: 'bx:paragraph' },
  { id: 'date', label: 'Date Field', icon: 'bx:calendar' },
  { id: 'signature', label: 'Signature', icon: 'bx:edit' },
  { id: 'checkbox', label: 'Checkbox', icon: 'bx:checkbox-checked' },
  { id: 'select', label: 'Dropdown', icon: 'bx:list-ul' }
];

const PdfTemplateBuilder = ({ formData, onChange }) => {
  const [fields, setFields] = useState(formData.pdf_fields || []);
  const [selectedField, setSelectedField] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 595, height: 842 }); // A4 in points

  // Add a new field to the PDF
  const addField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} Field`,
      x: 50,
      y: 100,
      width: 200,
      height: fieldType === 'signature' ? 80 : 24,
      required: false,
      options: fieldType === 'select' ? ['Option 1', 'Option 2'] : []
    };
    
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onChange({ ...formData, pdf_fields: updatedFields });
  };

  // Update field properties
  const updateField = (fieldId, updates) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onChange({ ...formData, pdf_fields: updatedFields });
    setSelectedField({ ...selectedField, ...updates });
  };

  // Remove a field
  const removeField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    onChange({ ...formData, pdf_fields: updatedFields });
    setSelectedField(null);
  };

  // Generate PDF preview
  const PdfPreview = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{formData.name || 'Document Template'}</Text>
        
        {fields.map((field) => {
          const fieldStyle = {
            position: 'absolute',
            left: field.x,
            top: field.y + 50, // Offset for title
            width: field.width,
            borderBottom: '1px solid #ccc',
            fontSize: 10
          };

          return (
            <View key={field.id} style={fieldStyle}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={{ height: field.height - 15 }} />
            </View>
          );
        })}

        {/* Add signature areas */}
        {fields.filter(f => f.type === 'signature').map((field) => (
          <View 
            key={field.id} 
            style={{
              position: 'absolute',
              left: field.x,
              top: field.y + 50,
              width: field.width,
              height: field.height,
              border: '1px solid #000',
              padding: 5
            }}
          >
            <Text style={{ fontSize: 8, color: '#666' }}>Sign here</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div className="pdf-template-builder">
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">PDF Preview</h6>
            </Card.Header>
            <Card.Body>
              <div className="border rounded p-3 bg-light" 
                   style={{ 
                     width: '100%', 
                     height: '500px',
                     overflow: 'auto',
                     position: 'relative',
                     background: 'linear-gradient(45deg, #f9f9f9 25%, transparent 25%, transparent 75%, #f9f9f9 75%, #f9f9f9 0)',
                     backgroundSize: '20px 20px'
                   }}
              >
                {/* Interactive PDF Canvas */}
                <div 
                  style={{ 
                    width: `${pageDimensions.width / 2}px`,
                    height: `${pageDimensions.height / 2}px`,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    margin: '0 auto'
                  }}
                >
                  {/* Field placement area */}
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`field-placeholder ${selectedField?.id === field.id ? 'selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${field.x / 2}px`,
                        top: `${(field.y + 50) / 2}px`,
                        width: `${field.width / 2}px`,
                        height: `${field.height / 2}px`,
                        border: selectedField?.id === field.id ? '2px solid #007bff' : '1px dashed #ccc',
                        backgroundColor: field.type === 'signature' ? '#f8f9fa' : 'transparent',
                        cursor: 'move',
                        padding: '2px',
                        fontSize: '8px'
                      }}
                      onClick={() => setSelectedField(field)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('fieldId', field.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fieldId = e.dataTransfer.getData('fieldId');
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        updateField(fieldId, { 
                          x: x * 2, 
                          y: y * 2 - 50 
                        });
                      }}
                    >
                      <small>{field.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          {/* Field Types Palette */}
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Add Field</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                {FIELD_TYPES.map((fieldType) => (
                  <Col xs={6} key={fieldType.id} className="mb-2">
                    <Button
                      variant="outline-primary"
                      className="w-100 d-flex flex-column align-items-center py-2"
                      onClick={() => addField(fieldType.id)}
                    >
                      <IconifyIcon icon={fieldType.icon} className="mb-1" />
                      <small>{fieldType.label}</small>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Field Properties Editor */}
          {selectedField && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Field Properties</h6>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeField(selectedField.id)}
                >
                  <IconifyIcon icon="bx:trash" />
                </Button>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Label</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>X Position</Form.Label>
                        <Form.Control
                          type="number"
                          value={selectedField.x}
                          onChange={(e) => updateField(selectedField.id, { x: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Y Position</Form.Label>
                        <Form.Control
                          type="number"
                          value={selectedField.y}
                          onChange={(e) => updateField(selectedField.id, { y: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Width</Form.Label>
                        <Form.Control
                          type="number"
                          value={selectedField.width}
                          onChange={(e) => updateField(selectedField.id, { width: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Height</Form.Label>
                        <Form.Control
                          type="number"
                          value={selectedField.height}
                          onChange={(e) => updateField(selectedField.id, { height: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Check
                    type="checkbox"
                    label="Required Field"
                    checked={selectedField.required}
                    onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                    className="mb-3"
                  />
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto'
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  fieldLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2
  }
});

export default PdfTemplateBuilder;