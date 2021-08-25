import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export interface Item {
  digest: string;
  tags: string[];
}

interface TagItemProps {
  item: Item;
}

const TagItem: FC<TagItemProps> = ({ item }) => {
  return (
    <Container>
      <div className="tag-wrapper">
        <FontAwesomeIcon className="tag-icon" icon={faTag} />
        <span className="tag-name">{item.tags.join(', ')}</span>
      </div>
    </Container>
  );
};

const Container = styled.li`
  position: relative;
  margin: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 2px 2px 3px #ccc;
  }

  .tag-wrapper {
    .tag-icon {
      color: #2a3a5d;
    }

    .tag-name {
      padding: 0 12px;
    }
  }
`;

export default TagItem;
