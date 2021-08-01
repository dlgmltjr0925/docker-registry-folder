import { FC, useMemo } from 'react';
import { faCube, faTags, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { RepositoryDto } from '../src/registry/dto/repository.dto';
import styled from 'styled-components';

interface Item extends RepositoryDto {
  registryId: number;
}
interface RepositoryItemProps {
  item: Item;
}

const RepositoryItem: FC<RepositoryItemProps> = ({ item: { registryId, name, tags } }) => {
  const sortedTags = useMemo(() => {
    const sortedTags = [];
    if (tags.includes('latest')) {
      sortedTags.push('latest');
    }
    return sortedTags.concat(tags.filter((tag) => tag !== 'latest').reverse());
  }, [tags]);

  return (
    <Link href={`/repository/${registryId}/${name}`}>
      <Container>
        <div>
          <FontAwesomeIcon className="cube-icon" icon={faCube} />
          <span className="repository-name">{name}</span>
          {tags.length > 0 && (
            <>
              <FontAwesomeIcon className="tags-icon" icon={faTags} />
              <span className="tag-count">{`${tags.length} ${tags.length > 1 ? 'tags' : 'tag'}`}</span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <ul className="tag-wrapper">
            {sortedTags.map((tag) => {
              return (
                <button key={tag} className="tag-item">
                  {tag}
                </button>
              );
            })}
          </ul>
        )}
      </Container>
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
  transition: all 0.3s;

  &:hover {
    box-shadow: 2px 2px 3px #ccc;
  }

  .cube-icon {
    color: #1e4669;
    font-size: 22px;
    line-height: 22px;
  }

  .repository-name {
    font-size: 19px;
    line-height: 19px;
    font-weight: 600;
    color: #333333;
    margin-left: 10px;
  }

  .tags-icon {
    margin-left: 12px;
    font-size: 14px;
    color: #286090;
  }

  .tag-count {
    margin-left: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #333333;
  }

  .tag-wrapper {
    margin-top: 5px;

    .tag-item {
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
`;

export default RepositoryItem;
