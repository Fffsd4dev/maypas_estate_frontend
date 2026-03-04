import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const TechniciansListView = ({ technicians, onEditClick, onDeleteClick }) => {
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
              <th>Name</th>
              <th>Phone</th>
              <th>Specialty</th>
              {/* <th>Status</th> */}
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((technician, index) => (
              <tr key={technician.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{technician.name || 'N/A'}</span>
                </td>
                <td>
                  <span className="text-muted">{technician.phone || 'N/A'}</span>
                </td>
                <td>
                  <span className="text-muted">{technician.specialist.name || 'N/A'}</span>
                </td>
                {/* <td>
                  <span className={`badge ${technician.deactivated === 'no' ? 'bg-success' : 'bg-danger'}`}>
                    {technician.deactivated === 'no' ? 'Active' : 'Inactive'}
                  </span>
                </td> */}
                <td>
                  <span className="text-muted">{formatDate(technician.created_at)}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(technician)}
                    title="Edit Technician"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(technician)}
                    title="Delete Technician"
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

export default TechniciansListView;