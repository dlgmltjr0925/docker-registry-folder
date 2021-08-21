import { FC, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps } from 'next';
import { RegistryDto } from '../../src/registry/dto/registry.dto';
import { RepositoryDto } from '../../src/registry/dto/repository.dto';
import WidgetContainer from 'components/widget-container';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { resetCurrentRegistry } from 'reducers/registry';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/dist/client/router';

interface RepositoryPageProps {
  registry?: RegistryDto;
  repository?: RepositoryDto;
}

const REDIRECT_TIMEOUT = 3;

const RepositoryPage: FC<RepositoryPageProps> = ({ registry, repository }) => {
  const dispatch = useDispatch();
  const router = useRouter();

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

  return (
    <Container>
      <WidgetContainer title="Repository" titleIcon={faCube}>
        <div className="summary-wrapper">
          <h1 className="name">{repository.name}</h1>
          {repository.tags.length > 0 ? (
            <>
              <p className="description">Copy and paste to pull this image</p>
              <div className="copy-wrapper">
                <FontAwesomeIcon className="copy-icon" icon={faClone} />
                <span className="copy-content">{`docker pull ${registry.host}/${repository.name}:${repository.tags[0]}`}</span>
              </div>
            </>
          ) : (
            <p className="description">There are no images available for download.</p>
          )}
        </div>
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
    padding: 12px;

    .name {
      font-size: 19px;
      font-weight: 700;
      vertical-align: middle;
      color: #333333;
    }

    .description {
      font-size: 14px;
      color: #999999;
      margin-top: 10px;
    }

    .copy-wrapper {
      margin-top: 5px;
      padding: 10px;
      background-color: #2a3a5d;
      color: white;
      cursor: pointer;

      .copy-content {
        margin: auto 10px;
      }
    }
  }
`;

export default RepositoryPage;
