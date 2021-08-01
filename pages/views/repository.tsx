import { FC } from 'react';
import WidgetContainer from 'components/widget-container';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

interface RepositoryPageProps {}

const RepositoryPage: FC<RepositoryPageProps> = () => {
  return (
    <Container>
      <WidgetContainer title="Repository" titleIcon={faCube}></WidgetContainer>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;
`;

export default RepositoryPage;
