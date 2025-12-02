import { currentYear, developedBy, developedByLink } from '@/context/constants';
import IconifyIcon from '../wrappers/IconifyIcon';
import { Col, Container, Row } from 'react-bootstrap';
const Footer = () => {
  return <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            <span className="icons-center">
              {' '}
              {currentYear} © MaypasEstate. All Rights Reserved.
              {/* <IconifyIcon icon="iconamoon:heart-duotone" className="fs-18 align-middle text-danger" /> */}
            </span>
          </Col>
        </Row>
      </Container>
    </footer>;
};
export default Footer;