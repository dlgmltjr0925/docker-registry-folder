import { FC, useCallback, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps } from 'next';
import { RegistryDto } from '../../src/registry/dto/registry.dto';
import { RepositoryDto } from '../../src/registry/dto/repository.dto';
import TagItem from '../../components/tag-item';
import WidgetContainer from 'components/widget-container';
import WidgetSearch from 'components/widget-search';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { handleChangeText } from 'lib/event-handles';
import { openSnackBar } from 'reducers/snack-bars';
import { resetCurrentRegistry } from 'reducers/registry';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useRouter } from 'next/dist/client/router';

interface RepositoryPageProps {
  registry?: RegistryDto;
  repository?: RepositoryDto;
}

const REDIRECT_TIMEOUT = 3;

const RepositoryPage: FC<RepositoryPageProps> = ({ registry, repository }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [keyword, setKeyword] = useState<string>('');

  if (!registry || !repository) {
    useEffect(() => {
      let timeout: NodeJS.Timeout | null = setTimeout(() => {
        if (registry) dispatch(resetCurrentRegistry());
        router.replace(!registry ? '/' : `/dashboard/${registry.id}`);
      }, REDIRECT_TIMEOUT * 1000);
      () => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
    }, []);

    return (
      <Container>
        <div className="not-found-container">
          <h1>The {!registry ? 'registry' : 'repository'} could not be found.</h1>
          <p>
            After {REDIRECT_TIMEOUT} seconds, it moves to the {!registry ? 'home' : 'dashboard'} page.
          </p>
        </div>
      </Container>
    );
  }

  const downloadCommand = useMemo(() => {
    if (repository.tags.length === 0) {
      return null;
    } else {
      const tag = repository.tags.includes('latest') ? 'latest' : repository.tags[0];

      return `docker pull ${registry.host}/${repository.name}:${tag}`;
    }
  }, []);

  const searchedTags = useMemo(() => {
    const keywordRegExp = new RegExp(keyword);
    return repository.tags.filter((tag) => keywordRegExp.test(tag));
  }, [keyword]);

  const copyToClipboard = useCallback(() => {
    if (!downloadCommand) return;
    navigator.clipboard.writeText(downloadCommand);
    dispatch(
      openSnackBar({
        severity: 'info',
        message: 'Copied to clipboard',
      })
    );
  }, [downloadCommand]);

  return (
    <Container>
      <WidgetContainer title="Repository" titleIcon={faCube}>
        <div className="summary-wrapper">
          <h1 className="name">{repository.name}</h1>
          {!downloadCommand ? (
            <p className="description">There are no images available for download.</p>
          ) : (
            <>
              <p className="description">Copy and paste to pull this image</p>
              <div className="copy-wrapper">
                <button className="copy-icon" type="button" onClick={copyToClipboard}>
                  <FontAwesomeIcon icon={faClone} />
                </button>
                <span className="copy-content">{downloadCommand}</span>
              </div>
            </>
          )}
        </div>
        {repository.tags.length > 0 && (
          <>
            <WidgetSearch
              placeholder="Search by name, host, tag..."
              value={keyword}
              onChange={handleChangeText(setKeyword)}
            />
            <ul>
              {searchedTags.map((tag) => (
                <TagItem
                  item={{
                    digest: '1',
                    tags: [tag],
                  }}
                />
              ))}
            </ul>
          </>
        )}
      </WidgetContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: RepositoryPageProps = {};

  const { registry, repository } = context.query;

  if (registry) {
    props.registry = JSON.parse(registry as string) as RegistryDto;
  }

  if (repository) {
    props.repository = JSON.parse(repository as string) as RepositoryDto;
  }

  return {
    props,
  };
};

const Container = styled.div`
  flex: 1;
  min-height: 100vh;

  .not-found-container {
    margin: 20px 0 0 20px;

    h1 {
      font-size: 20px;
    }

    p {
      margin-top: 10px;
      color: #777;
    }
  }

  .summary-wrapper {
    padding: 18px 12px;
    border-bottom: 1px solid #ddd;

    .name {
      font-size: 19px;
      font-weight: 700;
      vertical-align: middle;
      color: #333333;
    }

    .description {
      font-size: 14px;
      color: #999999;
      margin-top: 18px;
      padding-left: 6px;
    }

    .copy-wrapper {
      margin-top: 12px;
      padding: 12px;
      background-color: #2a3a5d;
      color: white;

      .copy-icon {
        border: none;
        outline: none;
        background: transparent;
        color: white;
        cursor: pointer;
      }

      .copy-content {
        margin: auto 10px;
      }
    }
  }
`;

export default RepositoryPage;
