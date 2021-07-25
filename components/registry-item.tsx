import { faCubes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { RegistryDto } from '../src/registry/dto/registry.dto';
import dateFormat from 'dateformat';
import styled from 'styled-components';

interface RegistryItemProps {
  item: RegistryDto;
  onClickRemove: (item: RegistryDto) => void;
}

const RegistryItem: FC<RegistryItemProps> = ({ item, onClickRemove }) => {
  const { id, name, status, checkedAt, host, repositories } = item;
  const repositoriesLength = repositories.length;

  const handleClickRemove = () => {
    onClickRemove(item);
  };

  return (
    <Link href={`/dashboard/${id}`}>
      <Container className="noselect">
        <div className="name-wrapper">
          <span className="name">{name}</span>
          <span className={`status status-${status === 'UP' ? 'up' : 'down'}`}>{status}</span>
          <span className="date">{dateFormat(checkedAt, 'yyyy-mm-dd HH:MM:ss')}</span>
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
        <button className="remove-wrapper" onClick={handleClickRemove}>
          <FontAwesomeIcon className="remove-icon" icon={faTrashAlt} />
        </button>
      </Container>
    </Link>
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

  .name-wrapper {
    .name {
      font-size: 19px;
      font-weight: 700;
      vertical-align: middle;
      color: #333333;
    }

    .status {
      display: inline-block;
      margin-left: 12px;
      font-size: 11px;
      padding: 4px 6px 3px;
      border-radius: 3px;
      color: #ffffff;
    }

    .status-up {
      background-color: #74b566;
    }

    .status-down {
      background-color: #b71c1c;
    }

    .date {
      margin-left: 6px;
      font-size: 14px;
      color: #777777;
      letter-spacing: -0.2px;
    }
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
      background-color: #286090;
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
    width: 25px;
    height: 25px;
    justify-content: center;
    align-items: center;
    color: #dc9690;
    cursor: pointer;
    font-size: 17px;

    &:hover {
      color: #b71c1c;
    }
  }
`;

export default RegistryItem;
