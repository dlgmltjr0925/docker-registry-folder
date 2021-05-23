import { FC } from 'react';
import styled from 'styled-components';

import { faCubes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RegistryDto } from '../src/registry/dto/registry.dto';

interface RegistryItemProps {
  item: RegistryDto;
}

const RegistryItem: FC<RegistryItemProps> = ({ item: { name, host, repositories } }) => {
  const repositoriesLength = repositories.length;

  return (
    <Container>
      <div className="name-wrapper">
        <span className="name">{name}</span>
      </div>
      <div className="info-wrapper">
        <span className="host">{host}</span>
        <FontAwesomeIcon className="cubes-icon" icon={faCubes} />
        <span className="repository-count">{`${repositoriesLength} ${
          repositoriesLength <= 1 ? 'repository' : 'repositories'
        }`}</span>
      </div>
      <ul className="repository-wrapper">
        {repositories.map(({ name, tags }) => {
          return (
            <button key={name} className="repository-item">
              {name}
            </button>
          );
        })}
      </ul>
      <button className="remove-wrapper">
        <FontAwesomeIcon className="remove-icon" icon={faTrashAlt} />
      </button>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 2px 3px #ccc;
  }

  .name {
    font-size: 19px;
    font-weight: 700;
    margin-right: 10px;
    vertical-align: middle;
    color: #333333;
  }

  .info-wrapper {
    margin-top: 12px;

    .host {
      font-size: 16px;
      font-weight: 500;
      color: #777777;
    }

    .cubes-icon {
      margin-left: 12px;
      font-size: 14px;
      color: #333333;
    }

    .repository-count {
      margin-left: 6px;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
    }
  }

  .repository-wrapper {
    margin-top: 5px;

    .repository-item {
      margin: 5px 5px 0 0;
      border: 0;
      outline: none;
      cursor: pointer;
      background-color: #255177;
      color: #fff;
      padding: 5px 10px;
      border-radius: 3px;

      &:hover {
        background-color: #1e4669;
      }
    }
  }

  .remove-wrapper {
    position: absolute;
    display: flex;
    top: 10px;
    right: 6px;
    outline: none;
    border: none;
    background-color: transparent;
    border-radius: 2px;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
    color: #b71c1c;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export default RegistryItem;
