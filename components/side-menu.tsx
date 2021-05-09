import Link from 'next/link';
import { FC } from 'react';
import styled from 'styled-components';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SideMenuProps {
  label: string;
  route: string;
  icon: IconProp;
  isSelected: boolean;
}

const SideMenu: FC<SideMenuProps> = ({ route, label, icon, isSelected }) => {
  return (
    <Link href={route}>
      <Container isSelected={isSelected}>
        <span className="menu-label">{label}</span>
        <FontAwesomeIcon className="menu-icon" icon={icon} />
      </Container>
    </Link>
  );
};

interface ContainerProps {
  isSelected: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#273657' : '#2a3a5d')};
  border-left: 3px solid ${({ isSelected }) => (isSelected ? '#fff' : '#2a3a5d')};
  padding: 0 0 0 10px;
  color: ${({ isSelected }) => (isSelected ? '#fff' : '#ffffffcc')};

  &:hover {
    background-color: #273657;
    border-color: ${({ isSelected }) => (isSelected ? '#fff' : 'orange')};
    color: #fff;
  }

  .menu-icon {
    width: 60px;
    font-size: 16px;
  }

  .menu-label {
    flex: 1;
    font-size: 16px;
    line-height: 21px;
    padding-top: 5px;
    font-weight: 700;
  }
`;

export default SideMenu;
