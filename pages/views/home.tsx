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

const MOCK_REGISTRIES: RegistryDto[] = [
  {
    id: 1,
    name: 'mazzeom1',
    host: 'docker-registry.mazzeom.com',
    tag: 'tag1',
  },
  {
    id: 2,
    name: 'mazzeom2',
    host: 'docker-registry.mazzeom.com',
    tag: 'tag2',
  },
  {
    id: 3,
    name: 'mazzeom3',
    host: 'docker-registry.mazzeom.com',
    tag: 'tag3',
  },
  {
    id: 4,
    name: 'mazzeom4',
    host: 'docker-registry.mazzeom.com',
    tag: 'tag4',
  },
];

const HomePage: FC<HomePageProps> = () => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!auth.accessToken) return null;

  return (
    <Container>
      <WidgetContainer title="Registries" titleIcon={faServer}>
        <WidgetSearch placeholder="Search by name, tag, status, URL..." />
        <ul>
          {MOCK_REGISTRIES.map((registry: RegistryDto) => {
            return <li key={registry.id}>{registry.name}</li>;
          })}
        </ul>
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
