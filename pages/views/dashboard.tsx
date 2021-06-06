import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { RegistryDto } from 'src/registry/dto/registry.dto';
import styled from 'styled-components';

interface DashboardPageProps {
  registry?: RegistryDto;
}

const DashboardPage: FC<DashboardPageProps> = () => {
  return <Container>DashboardPage</Container>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: DashboardPageProps = {};

  return {
    props,
  };
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;
`;

export default DashboardPage;
