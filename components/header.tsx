import { FC, useCallback, useMemo } from 'react';
import { faSignOutAlt, faUserCircle, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { RootState } from 'reducers';
import { signOut } from 'reducers/auth';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface HeaderProps {}

const getRouteName = (route: string): [string, string | string[]] => {
  switch (route) {
    case '/views/home':
      return ['home', 'registries'];
    case '/views/dashboard':
      return ['dashboard', ''];
    case '/views/repository':
      return ['repository', ''];
    case '/views/setting/account':
      return ['account', 'account management'];
    case '/views/setting/registries':
      return ['registries', 'registry management'];
    case '/views/setting/registry':
      return ['registry', 'registry management'];
    case '/views/setting/users':
      return ['users', 'user management'];
    case '/views/setting/user':
      return ['user', 'user management'];
    default:
      return ['', ''];
  }
};

const Header: FC<HeaderProps> = () => {
  const {
    auth: { user },
    layout,
  } = useSelector(({ auth, layout }: RootState) => ({ auth, layout }));
  const dispatch = useDispatch();
  const router = useRouter();

  const [routerName, description] = useMemo(() => getRouteName(router.route), [router.route]);

  const handleClickLogout = useCallback(() => {
    dispatch(signOut());
    router.replace('/login');
  }, []);

  return (
    <Container isOpened={layout.isOpenedSideBar}>
      <div className="router-wrapper">
        <p className="router">{routerName}</p>
        <p className="sub-router">{description}</p>
      </div>
      <div className="user-wrapper">
        <p className="user-name">
          <FontAwesomeIcon className="user-icon" icon="user-circle" />
          {user?.username || ''}
        </p>
        <div className="user-controll-wrapper">
          <Link href={{ pathname: '/setting/account' }}>
            <span className="my-account-button user-controll-button">
              <FontAwesomeIcon className="user-controll-icon" icon="user-cog" />
              my account
            </span>
          </Link>
          <span className="logout-button user-controll-button" onClick={handleClickLogout}>
            <FontAwesomeIcon className="user-controll-icon" icon="sign-out-alt" />
            log out
          </span>
        </div>
      </div>
    </Container>
  );
};

interface ContainerProps {
  isOpened: boolean;
}

const Container = styled.div<ContainerProps>`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  min-width: 640px;
  padding: 0 20px 0 ${({ isOpened }) => (isOpened ? '300px' : '60px')};
  transition: padding 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  box-shadow: 1px 1px 3px #ccc;
  background: #fff;
  color: black;
  z-index: 2;

  .router-wrapper {
    text-transform: capitalize;
    color: #333;
    padding-left: 20px;

    .router {
      font-size: 20px;
      font-weight: bold;
      padding-top: 14px;
    }

    .sub-router {
      font-size: 13px;
      margin-top: 3px;
    }
  }

  .user-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .user-name {
      font-size: 17px;
      font-weight: bold;
      padding-top: 14px;

      .user-icon {
        margin-right: 5px;
        font-size: 17px;
      }
    }

    .user-controll-wrapper {
      margin-top: 6px;
      font-size: 12px;

      .user-controll-button {
        margin-left: 12px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }

      .user-controll-icon {
        margin-right: 4px;
      }

      .my-account-button {
        color: #2a3a5d;
      }

      .logout-button {
        color: #b71c1c;
      }
    }
  }
`;
export default Header;
