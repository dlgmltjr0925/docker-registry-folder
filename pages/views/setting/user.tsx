import { ChangeEvent, FC, useEffect, useState } from 'react';
import { addRegistry, updateRegistry } from 'reducers/registry';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { GetServerSideProps } from 'next';
import IconButton from 'components/icon-button';
import { Role } from 'src/auth/interfaces/role.enum';
import { RootState } from 'reducers';
import { Switch } from '@material-ui/core';
import TextInput from 'components/text-input';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import WidgetContainer from 'components/widget-container';
import { handleChangeText } from 'lib/event-handles';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface UserPageProps {
  prevUser?: UpdateUserDto;
}

const UserPage: FC<UserPageProps> = ({ prevUser }) => {
  const { auth, registry } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState<string>(prevUser?.username || '');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>(Role.ADMIN);

  const isUpdateMode = prevUser ? true : false;
  const isActive = username.trim() !== '' && password.trim() !== '';

  const handleClickSubmit = () => {
    if (!isActive || registry.addRegistry.loading || registry.updateRegistry.loading) return;
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

  useEffect(() => {
    if ((isUpdateMode && registry.updateRegistry.done) || (!isUpdateMode && registry.addRegistry.done)) {
      router.push('/setting/registries');
    }
  }, [registry]);

  return (
    <Container>
      <WidgetContainer className="container">
        <div className="input-wrapper">
          <span className="category">Username</span>
          <TextInput
            className="input"
            type="text"
            placeholder="my-custom-registry"
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

        <IconButton
          className={`button-add ${isActive ? 'button-add-active' : ''}`}
          type="submit"
          icon={isUpdateMode ? faEdit : faPlus}
          loading={registry[isUpdateMode ? 'updateRegistry' : 'addRegistry'].loading}
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
    props.prevUser = JSON.parse(user as string) as UpdateUserDto;
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
