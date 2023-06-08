import {
  faCog,
  faCube,
  faExchangeAlt,
  faHome,
  faNetworkWired,
  faServer,
  faUsersCog,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { RootState } from 'reducers';
import SideMenu from './side-menu';
import styled from 'styled-components';
import { toggleSideBar } from 'reducers/layout';
import { useRouter } from 'next/dist/client/router';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = (props) => {
  const {
    auth: { user },
    layout,
    currentRegistry,
  } = useSelector(({ auth, layout, registry: { currentRegistry } }: RootState) => ({ auth, layout, currentRegistry }));
  const dispatch = useDispatch();
  const { route, asPath, ...router } = useRouter();

  const handleClickOpen = () => {
    dispatch(toggleSideBar());
  };

  return (
    <Container className="noselect" isOpened={layout.isOpenedSideBar}>
      <div className="home-logo-container">
        <Link href="/">
          <span className="home-logo-wrapper">
            <Image className="home-logo" src="/images/home-logo.png" alt="Home Logo" width={40} height={29} />
            <span>Docker Registry Folder</span>
          </span>
        </Link>
        <div className="icon-wrapper" onClick={handleClickOpen}>
          <FontAwesomeIcon icon="exchange-alt" />
        </div>
      </div>
      {/* Home */}
      <SideMenu route="/" label="Home" icon="home" isSelected={route === '/views/home'} />

      {/* Registry */}
      {currentRegistry && (
        <>
          <div className="category catogory-repository">
            <span>{currentRegistry.name}</span>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon="network-wired" />
            </div>
          </div>
          <SideMenu
            route={`/dashboard/${currentRegistry.id}`}
            label="Dashboard"
            icon="server"
            isSelected={route === '/views/dashboard'}
          />
          <ul className="repository-wrapper">
            {currentRegistry.repositories.map(({ name }) => (
              <SideMenu
                key={name}
                route={`/repository/${currentRegistry.id}/${name}`}
                label={name}
                icon="cube"
                isSelected={asPath.split('?')[0] === `/repository/${currentRegistry.id}/${name}`}
              />
            ))}
          </ul>
        </>
      )}

      {/* Setting */}
      {user?.role !== 'VIEWER' && (
        <div className="category">
          <span>Settings</span>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon="cog" />
          </div>
        </div>
      )}
      {user?.role !== 'VIEWER' && (
        <SideMenu
          route="/setting/registries"
          label="Registries"
          icon="server"
          isSelected={route === '/views/setting/registries' || route === '/views/setting/registry'}
        />
      )}
      {user?.role === 'ADMIN' && (
        <SideMenu route="/setting/users" label="Users" icon="user-cog" isSelected={route === '/views/setting/users'} />
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

  .home-logo-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    background: #273657;
    cursor: pointer;

    .home-logo-wrapper {
      height: 40px;
      margin-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;

      span {
        display: inline-block;
        font-size: 18px;
        font-weight: 500;
        margin: 10px 0 0 8px;
      }
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

    .catogory-repository {
      cursor: pointer;
    }
  }

  .repository-wrapper {
    margin-top: 10px;
  }
`;

export default SideBar;
