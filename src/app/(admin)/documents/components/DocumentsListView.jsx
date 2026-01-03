// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import { Card, Badge } from 'react-bootstrap';

// const DocumentsListView = ({ documents, onEditClick, onPreviewClick, onDeleteClick }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const countFormFields = (formJson) => {
//     if (!formJson || !formJson.components) return 0;
//     return formJson.components.length;
//   };

//   return (
//     <Card className="overflow-hidden mt-3">
//       <div className="table-responsive">
//         <table className="table table-hover mb-0">
//           <thead className="table-light">
//             <tr>
//               <th>S/N</th>
//               <th>Template Name</th>
//               <th>Fields Count</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Updated At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {documents.map((document, index) => (
//               <tr key={document.uuid || document.id}>
//                 <td>
//                   <span className="fw-semibold">{index + 1}</span>
//                 </td>
//                 <td>
//                   <span className="fw-semibold">{document.name || 'N/A'}</span>
//                 </td>
//                 <td>
//                   <Badge bg="info" className="fw-normal">
//                     {countFormFields(document.form_json)} fields
//                   </Badge>
//                 </td>
//                 <td>
//                   <Badge 
//                     bg={document.status === 'active' ? 'success' : 
//                         document.status === 'draft' ? 'warning' : 'secondary'}
//                     className="fw-normal"
//                   >
//                     {document.status || 'draft'}
//                   </Badge>
//                 </td>
//                 <td>
//                   <span className="text-muted">{formatDate(document.created_at)}</span>
//                 </td>
//                 <td>
//                   <span className="text-muted">{formatDate(document.updated_at) || 'N/A'}</span>
//                 </td>
//                 <td>
//                   <button 
//                     className="btn btn-sm btn-light me-2"
//                     onClick={() => onPreviewClick(document)}
//                     title="Preview Template"
//                   >
//                     <IconifyIcon icon="bx:show" />
//                   </button>
//                   <button 
//                     className="btn btn-sm btn-light me-2"
//                     onClick={() => onEditClick(document)}
//                     title="Edit Template"
//                   >
//                     <IconifyIcon icon="bx:edit" />
//                   </button>
//                   <button 
//                     className="btn btn-sm btn-light text-danger"
//                     onClick={() => onDeleteClick(document)}
//                     title="Delete Template"
//                   >
//                     <IconifyIcon icon="bx:trash" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default DocumentsListView;



import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const DocumentsListView = ({ documents, onEditClick, onSignClick, onDeleteClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const countFormFields = (formJson) => {
    if (!formJson || !formJson.components) return 0;
    return formJson.components.length;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Template Name</th>
              <th>Fields Count</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={document.uuid || document.id}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{document.name || 'N/A'}</span>
                </td>
                <td>
                  <Badge bg="info" className="fw-normal">
                    {countFormFields(document.form_json)} fields
                  </Badge>
                </td>
                <td>
                  <Badge bg="primary" className="fw-normal">
                    PDF Template
                  </Badge>
                </td>
                <td>
                  <Badge 
                    bg={document.status === 'active' ? 'success' : 
                        document.status === 'draft' ? 'warning' : 'secondary'}
                    className="fw-normal"
                  >
                    {document.status || 'draft'}
                  </Badge>
                </td>
                <td>
                  <span className="text-muted">{formatDate(document.created_at)}</span>
                </td>
                <td>
                  <span className="text-muted">{formatDate(document.updated_at) || 'N/A'}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-success me-2"
                    onClick={() => onSignClick(document)}
                    title="Sign Document"
                  >
                    <IconifyIcon icon="bx:edit-alt" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(document)}
                    title="Edit Template"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(document)}
                    title="Delete Template"
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

export default DocumentsListView;