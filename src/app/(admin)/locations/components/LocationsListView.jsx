import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const LocationsListView = ({ locations, onEditClick, onDeleteClick }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: '60px' }}>S/N</th>
              <th>Location Name</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => (
              <tr key={location.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{location.name}</span>
                  {/* <small className="text-muted d-block">
                    ID: {location.id}
                  </small> */}
                </td>
                <td>
                  <span className="text-muted">
                    {/* <IconifyIcon icon="bx:calendar" className="me-1" /> */}
                    {formatDate(location.created_at)}
                  </span>
                </td>
                <td>
                  <span className="text-muted">
                    {/* <IconifyIcon icon="bx:time" className="me-1" /> */}
                    {formatDate(location.updated_at)}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(location)}
                    title="Edit Location"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(location)}
                    title="Delete Location"
                  >
                    <IconifyIcon icon="bx:trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LocationsListView;