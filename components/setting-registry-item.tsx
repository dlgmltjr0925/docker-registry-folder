import Link from 'next/link';
import { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import styled from 'styled-components';

import { RegistryDto } from '../src/registry/dto/registry.dto';

interface SettingRegistryItemProps {
  item: RegistryDto;
  checked?: boolean;
  onChange?: (item: RegistryDto, checked: boolean) => void;
}

const SettingRegistryItem: FC<SettingRegistryItemProps> = ({ item, checked, onChange }) => {
  const { id, name, host, tag } = item;

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    if (onChange) onChange(item, checked);
  };

  return (
    <Container>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <span>
        <Link href={`/setting/registry/${id}`}>
          <span className="name">{name}</span>
        </Link>
      </span>
      <span className="host">{host}</span>
      <span className="tag">{tag}</span>
    </Container>
  );
};

const Container = styled.li`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ccc;

  input[type='checkbox'] {
    margin-right: 10px;
    cursor: pointer;
  }

  span {
    flex: 1;
    font-size: 14px;
  }

  .name {
    color: var(--button-blue-active);
    cursor: pointer;
    font-weight: 700;
  }

  .host {
    flex: 2;
  }
`;

export default SettingRegistryItem;
