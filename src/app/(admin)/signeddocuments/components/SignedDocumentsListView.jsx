import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const SignedDocumentsListView = ({ documents, onViewClick, onDownloadClick, onDeleteClick }) => {
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

  // Create a readable name from filename
  const getReadableName = (filename) => {
    if (!filename) return 'Signed Document';
    
    return filename
      .replace('signed_', '')
      .replace(/_/g, ' ')
      .replace('.pdf', '')
      .replace(/\d+/g, '') // Remove numbers
      .trim();
  };

  // Format UUID for display
  const formatUUID = (uuid) => {
    if (!uuid) return 'N/A';
    return `${uuid.substring(0, 8)}...`;
  };

  // Get tenant name from filename (extract from pattern)
  const extractTenantInfo = (filename) => {
    if (!filename) return { name: 'Unknown Tenant', id: 'N/A' };
    
    // Try to extract tenant ID from filename pattern like "signed_5_1770634410.pdf"
    const matches = filename.match(/signed_(\d+)_/);
    const tenantId = matches ? matches[1] : 'Unknown';
    
    return {
      name: `Tenant ${tenantId}`,
      id: tenantId
    };
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
              <th>File Information</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => {
              const tenantInfo = extractTenantInfo(doc.filename);
              
              return (
                <tr key={doc.uuid}>
                  <td>
                    <span className="fw-semibold">{index + 1}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <IconifyIcon 
                        icon={getFileIcon(doc.filename)} 
                        className="me-2"
                        style={{ fontSize: '20px' }}
                      />
                      <div>
                        <span className="fw-semibold d-block">
                          {getReadableName(doc.filename)}
                        </span>
                        <small className="text-muted">
                          ID: {formatUUID(doc.uuid)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="fw-semibold d-block">
                        {tenantInfo.name}
                      </span>
                      {/* <small className="text-muted">
                        <IconifyIcon icon="bx:user" size="12" className="me-1" />
                        ID: {tenantInfo.id}
                      </small> */}
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="d-block">
                        <IconifyIcon icon="bx:file" className="me-1" size="14" />
                        {doc.filename || 'No filename'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Badge bg="success" className="px-2 py-1">
                        <IconifyIcon icon="bx:check-circle" className="me-1" />
                        Signed
                      </Badge>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-sm btn-light text-primary"
                        onClick={() => onViewClick(doc)}
                        title="View Details"
                      >
                        <IconifyIcon icon="bx:show" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SignedDocumentsListView;