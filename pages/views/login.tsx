import IconButton from 'components/icon-button';
import TextInput from 'components/text-input';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { signIn } from 'reducers/auth';
import styled from 'styled-components';
import { handleChangeText } from 'utils/event-handles';

import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('handleLogin');
    dispatch(
      signIn({
        username,
        password,
      })
    );
  };

  const handleKeyPress = ({ key }: KeyboardEvent) => {
    if (key === 'Enter') handleLogin();
  };

  useEffect(() => {
    if (auth.accessToken) router.replace('/');
  }, [auth.accessToken]);

  if (auth.accessToken) return null;

  return (
    <Container>
      <div className="input-container">
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
            value={password}
            onChange={handleChangeText(setPassword)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <IconButton
          type="submit"
          className="login-button"
          variant="contained"
          icon={faSignInAlt}
          disabled={username === '' || password === ''}
          loading={auth.loading}
          onClick={handleLogin}
        >
          Login
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
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 45px 30px 30px;
    width: 50%;
    min-width: 400px;
    max-width: 700px;
    box-shadow: 0px 0px 10px #ccc;

    .input-wrapper {
      display: inline-flex;
      margin: 15px 0;
      width: 100%;
      align-items: center;

      .input {
        width: 100%;
        text-transform: capitalize;
      }
    }

    .login-button {
      margin-top: 30px;
      align-self: center;
    }
  }
`;

export default LoginPage;
