import { useRouter } from 'next/dist/client/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { signUp } from 'reducers/auth';
import { Role } from 'src/auth/interfaces/role.enum';
import styled from 'styled-components';

import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import IconButton from '../../../components/icon-button';
import TextInput from '../../../components/text-input';
import { handleChangeText } from '../../../lib/event-handles';

const AdminPage = () => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const isLongPassword = useMemo(() => password.length > 7, [password]);

  const isMatched = useMemo(() => {
    return password.length !== 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const handleClickSignUp = () => {
    if (!isLongPassword || !isMatched) return;
    dispatch(
      signUp({
        username,
        password,
        role: Role.ADMIN,
        systemAdmin: true,
      })
    );
  };

  useEffect(() => {
    if (auth.accessToken) router.replace('/');
  }, [auth]);

  if (auth.accessToken) return null;

  return (
    <Container>
      <div className="input-container">
        <p className="guide">Please create the initial administrator user</p>
        <div className="input-wrapper">
          <TextInput
            className="input"
            type="text"
            label="username"
            value={username}
            onChange={handleChangeText(setUsername)}
          />
        </div>
        <div className="input-wrapper">
          <TextInput
            className="input"
            type="password"
            label="password"
            helperText="The password must be at least 8 characters long"
            value={password}
            onChange={handleChangeText(setPassword)}
            valid={isLongPassword}
          />
        </div>
        <div className="input-wrapper">
          <TextInput
            className="input"
            type="password"
            label="confirm password"
            value={confirmPassword}
            onChange={handleChangeText(setConfirmPassword)}
            valid={isMatched}
          />
        </div>
        <IconButton
          className="sign-up-button"
          variant="contained"
          icon={faUserPlus}
          onClick={handleClickSignUp}
          disabled={!isLongPassword || !isMatched || username === ''}
          loading={auth.loading}
        >
          Create user
        </IconButton>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #f3f3f3;

  .input-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 45px 30px 30px;
    width: 50%;
    min-width: 400px;
    max-width: 700px;
    box-shadow: 0px 0px 10px #ccc;

    .guide {
      margin-bottom: 30px;
    }

    .input-wrapper {
      display: inline-flex;
      margin: 30px 0;
      width: 100%;
      align-items: center;

      .input {
        width: 100%;
        text-transform: capitalize;
      }
    }

    .sign-up-button {
      margin-top: 30px;
    }
  }
`;

export default AdminPage;
