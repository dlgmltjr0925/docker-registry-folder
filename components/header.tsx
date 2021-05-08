import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FC, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { signOut } from 'reducers/auth';
import styled from 'styled-components';

import { faSignOutAlt, faUserCircle, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HeaderProps {}

const getRouteName = (route: string): [string, string | string[]] => {
  switch (route) {
    case '/views/home':
      return ['home', 'endpoints'];
    default:
      return ['', ''];
  }
};

const Header: FC<HeaderProps> = () => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [routerName, description] = useMemo(() => getRouteName(router.route), [router.route]);

  const handleClickLogout = useCallback(() => {
    dispatch(signOut());
  }, []);

  return (
    <Container>
      <div className="router-wrapper">
        <p className="router">{routerName}</p>
        <p className="sub-router">{description}</p>
      </div>
      <div className="user-wrapper">
        <p className="user-name">
          <FontAwesomeIcon className="user-icon" icon={faUserCircle} />
          {auth.user?.username || ''}
        </p>
        <div className="user-controll-wrapper">
          <Link href="/views/account">
            <span className="my-account-button user-controll-button">
              <FontAwesomeIcon className="user-controll-icon" icon={faUserCog} />
              my account
            </span>
          </Link>
          <span className="logout-button user-controll-button" onClick={handleClickLogout}>
            <FontAwesomeIcon className="user-controll-icon" icon={faSignOutAlt} />
            log out
          </span>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  box-shadow: 2px 2px 5px #ccc;
  padding: 0 20px;
  background: #fff;
  color: black;

  .router-wrapper {
    text-transform: capitalize;

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
