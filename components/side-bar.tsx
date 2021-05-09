import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { toggleSideBar } from 'reducers/layout';
import styled from 'styled-components';

import {
    faCog, faExchangeAlt, faHome, faServer, faUsersCog
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SideMenu from './side-menu';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = (props) => {
  const {
    auth: { user },
    layout,
  } = useSelector(({ auth, layout }: RootState) => ({ auth, layout }));
  const dispatch = useDispatch();
  const { route } = useRouter();

  const handleClickOpen = () => {
    dispatch(toggleSideBar());
  };

  return (
    <Container className="noselect" isOpened={layout.isOpenedSideBar}>
      <div className="home-logo">
        <Link href="/">
          <span className="noselect">Docker Registry Folder</span>
        </Link>
        <div className="icon-wrapper" onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faExchangeAlt} />
        </div>
      </div>
      {/* Home */}
      <SideMenu route="/" label="Home" icon={faHome} isSelected={route === '/views/home'} />
      {/* Setting */}
      {user?.role !== 'VIEWER' && (
        <div className="category">
          <span>Settings</span>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faCog} />
          </div>
        </div>
      )}
      {user?.role !== 'VIEWER' && (
        <SideMenu route="/registries" label="Registries" icon={faServer} isSelected={route === '/views/registries'} />
      )}
      {user?.role === 'ADMIN' && (
        <SideMenu route="/users" label="Users" icon={faUsersCog} isSelected={route === '/views/users'} />
      )}
    </Container>
  );
};

interface ContainerProps {
  isOpened: boolean;
}

const Container = styled.div<ContainerProps>`
  position: fixed;
  display: flex;
  flex-direction: column;
  background: #2a3a5d;
  width: 300px;
  height: 100vh;
  margin-left: ${({ isOpened }) => (isOpened ? '0' : '-240px')};
  transition: margin 0.5s;
  z-index: 3;

  .icon-wrapper {
    display: inline-flex;
    width: 60px;
    height: 100%;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    color: #ccc;

    &:hover {
      color: #fff;
    }
  }

  .home-logo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    background: #273657;
    align-items: center;

    &:hover {
      cursor: pointer;
    }

    span {
      padding-left: 20px;
      font-size: 20px;
      font-weight: 400;
    }
  }

  .category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    margin: 30px 0 15px 15px;
    text-align: center;
    color: #ffffffbb;
    font-size: 15px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 600;

    span {
      padding-top: 3px;
      line-height: 23px;
    }

    .icon-wrapper {
      &:hover {
        color: #ccc;
      }
    }
  }
`;

export default SideBar;
