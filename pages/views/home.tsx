import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';

interface HomeProps {
  name?: string;
}

const Home: FC<HomeProps> = ({ name }) => {
  return <div>{`home ${name || ''}`}</div>;
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const props: HomeProps = {};

  const { name } = context.query;
  if (name) props.name = name as string;

  return {
    props,
  };
};

export default Home;
