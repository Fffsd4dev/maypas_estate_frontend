





import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ApartmentsListView = ({ apartments, onEditClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const handleRowClick = (apartment) => {
    navigate(`/${tenantSlug}/properties/apartments/${apartment.uuid}/units`, { 
      state: { apartment } 
    });
  };

  // Function to safely access landlord name
  const getLandlordName = (apartment) => {
    return apartment.land_lord ? apartment.land_lord.name : 'NOT ASSIGNED';
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Category</th>
              <th>Address</th>
              <th>Location</th>
              <th>Landlord</th>
              <th>Estate Manager</th>
              <th>Units Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apartment, index) => (
              <tr 
                key={apartment.uuid} 
                onClick={() => handleRowClick(apartment)}
                style={{ cursor: 'pointer' }}
                className="apartment-row"
              >
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <div>
                    <span className="fw-semibold">{apartment.category_name || 'N/A'}</span>
                  </div>
                  <small className="text-muted">{apartment.category_description || ''}</small>
                </td>
                <td>
                  <span className="text-muted">{apartment.address}</span>
                </td>
                <td>
                  <span className="text-muted">{apartment.location}</span>
                </td>
                <td>
                  <span className="text-muted">{getLandlordName(apartment)}</span>
                </td>
                <td>
                  <span className="text-muted">{apartment.estate_manager?.estate_name || 'N/A'}</span>
                </td>
                <td>
                  <span className="badge bg-primary">
                    {apartment.apartment_units?.length || 0}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(apartment)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(apartment)}
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

export default ApartmentsListView;