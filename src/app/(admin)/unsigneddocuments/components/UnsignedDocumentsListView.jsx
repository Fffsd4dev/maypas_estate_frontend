import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const UnsignedDocumentsListView = ({ documents, onDeleteClick, onRemindClick, tenantSlug }) => {
  // Function to get file icon based on filename
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      return 'bx:image';
    } else if (['pdf'].includes(extension)) {
      return 'bx:file-pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'bx:file-doc';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'bx:file-xls';
    } else {
      return 'bx:file';
    }
  };

  // Function to get tenant full name
  const getTenantFullName = (tenant) => {
    const parts = [];
    if (tenant?.first_name) parts.push(tenant.first_name);
    if (tenant?.middle_name) parts.push(tenant.middle_name);
    if (tenant?.last_name) parts.push(tenant.last_name);
    return parts.join(' ') || 'Unknown Tenant';
  };

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Document</th>
              <th>Tenant</th>
              <th>File</th>
              <th>Status</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <IconifyIcon 
                      icon={getFileIcon(doc.document?.filename)} 
                      className="me-2"
                      style={{ fontSize: '20px' }}
                    />
                    <div>
                      <span className="fw-semibold d-block">{doc.document?.name || 'N/A'}</span>
                      {/* <small className="text-muted">ID: {doc.document_id}</small> */}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span className="fw-semibold d-block">
                      {getTenantFullName(doc.tenant)}
                    </span>
                    {/* <small className="text-muted">Tenant ID: {doc.tenant_id}</small> */}
                  </div>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                      {doc.document?.filename || 'N/A'}
                    </span>
                  </div>
                </td>
                <td>
                  <Badge bg="warning" className="px-2 py-1">
                    <IconifyIcon icon="bx:time" className="me-1" />
                    Pending Signature
                  </Badge>
                </td>
                {/* <td>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-sm btn-light text-primary"
                      onClick={() => onRemindClick(doc)}
                      title="Send Reminder"
                    >
                      <IconifyIcon icon="bx:bell" />
                    </button>
                    <button 
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => onDeleteClick(doc)}
                      title="Retract Document"
                    >
                      <IconifyIcon icon="bx:undo" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UnsignedDocumentsListView;