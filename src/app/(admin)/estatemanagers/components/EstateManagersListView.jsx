import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const EstateManagersListView = ({ managers, onEditClick, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              {/* <th>Name</th>
              <th>Email</th> */}
              <th>Estate Name</th>
              <th>slug</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id}>
                {/* <td>
                  <span className="fw-semibold">{manager.first_name} {manager.last_name}</span>
                </td>
                <td>
                  <span className="text-muted">{manager.email}</span>
                </td> */}
                <td>
                  <span className="text-muted">{manager.estate_name}</span>
                </td>
                <td>
                  <span className="text-muted">{manager.slug}</span>
                </td>
                <td>
                  {new Date(manager.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(manager)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(manager)}
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

export default EstateManagersListView;