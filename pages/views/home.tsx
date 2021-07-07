import { FC, KeyboardEventHandler, useEffect, useState } from 'react';
import { removeRegistry, searchRegistry } from 'reducers/registry';
import { useDispatch, useSelector } from 'react-redux';

import { RegistryDto } from 'src/registry/dto/registry.dto';
import RegistryItem from '../../components/registry-item';
import { RootState } from 'reducers';
import WidgetContainer from '../../components/widget-container';
import WidgetSearch from '../../components/widget-search';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { handleChangeText } from 'lib/event-handles';
import { openAlertDialog } from 'reducers/alert-dialog';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const { auth, registry } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const router = useRouter();

  const [keyword, setKeyword] = useState<string>('');

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Enter') {
      dispatch(searchRegistry(keyword));
    }
  };

  const handleClickRemove = ({ id }: RegistryDto) => {
    dispatch(
      openAlertDialog({
        content: 'Are you sure you want to remove the registry?',
        options: {
          buttons: [
            {
              label: 'Delete',
              onClick: () => {
                dispatch(removeRegistry(id));
              },
            },
          ],
          cancelable: true,
        },
      })
    );
  };

  useEffect(() => {
    dispatch(searchRegistry(''));
  }, []);

  return (
    <Container>
      <WidgetContainer title="Registries" titleIcon={faServer}>
        <WidgetSearch
          placeholder="Search by name, host, tag..."
          value={keyword}
          onChange={handleChangeText(setKeyword)}
          onKeyPress={handleKeyPress}
        />
        {registry.search.searchedRegistries.length === 0 ? (
          <p className="empty-list-label">No registry available</p>
        ) : (
          <ul>
            {registry.search.searchedRegistries.map((registry, index) => (
              <RegistryItem key={registry.id} item={registry} onClickRemove={handleClickRemove} />
            ))}
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

  .empty-list-label {
    color: #777;
    text-align: center;
    padding: 20px;
    font-size: 15px;
  }
`;

export default HomePage;
