import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { RegistryDto } from 'src/registry/dto/registry.dto';
import styled from 'styled-components';

import { faServer } from '@fortawesome/free-solid-svg-icons';

import WidgetContainer from '../../components/widget-container';
import WidgetSearch from '../../components/widget-search';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const { auth } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));
  const dispatch = useDispatch();
  const router = useRouter();

  if (!auth.accessToken) return null;

  return (
    <Container>
      <WidgetContainer title="Registries" titleIcon={faServer}>
        <WidgetSearch placeholder="Search by name, tag, status, URL..." />
      </WidgetContainer>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;

  .search-container {
    height: 60px;
  }
`;

export default HomePage;
