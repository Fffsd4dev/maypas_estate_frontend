import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Badge } from 'react-bootstrap';

const AgentsListView = ({ agents, userTypes = [], onViewClick, onDeleteClick }) => {
  
  // Ensure userTypes is always an array
  const safeUserTypes = Array.isArray(userTypes) ? userTypes : [];

  // Helper function to get user type name by ID
  const getUserTypeName = (userTypeId) => {
    const userType = safeUserTypes.find(type => type.id == userTypeId);
    return userType ? (userType.name || `Type ${userType.id}`) : 'Unknown';
  };

  // Helper function to get UUID from agent
  const getAgentUuid = (agent) => {
    // Try different possible UUID field names
    return agent.uuid || agent.id || agent.uid || agent.guid;
  };

  // Helper to truncate UUID for display
  const truncateUuid = (uuid) => {
    if (!uuid) return '-';
    if (uuid.length <= 12) return uuid;
    return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 4)}`;
  };

  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              {/* <th>User Type</th> */}
              {/* <th>UUID</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => {
              const agentUuid = getAgentUuid(agent);
              return (
                <tr key={agentUuid || `agent-${index}`}>
                  <td>
                    <span className="fw-semibold">{agent.first_name} {agent.last_name}</span>
                  </td>
                  <td>
                    <span className="text-muted">{agent.email || '-'}</span>
                  </td>
                  <td>
                    <span className="text-muted">{agent.phone || '-'}</span>
                  </td>
                  {/* <td>
                    <span className="text-muted">{getUserTypeName(agent.user_type)}</span>
                  </td> */}
                  {/* <td>
                    <span 
                      className="text-muted small" 
                      title={agentUuid || 'No UUID'}
                      style={{ cursor: 'help' }}
                    >
                      {truncateUuid(agentUuid)}
                    </span>
                  </td> */}
                  <td>
                    <Badge bg="success">Active</Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-light"
                        onClick={() => onViewClick(agent)}
                        title="View Details"
                      >
                        <IconifyIcon icon="bx:show" />
                      </button>
                      <button 
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => onDeleteClick(agent)}
                        title="Delete Agent"
                      >
                        <IconifyIcon icon="bx:trash" />
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

export default AgentsListView;