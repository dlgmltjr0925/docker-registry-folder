import { ChangeEvent, FC, useEffect, useState } from 'react';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { handleChangeSelectValue, handleChangeText } from 'lib/event-handles';
import { useDispatch, useSelector } from 'react-redux';

import { GetServerSideProps } from 'next';
import IconButton from 'components/icon-button';
import { MenuItem } from '@material-ui/core';
import { Role } from 'src/auth/interfaces/role.enum';
import { RootState } from 'reducers';
import Select from '@material-ui/core/Select';
import TextInput from 'components/text-input';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDto } from '../../../src/auth/dto/user.dto';
import WidgetContainer from 'components/widget-container';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface PrevUser extends Omit<UpdateUserDto, 'password'> {}
interface UserPageProps {
  prevUser?: PrevUser;
}

const UserPage: FC<UserPageProps> = ({ prevUser }) => {
  const { auth, user } = useSelector(({ auth, user }: RootState) => ({
    auth,
    user,
  }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState<string>(prevUser?.username || '');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>(prevUser?.role || Role.ADMIN);

  const isUpdateMode = prevUser ? true : false;
  const isActive = username.trim() !== '' && password.trim() !== '';

  const handleClickSubmit = () => {
    // if (!isActive || user.addRegistry.loading || user.updateRegistry.loading) return;
    // if (!prevRegistry) {
    //   dispatch(
    //     addRegistry({
    //       name: name.trim(),
    //       host: host.trim(),
    //       tag: tag.trim() !== '' ? tag.trim() : null,
    //       username: hasAuth ? username : null,
    //       password: hasAuth ? password : null,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     updateRegistry({
    //       ...prevRegistry,
    //       name: name.trim(),
    //       host: host.trim(),
    //       tag: tag.trim() !== '' ? tag.trim() : null,
    //       username: hasAuth ? username : null,
    //       password: hasAuth ? password : null,
    //     })
    //   );
    // }
  };

  // useEffect(() => {
  //   if ((isUpdateMode && registry.updateRegistry.done) || (!isUpdateMode && registry.addRegistry.done)) {
  //     router.push('/setting/registries');
  //   }
  // }, [registry]);

  return (
    <Container>
      <WidgetContainer className="container">
        <div className="input-wrapper">
          <span className="category">Username</span>
          <TextInput
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleChangeText(setUsername)}
          />
        </div>
        <div className="input-wrapper">
          <span className="category">Password</span>
          <TextInput
            className="input"
            type="password"
            placeholder="myregistry.myserver.io"
            value={password}
            onChange={handleChangeText(setPassword)}
          />
        </div>
        <div className="input-wrapper">
          <span className="category">Role</span>
          <div className="input-select-wrapper">
            <Select value={role} onChange={handleChangeSelectValue(setRole)}>
              <MenuItem value={Role.ADMIN}>ADMIN</MenuItem>
              <MenuItem value={Role.MANAGER}>MANAGER</MenuItem>
              <MenuItem value={Role.VIEWER}>VIEWER</MenuItem>
            </Select>
          </div>
        </div>

        <IconButton
          className={`button-add ${isActive ? 'button-add-active' : ''}`}
          type="submit"
          icon={isUpdateMode ? faEdit : faPlus}
          // loading={registry[isUpdateMode ? 'updateRegistry' : 'addRegistry'].loading}
          onClick={handleClickSubmit}
        >
          {isUpdateMode ? 'Update' : 'Add registry'}
        </IconButton>
      </WidgetContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: UserPageProps = {};
  const { user } = context.query;
  if (user) {
    const { id, username, role } = JSON.parse(user as string) as UserDto;
    props.prevUser = {
      id,
      username,
      role,
    };
  }

  return {
    props,
  };
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;

  .container {
    padding: 30px;

    .input-wrapper {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      align-items: center;

      .category {
        width: 30%;
        font-size: 16px;
        font-weight: 600;
      }

      .input {
        flex: 1;

        & > div {
          height: 40px;
        }
      }

      .input-select-wrapper {
        display: inline-flex;
        width: 100%;

        & > div {
          width: 150px;
          font-size: 14px;
        }

        .MuiSelect-root {
          padding-left: 14px;
        }
      }

      .switch-wrapper {
        width: 100%;
      }
    }

    .button-add {
      margin-top: 30px;
      align-self: flex-start;
      background-color: var(--button-blue-inactive);
    }

    .button-add-active {
      background-color: var(--button-blue-active);

      &:hover {
        background-color: var(--button-blue-hover);
      }
    }
  }
`;

export default UserPage;
