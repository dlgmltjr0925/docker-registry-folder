import { FC } from 'react';
import styled from 'styled-components';

interface DashboardPageProps {}

const DashboardPage: FC<DashboardPageProps> = () => {
  return <Container>DashboardPage</Container>;
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;
`;

export default DashboardPage;
