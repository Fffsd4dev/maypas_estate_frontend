import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const DocumentsListView = ({ documents, onDeleteClick, onSendClick, tenantSlug }) => {
  // Function to get file icon based on type
  const getFileIcon = (type, filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase() || '';
    
    if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
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

  // Function to handle document download
  const handleDownload = (document) => {
    const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/document/download/${document.filename}`;
    window.open(downloadUrl, '_blank');
  };

  // Function to get file size (if available)
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Type</th>
              <th>Document Name</th>
              <th>File Name</th>
              <th>Apartment ID</th>
              <th>Uploaded Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={document.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <IconifyIcon 
                      icon={getFileIcon(document.type, document.filename)} 
                      className="me-2"
                      style={{ fontSize: '20px' }}
                    />
                    <span className="badge bg-info">{document.type || 'Unknown'}</span>
                  </div>
                </td>
                <td>
                  <span className="fw-semibold">{document.name}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                      {document.filename}
                    </span>
                    <small className="text-muted">
                      {formatFileSize(document.size)}
                    </small>
                  </div>
                </td>
                <td>
                  <span className="badge bg-secondary">
                    {document.apartment_id || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="text-muted">
                    {new Date(document.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-sm btn-light"
                      onClick={() => handleDownload(document)}
                      title="Download Document"
                    >
                      <IconifyIcon icon="bx:download" />
                    </button>
                    <button 
                      className="btn btn-sm btn-light text-primary"
                      onClick={() => onSendClick(document)}
                      title="Send Document"
                    >
                      <IconifyIcon icon="bx:send" />
                    </button>
                    <button 
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => onDeleteClick(document)}
                      title="Delete Document"
                    >
                      <IconifyIcon icon="bx:trash" />
                    </button>
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

export default DocumentsListView;