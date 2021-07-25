import { FC, useEffect, useState } from 'react';
import { faCubes, faServer } from '@fortawesome/free-solid-svg-icons';

import { GetServerSideProps } from 'next';
import { RegistryDto } from 'src/registry/dto/registry.dto';
import WidgetContainer from 'components/widget-container';
import WidgetItem from 'components/widget-item';
import WidgetSearch from 'components/widget-search';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';

interface DashboardPageProps {
  registry?: RegistryDto;
}

const REDIRECT_TIMEOUT = 3;

const DashboardPage: FC<DashboardPageProps> = ({ registry }) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState<string>('');

  if (!registry) {
    useEffect(() => {
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
      <WidgetContainer title="Registry Info" titleIcon={faServer}>
        <WidgetItem label="name" value={registry.name} />
        <WidgetItem label="host" value={registry.host} />
        {/* <WidgetItem label="status" value={`UP <${new Date()}>`} /> */}
      </WidgetContainer>

      <WidgetContainer title="Registories" titleIcon={faCubes}>
        <WidgetSearch placeholder="Search by name, tag..." />
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
