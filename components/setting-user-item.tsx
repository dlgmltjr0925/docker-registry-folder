import Link from 'next/link';
import { ChangeEventHandler, FC } from 'react';
import styled from 'styled-components';

import { UserDto } from '../src/auth/dto/user.dto';

interface SettingUserItemProps {
  item: UserDto;
  checked?: boolean;
  onChange?: (item: UserDto, checked: boolean) => void;
}

const SettingUserItem: FC<SettingUserItemProps> = ({ item, checked, onChange }) => {
  const { id, username, role, systemAdmin } = item;

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    if (onChange) onChange(item, checked);
  };

  return (
    <Container>
      <input type="checkbox" checked={checked} onChange={handleChange} disabled={systemAdmin} />
      <span>
        <Link href={`/setting/user/${id}`}>
          <span className="username">{username}</span>
        </Link>
      </span>
      <span className="role">{role}</span>
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

  .username {
    color: var(--button-blue-active);
    cursor: pointer;
    font-weight: 700;
  }
`;

export default SettingUserItem;
