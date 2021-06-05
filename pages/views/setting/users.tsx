import { faPlus, faTrashAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../components/icon-button';
import WidgetContainer from '../../../components/widget-container';
import { FC, KeyboardEventHandler, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import WidgetSearch from '../../../components/widget-search';
import { handleChangeText } from 'lib/event-handles';
import { search } from 'reducers/users';

interface UsersPageProps {}

const UsersPage: FC<UsersPageProps> = (props) => {
  console.log(props);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Enter') {
      dispatch(search(keyword));
      setSelectedUsers([]);
    }
  };

  const handleClickRemove = () => {
    if (selectedUsers.length === 0) return;
  };

  return (
    <Container>
      <WidgetContainer title="Users" titleIcon={faUsers}>
        <div className="widget-sub-container">
          <IconButton
            className={`widget-button button-remove ${selectedUsers.length > 0 ? 'button-remove-active' : ''}`}
            icon={faTrashAlt}
            onClick={handleClickRemove}
          >
            Remove
          </IconButton>
          <IconButton className="widget-button button-add" icon={faPlus}>
            Add User
          </IconButton>
        </div>
        <WidgetSearch
          placeholder="Search by name, role..."
          value={keyword}
          onChange={handleChangeText(setKeyword)}
          onKeyPress={handleKeyPress}
        />
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

    .button-add {
      background: var(--button-blue-active);

      &:hover {
        background: var(--button-blue-hover);
      }
    }
  }
`;

export default UsersPage;
