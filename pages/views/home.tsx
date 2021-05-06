import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';

interface HomePageProps {
  name?: string;
}

const HomePage: FC<HomePageProps> = ({ name }) => {
  const root = useSelector((state) => state);
  console.log(JSON.stringify(root, null, 2));

  const auth = useSelector(({ auth }: RootState) => auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.accessToken) router.replace('/login');
  }, [auth.accessToken]);

  if (!auth.accessToken) return null;

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
