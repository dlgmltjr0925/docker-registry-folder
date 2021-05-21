import { handleChangeText } from 'lib/event-handles';
import { useRouter } from 'next/dist/client/router';
import { FC, KeyboardEventHandler, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { search } from 'reducers/registry';
import { RegistryDto } from 'src/registry/dto/registry.dto';
import styled from 'styled-components';

import { faServer } from '@fortawesome/free-solid-svg-icons';

import WidgetContainer from '../../components/widget-container';
import WidgetSearch from '../../components/widget-search';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const { auth, registry } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));
  const dispatch = useDispatch();
  const router = useRouter();

  const [keyword, setKeyword] = useState<string>('');

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Enter') {
      dispatch(search(keyword));
    }
  };

  if (!auth.accessToken) return null;

  return (
    <Container>
      <WidgetContainer title="Registries" titleIcon={faServer}>
        <WidgetSearch
          placeholder="Search by name, tag, status, URL..."
          value={keyword}
          onChange={handleChangeText(setKeyword)}
          onKeyPress={handleKeyPress}
        />
        {registry.searchedRegistries.length === 0 ? (
          <div>No registry available</div>
        ) : (
          <ul>
            {registry.searchedRegistries.map((registry) => {
              return <div id={`${registry.id}`}>{registry.name}</div>;
            })}
          </ul>
        )}
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
