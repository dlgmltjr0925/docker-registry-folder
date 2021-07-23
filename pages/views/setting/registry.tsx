import { ChangeEvent, FC, useEffect, useState } from 'react';
import { addRegistry, updateRegistry } from 'reducers/registry';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { GetServerSideProps } from 'next';
import IconButton from 'components/icon-button';
import { RootState } from 'reducers';
import { Switch } from '@material-ui/core';
import TextInput from 'components/text-input';
import { UpdateRegistryDto } from 'src/registry/dto/update-registry.dto';
import WidgetContainer from 'components/widget-container';
import { handleChangeText } from 'lib/event-handles';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface RegistryPageProps {
  prevRegistry?: UpdateRegistryDto;
}

const RegistryPage: FC<RegistryPageProps> = ({ prevRegistry }) => {
  const { auth, registry } = useSelector(({ auth, registry }: RootState) => ({
    auth,
    registry,
  }));

  if (!auth.accessToken) return null;

  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState<string>(prevRegistry?.name || '');
  const [host, setHost] = useState<string>(prevRegistry?.host || '');
  const [tag, setTag] = useState<string>(prevRegistry?.tag || '');
  const [hasAuth, setHasAuth] = useState<boolean>(!!(prevRegistry?.username && prevRegistry?.password));
  const [username, setUsername] = useState<string>(prevRegistry?.username || '');
  const [password, setPassword] = useState<string>(prevRegistry?.password || '');

  const isUpdateMode = prevRegistry ? true : false;
  const isActive =
    name.trim() !== '' && host.trim() !== '' && (!hasAuth || (username.trim() !== '' && password.trim() !== ''));

  const handleChangeAuth = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasAuth(checked);
  };

  const handleClickSubmit = () => {
    if (!isActive || registry.addRegistry.loading || registry.updateRegistry.loading) return;
    if (!prevRegistry) {
      dispatch(
        addRegistry({
          name: name.trim(),
          host: host.trim(),
          tag: tag.trim() !== '' ? tag.trim() : null,
          username: hasAuth ? username : null,
          password: hasAuth ? password : null,
        })
      );
    } else {
      dispatch(
        updateRegistry({
          ...prevRegistry,
          name: name.trim(),
          host: host.trim(),
          tag: tag.trim() !== '' ? tag.trim() : null,
          username: hasAuth ? username : null,
          password: hasAuth ? password : null,
        })
      );
    }
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
          <span className="category">Name</span>
          <TextInput
            className="input"
            type="text"
            placeholder="my-custom-registry"
            value={name}
            onChange={handleChangeText(setName)}
          />
        </div>
        <div className="input-wrapper">
          <span className="category">Host</span>
          <TextInput
            className="input"
            type="text"
            placeholder="myregistry.myserver.io"
            value={host}
            onChange={handleChangeText(setHost)}
          />
        </div>
        <div className="input-wrapper">
          <span className="category">Tag</span>
          <TextInput
            className="input"
            type="text"
            placeholder="myregistry"
            value={tag}
            onChange={handleChangeText(setTag)}
          />
        </div>
        <div className="input-wrapper">
          <span className="category">Authentication</span>
          <span className="switch-wrapper">
            <Switch className="switch" checked={hasAuth} color="primary" onChange={handleChangeAuth} />
          </span>
        </div>
        {hasAuth && (
          <>
            <div className="input-wrapper">
              <span className="category">Username</span>
              <TextInput
                className="input"
                type="text"
                placeholder="registry username"
                value={username}
                onChange={handleChangeText(setUsername)}
              />
            </div>
            <div className="input-wrapper">
              <span className="category">Password</span>
              <TextInput
                className="input"
                type="password"
                placeholder="registry password"
                value={password}
                onChange={handleChangeText(setPassword)}
              />
            </div>
          </>
        )}

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
  const props: RegistryPageProps = {};
  const { registry } = context.query;
  if (registry) {
    props.prevRegistry = JSON.parse(registry as string) as UpdateRegistryDto;
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

export default RegistryPage;
