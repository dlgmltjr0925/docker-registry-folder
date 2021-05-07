import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { toggleSideBar } from 'reducers/layout';
import styled from 'styled-components';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = (props) => {
  const layout = useSelector(({ layout }: RootState) => layout);
  const dispatch = useDispatch();

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
      font-weight: bold;
    }
  }
`;

export default SideBar;
