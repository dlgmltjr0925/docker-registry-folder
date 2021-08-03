import { FC, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { RegistryDto } from '../../src/registry/dto/registry.dto';
import { RepositoryDto } from '../../src/registry/dto/repository.dto';
import WidgetContainer from 'components/widget-container';
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
      <WidgetContainer title="Repository" titleIcon={faCube}></WidgetContainer>
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
`;

export default RepositoryPage;
