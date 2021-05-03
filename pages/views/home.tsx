import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';

interface HomePageProps {
  name?: string;
}

const HomePage: FC<HomePageProps> = ({ name }) => {
  return <div>{`home ${name || ''}`}</div>;
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const props: HomePageProps = {};

  const { name } = context.query;
  if (name) props.name = name as string;

  return {
    props,
  };
};

export default HomePage;
