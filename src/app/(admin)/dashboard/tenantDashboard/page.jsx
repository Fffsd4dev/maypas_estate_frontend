import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import Stats from './components/Stats';
import PageMetaData from '@/components/PageTitle';
const FinancePage = () => {
  return <>
      <PageBreadcrumb title="Estate Manager" subName="Dashboard" />
      <PageMetaData title="Estate Manager Dashboard" />

      <Stats />
      {/* <Row>
        <Col xxl={6}>
          <RevenueChart />
        </Col>
        <Col xxl={6}>
          <ExpensesChart />
        </Col>
      </Row>
      <Row>
        <Col xxl={8}>
          <Transactions />
        </Col>
        <Col xxl={4}>
          <RevenueSources />
        </Col>
      </Row> */}
    </>;
};
export default FinancePage;