import { FC, useEffect, useState } from 'react';
import { addUser, updateUser } from '../../../reducers/user';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { handleChangeSelectValue, handleChangeText } from 'lib/event-handles';
import { useDispatch, useSelector } from 'react-redux';

import { ChangeEvent } from 'react';
import { GetServerSideProps } from 'next';
import IconButton from 'components/icon-button';
import { MenuItem } from '@material-ui/core';
import { Role } from '../../../src/auth/interfaces/role.enum';
import { RootState } from 'reducers';
import Select from '@material-ui/core/Select';
import { Switch } from '@material-ui/core';
import TextInput from 'components/text-input';
import { UpdateUserDto } from '../../../src/user/dto/update-user.dto';
import { UserDto } from '../../../src/auth/dto/user.dto';
import WidgetContainer from 'components/widget-container';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface PrevUser extends Omit<UpdateUserDto, 'password'> {
  username: string;
}
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

  const isUpdateMode = prevUser ? true : false;

  const [username, setUsername] = useState<string>(prevUser?.username || '');
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>(prevUser?.role || Role.ADMIN);

  const isActive =
    username.trim() !== '' && !isUpdateMode ? password.trim() !== '' : !changePassword || password.trim() !== '';

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChangePassword(checked);
  };

  const handleClickSubmit = () => {
    if (!isActive || user.addUser.loading || user.updateUser.loading) return;
    if (!prevUser) {
      dispatch(
        addUser({
          username: username.trim(),
          password: password.trim(),
          role,
        })
      );
    } else {
      if (prevUser.role === role && (!changePassword || password.trim() === '')) {
        router.push('/setting/users');
      } else {
        dispatch(
          updateUser({
            id: prevUser.id,
            password: changePassword ? password.trim() : undefined,
            role,
            systemAdmin: prevUser.systemAdmin,
          })
        );
      }
    }
  };

  useEffect(() => {
    if ((isUpdateMode && user.updateUser.done) || (!isUpdateMode && user.addUser.done)) {
      router.push('/setting/users');
    }
  }, [user]);

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
            disabled={prevUser !== undefined}
          />
        </div>
        {isUpdateMode && (
          <div className="input-wrapper">
            <span className="category">Change password</span>
            <span className="switch-wrapper">
              <Switch
                className="switch"
                checked={changePassword}
                color="primary"
                onChange={handleChangePassword}
                disabled={!auth.user?.systemAdmin && !!prevUser?.systemAdmin}
              />
            </span>
          </div>
        )}

        {(!isUpdateMode || changePassword) && (
          <div className="input-wrapper">
            <span className="category">Password</span>
            <TextInput
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChangeText(setPassword)}
            />
          </div>
        )}

        <div className="input-wrapper">
          <span className="category">Role</span>
          <div className="input-select-wrapper">
            <Select value={role} onChange={handleChangeSelectValue(setRole)} disabled={!!prevUser?.systemAdmin}>
              <MenuItem value={Role.ADMIN}>ADMIN</MenuItem>
              <MenuItem value={Role.MANAGER}>MANAGER</MenuItem>
              <MenuItem value={Role.VIEWER}>VIEWER</MenuItem>
            </Select>
          </div>
        </div>

        {(auth.user?.systemAdmin || !prevUser?.systemAdmin) && (
          <IconButton
            className={`button-add ${isActive ? 'button-add-active' : ''}`}
            type="submit"
            icon={isUpdateMode ? 'edit' : 'plus'}
            loading={user[isUpdateMode ? 'updateUser' : 'addUser'].loading}
            onClick={handleClickSubmit}
          >
            {isUpdateMode ? 'Update' : 'Add user'}
          </IconButton>
        )}
      </WidgetContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: UserPageProps = {};
  const { user } = context.query;
  if (user) {
    props.prevUser = JSON.parse(user as string) as UserDto;
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
