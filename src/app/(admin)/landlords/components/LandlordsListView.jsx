import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const LandlordsListView = ({ landlords, onEditClick, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {landlords.map((landlord) => (
              <tr key={landlord.id}>
                <td>
                  <span className="fw-semibold">{landlord.name}</span>
                </td>
                <td>
                  <span className="text-muted">{landlord.phone_number}</span>
                </td>
                <td>
                  <span className="text-muted">{landlord.bank_name}</span>
                </td>
                <td>
                  <span className="text-muted">{landlord.bank_account_number}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(landlord)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(landlord)}
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

export default LandlordsListView;