import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { toggleSideBar } from 'reducers/layout';
import styled from 'styled-components';

import { faExchangeAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = (props) => {
  console.log('[render]', 'SideBar');
  const layout = useSelector(({ layout }: RootState) => layout);
  const dispatch = useDispatch();
  const { route } = useRouter();

  const handleClickOpen = () => {
    dispatch(toggleSideBar());
  };

  return (
    <Container isOpened={layout.isOpenedSideBar}>
      <div className="home-logo">
        <Link href="/">
          <span className="noselect">Docker Registry Folder</span>
        </Link>
        <div className="icon-wrapper" onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faExchangeAlt} />
        </div>
      </div>
      {/* Home */}
      <MenuWrapper isSelected={route === '/views/home'}>
        <FontAwesomeIcon className="menu-icon" icon={faHome} />
        <span className="menu-label">Home</span>
      </MenuWrapper>
    </Container>
  );
};

interface ContainerProps {
  isOpened: boolean;
}

const Container = styled.div<ContainerProps>`
  background: #2a3a5d;
  width: 300px;
  margin-left: ${({ isOpened }) => (isOpened ? '0' : '-240px')};
  transition: margin 0.5s;

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
`;

interface MenuWrapperProps {
  isSelected: boolean;
}

const MenuWrapper = styled.div<MenuWrapperProps>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#273657' : '#2a3a5d')};
  border-left: 3px solid ${({ isSelected }) => (isSelected ? 'white' : '#2a3a5d')};
  padding: 0 0 0 10px;

  &:hover {
    background-color: #273657;
  }

  .menu-icon {
    font-size: 16px;
    margin-right: 6px;
  }

  .menu-label {
    flex: 1;
    font-size: 16px;
    line-height: 21px;
    padding-top: 5px;
    font-weight: 700;
  }
`;

export default SideBar;
