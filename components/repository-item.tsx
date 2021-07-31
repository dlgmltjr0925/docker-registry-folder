import { FC } from 'react';
import Link from 'next/link';
import { RepositoryDto } from '../src/registry/dto/repository.dto';
import styled from 'styled-components';

interface Item extends RepositoryDto {
  registryId: number;
}
interface RepositoryItemProps {
  item: Item;
}

const RepositoryItem: FC<RepositoryItemProps> = ({ item }) => {
  return (
    <Link href={`/repository/${item.registryId}/${item.name}`}>
      <div>{item.name}</div>
    </Link>
  );
};

const Container = styled.div`
  position: relative;
  margin: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 3pxs;
  cursor: pointer;
`;

export default RepositoryItem;
