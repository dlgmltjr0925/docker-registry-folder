import { FC, useEffect, useState } from 'react';
import { faCubes, faServer } from '@fortawesome/free-solid-svg-icons';

import { GetServerSideProps } from 'next';
import { RegistryDto } from '../../src/registry/dto/registry.dto';
import RepositoryItem from '../../components/repository-item';
import WidgetContainer from 'components/widget-container';
import WidgetItem from 'components/widget-item';
import WidgetSearch from 'components/widget-search';
import dateFormat from 'dateformat';
import { handleChangeText } from 'lib/event-handles';
import { resetCurrentRegistry } from 'reducers/registry';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { useRouter } from 'next/dist/client/router';

interface DashboardPageProps {
  registry?: RegistryDto;
}

const REDIRECT_TIMEOUT = 3;

const DashboardPage: FC<DashboardPageProps> = ({ registry }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState<string>('');

  const searchedRegistry = useMemo(() => {
    if (!registry) return [];
    const regExp = new RegExp(keyword);
    return registry.repositories.filter(({ name, tags }) => regExp.test(name) || tags.some((tag) => regExp.test(tag)));
  }, [keyword]);

  if (!registry) {
    useEffect(() => {
      dispatch(resetCurrentRegistry());
      let timeout: NodeJS.Timeout | null = setTimeout(() => {
        router.replace('/');
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
          <h1>The registry could not be found.</h1>
          <p>After {REDIRECT_TIMEOUT} seconds, it moves to the home page.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <WidgetContainer title="Registry Info" titleIcon="server">
        <WidgetItem label="name" value={registry.name} />
        <WidgetItem label="host" value={registry.host} />
        <WidgetItem
          label="status"
          value={`${registry.status} <${dateFormat(registry.checkedAt, 'yyyy-mm-dd HH:MM:ss')}>`}
        />
      </WidgetContainer>

      <WidgetContainer title="Registories" titleIcon="cubes">
        <WidgetSearch placeholder="Search by name, tag..." onChange={handleChangeText(setKeyword)} />
        <ul>
          {searchedRegistry.map((repository) => (
            <RepositoryItem key={repository.name} item={{ ...repository, registryId: registry.id }} />
          ))}
        </ul>
      </WidgetContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: DashboardPageProps = {};

  const { registry } = context.query;

  if (registry) {
    props.registry = JSON.parse(registry as string) as RegistryDto;
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

export default DashboardPage;
