import { ChangeEventHandler, FC, KeyboardEventHandler, useEffect, useMemo, useState } from 'react';
import { faPlus, faTrashAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { removeUsers, search } from '../../../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '../../../components/icon-button';
import { RootState } from '../../../reducers';
import SettingUserItem from '../../../components/setting-user-item';
import { UserDto } from '../../../src/auth/dto/user.dto';
import WidgetContainer from '../../../components/widget-container';
import WidgetSearch from '../../../components/widget-search';
import { handleChangeText } from 'lib/event-handles';
import { openAlertDialog } from 'reducers/alert-dialog';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface UsersPageProps {}

const UsersPage: FC<UsersPageProps> = (props) => {
  const { auth, user } = useSelector(({ auth, user }: RootState) => ({ auth, user }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const route = useRouter();

  const [keyword, setKeyword] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const searchedUsers = useMemo(() => {
    return user.search.searchedUsers.filter(({ systemAdmin }) => !systemAdmin);
  }, [user.search.searchedUsers]);

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Enter') {
      dispatch(search(keyword));
      setSelectedUsers([]);
    }
  };

  const handleChangeAllUsers: ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    setSelectedUsers(checked ? searchedUsers.map(({ id }) => id) : []);
  };

  const handleClickUserItem = ({ id }: UserDto, checked: boolean) => {
    setSelectedUsers(checked ? [...selectedUsers, id] : selectedUsers.filter((userId) => userId !== id));
  };

  const handleClickRemove = () => {
    if (selectedUsers.length === 0) return;
    dispatch(
      openAlertDialog({
        content: 'Are you sure you want to remove the users?',
        options: {
          buttons: [
            {
              label: 'Delete',
              onClick: () => {
                dispatch(removeUsers(selectedUsers));
                setSelectedUsers([]);
              },
            },
          ],
          cancelable: true,
        },
      })
    );
  };

  const handleClickAdd = () => {
    route.push('/setting/user');
  };

  useEffect(() => {
    dispatch(search(''));
  }, []);

  return (
    <Container>
      <WidgetContainer title="Users" titleIcon="users">
        <div className="widget-sub-container">
          <IconButton
            className={`widget-button button-remove ${selectedUsers.length > 0 ? 'button-remove-active' : ''}`}
            icon="trash-alt"
            onClick={handleClickRemove}
          >
            Remove
          </IconButton>
          <IconButton className="widget-button button-add" icon="plus" onClick={handleClickAdd}>
            Add User
          </IconButton>
        </div>
        <WidgetSearch
          placeholder="Search by name, role..."
          value={keyword}
          onChange={handleChangeText(setKeyword)}
          onKeyPress={handleKeyPress}
        />
        <div className="user-list-header">
          <input
            type="checkbox"
            checked={selectedUsers.length > 0 && selectedUsers.length === searchedUsers.length}
            onChange={handleChangeAllUsers}
          />
          <span className="name">username</span>
          <span className="host">role</span>
        </div>
        {user.search.searchedUsers.length === 0 ? (
          <p className="empty-list-label">No User available</p>
        ) : (
          <ul className="user-list-container">
            {user.search.searchedUsers.map((searchedUser) => (
              <SettingUserItem
                key={searchedUser.id}
                item={searchedUser}
                checked={selectedUsers.includes(searchedUser.id)}
                onChange={handleClickUserItem}
              />
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

  .user-list-header {
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
  }
`;

export default UsersPage;
