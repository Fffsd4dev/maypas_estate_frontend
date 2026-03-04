import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const ApartmentCategoriesListView = ({ categories, onEditClick, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Category Name</th>
              <th>Description</th>
              {/* <th>UUID</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.uuid}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{category.name}</span>
                </td>
                <td>
                  <span className="text-muted">{category.description || 'No description'}</span>
                </td>
                {/* <td>
                  <span className="text-muted small">{category.uuid}</span>
                </td> */}
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(category)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(category)}
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

export default ApartmentCategoriesListView;