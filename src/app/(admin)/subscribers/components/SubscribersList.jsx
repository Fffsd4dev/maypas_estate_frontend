import { useState } from 'react';
import { Card, CardBody, Col, Row, Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SubscribersListView from './SubscribersListView';
import SubscribeEstateModal from './SubscribeEstateModal';

const SubscribersList = ({ subscribers, pagination, onPageChange, refreshSubscribers }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure subscribers is always an array
  const subscribersArray = Array.isArray(subscribers) ? subscribers : [];

  const handleSubscribeClick = () => {
    setShowModal(true);
  };

  const filteredSubscribers = subscribersArray.filter(subscriber => 
    subscriber.estate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate pagination items
  const paginationItems = [];
  for (let page = 1; page <= pagination.last_page; page++) {
    paginationItems.push(
      <Pagination.Item 
        key={page} 
        active={page === pagination.current_page}
        onClick={() => onPageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search by estate or plan..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSubscribeClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Subscribe Estate
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {subscribersArray.length > 0 ? (
        <>
          <SubscribersListView 
            subscribers={filteredSubscribers}
            refreshSubscribers={refreshSubscribers}
          />
          
          {/* Pagination */}
          {pagination.last_page > 1 && (
            <Row className="mt-3">
              <Col xs={12}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {' '}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {' '}
                    {pagination.total} entries
                  </div>
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => onPageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                    />
                    {paginationItems}
                    <Pagination.Next 
                      onClick={() => onPageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                    />
                  </Pagination>
                </div>
              </Col>
            </Row>
          )}
        </>
      ) : (
        <div className="alert alert-info">No subscribers found</div>
      )}

      <SubscribeEstateModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshSubscribers={refreshSubscribers}
      />
    </>
  );
};

export default SubscribersList;



