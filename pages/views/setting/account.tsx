import { FC, useCallback, useState } from 'react';

import { GetServerSideProps } from 'next';
import IconButton from 'components/icon-button';
import { RootState } from 'reducers';
import TextInput from 'components/text-input';
import { UserDto } from 'src/auth/dto/user.dto';
import WidgetContainer from 'components/widget-container';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { handleChangeText } from 'lib/event-handles';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

interface PrevAccount extends Omit<UserDto, 'password' | 'systemAdmin'> {}
interface AccountPageProps {
  prevAccount?: PrevAccount;
}

const AccountPage: FC<AccountPageProps> = () => {
  const { auth, user } = useSelector(({ auth, user }: RootState) => ({ auth, user }));

  const [username, setUsername] = useState<string>(auth.user?.username || '');
  const [password, setPassword] = useState<string>('');

  const isActive = password.trim() !== '';

  const handleClickSubmit = () => {};

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
            disabled
          />
        </div>
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
        <IconButton
          className={`button-add ${isActive ? 'button-add-active' : ''}`}
          type="submit"
          icon="edit"
          loading={user.updateUser.loading}
          onClick={handleClickSubmit}
        >
          Update
        </IconButton>
      </WidgetContainer>
    </Container>
  );
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

export default AccountPage;
