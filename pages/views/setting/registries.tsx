import { ChangeEventHandler, FC, KeyboardEventHandler, useEffect, useState } from 'react';
import { faDatabase, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { removeRegistries, searchRegistry } from '../../../reducers/registry';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '../../../components/icon-button';
import { RegistryDto } from 'src/registry/dto/registry.dto';
import { RootState } from '../../../reducers';
import SettingRegistryItem from '../../../components/setting-registry-item';
import WidgetContainer from '../../../components/widget-container';
import WidgetSearch from '../../../components/widget-search';
import { handleChangeText } from '../../../lib/event-handles';
import { openAlertDialog } from 'reducers/alert-dialog';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface RegistriesPageProps {}

const RegistriesPage: FC<RegistriesPageProps> = () => {
  const { auth, registry } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const route = useRouter();

  const [keyword, setKeyword] = useState<string>('');
  const [selectedRegistries, setSelectedRegistries] = useState<number[]>([]);

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Enter') {
      dispatch(searchRegistry(keyword));
      setSelectedRegistries([]);
    }
  };

  const handleChangeAllRegistries: ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    setSelectedRegistries(checked ? registry.search.searchedRegistries.map(({ id }) => id) : []);
  };

  const handleClickRegistryItem = ({ id }: RegistryDto, checked: boolean) => {
    if (checked) {
      setSelectedRegistries([...selectedRegistries, id]);
    } else {
      setSelectedRegistries(selectedRegistries.filter((registryId) => registryId !== id));
    }
  };

  const handleClickRemove = () => {
    if (selectedRegistries.length === 0) return;
    dispatch(
      openAlertDialog({
        content: 'Are you sure you want to remove the registries?',
        options: {
          buttons: [
            {
              label: 'Delete',
              onClick: () => {
                dispatch(removeRegistries(selectedRegistries));
              },
            },
          ],
          cancelable: true,
        },
      })
    );
  };

  const handleClickAdd = () => {
    route.push('/setting/registry');
  };

  useEffect(() => {
    setSelectedRegistries([]);
  }, [registry.search.searchedRegistries.length]);

  useEffect(() => {
    dispatch(searchRegistry(''));
  }, []);

  return (
    <Container>
      <WidgetContainer title="Registries" titleIcon={faDatabase}>
        <div className="widget-sub-container">
          <IconButton
            className={`widget-button button-remove ${selectedRegistries.length > 0 ? 'button-remove-active' : ''}`}
            icon={faTrashAlt}
            onClick={handleClickRemove}
          >
            Remove
          </IconButton>
          <IconButton className="widget-button button-add" icon={faPlus} onClick={handleClickAdd}>
            Add registry
          </IconButton>
        </div>
        <WidgetSearch
          placeholder="Search by name, host, tag..."
          value={keyword}
          onChange={handleChangeText(setKeyword)}
          onKeyPress={handleKeyPress}
        />
        {registry.search.searchedRegistries.length === 0 ? (
          <p className="empty-list-label">No registry available</p>
        ) : (
          <>
            <div className="registry-list-header">
              <input
                type="checkbox"
                checked={selectedRegistries.length === registry.search.searchedRegistries.length}
                onChange={handleChangeAllRegistries}
              />
              <span className="name">name</span>
              <span className="host">host</span>
              <span className="tag">tag</span>
            </div>
            <ul className="registry-list-container">
              {registry.search.searchedRegistries.map((registry) => (
                <SettingRegistryItem
                  key={registry.id}
                  item={registry}
                  checked={selectedRegistries.includes(registry.id)}
                  onChange={handleClickRegistryItem}
                />
              ))}
            </ul>
          </>
        )}
      </WidgetContainer>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;

  .widget-sub-container {
    .button-remove {
      background: var(--button-red-inactive);
      margin-right: 12px;
    }

    .button-remove-active {
      background: var(--button-red-active);

      &:hover {
        background: var(--button-red-hover);
      }
    }

    .button-add {
      background: var(--button-blue-active);

      &:hover {
        background: var(--button-blue-hover);
      }
    }
  }

  .registry-list-header {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #ccc;
    background-color: #f6f6f6;

    input[type='checkbox'] {
      margin-right: 10px;
      cursor: pointer;
    }

    span {
      flex: 1;
      font-size: 14px;
      font-weight: 700;
      text-transform: capitalize;
    }

    .host {
      flex: 2;
    }
  }
`;

export default RegistriesPage;
