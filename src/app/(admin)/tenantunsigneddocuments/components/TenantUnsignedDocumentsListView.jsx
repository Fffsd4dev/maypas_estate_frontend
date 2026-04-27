import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge, Spinner } from 'react-bootstrap';

const TenantUnsignedDocumentsListView = ({ 
  documents, 
  onViewClick, 
  onSignClick, 
  onDownloadClick, 
  tenantSlug,
  signingDocumentId // Add this prop
}) => {
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get urgency badge based on creation date
  const getUrgencyBadge = (createdAt) => {
    if (!createdAt) return null;
    
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 14) {
      return (
        <Badge bg="danger" className="ms-2">
          <IconifyIcon icon="bx:alert" className="me-1" />
          Overdue
        </Badge>
      );
    } else if (diffDays > 7) {
      return (
        <Badge bg="warning" className="ms-2">
          <IconifyIcon icon="bx:time-five" className="me-1" />
          Urgent
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Document</th>
              <th>Status</th>
              <th>Actions</th>
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
                      <span className="fw-semibold d-block">
                        {doc.document?.name || 'Untitled Document'}
                        {getUrgencyBadge(doc.created_at)}
                      </span>
                      <small className="text-muted">
                        {doc.document?.filename ? (
                          <>
                            <IconifyIcon icon="bx:file" size="12" className="me-1" />
                            {doc.document.filename}
                          </>
                        ) : (
                          <span className="text-warning">
                            <IconifyIcon icon="bx:error" size="12" className="me-1" />
                            File not available
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge bg="warning" className="px-2 py-1">
                    <IconifyIcon icon="bx:time" className="me-1" />
                    Awaiting Your Signature
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    {doc.document?.filename ? (
                      <>
                        <button 
                          className="btn btn-sm btn-primary d-flex align-items-center justify-content-center"
                          onClick={() => onSignClick(doc)}
                          title="Sign Document"
                          disabled={signingDocumentId === doc.uuid}
                          style={{ minWidth: '38px', minHeight: '38px' }}
                        >
                          {signingDocumentId === doc.uuid ? (
                            <Spinner 
                              animation="border" 
                              size="sm" 
                              variant="light"
                            />
                          ) : (
                            <IconifyIcon icon="bx:edit" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-muted small">File unavailable</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TenantUnsignedDocumentsListView;