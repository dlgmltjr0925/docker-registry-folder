import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { signOut } from 'reducers/auth';

import Layout from '../../components/layout';

interface HomePageProps {
  name?: string;
}

const HomePage: FC<HomePageProps> = ({ name }) => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    if (!auth.accessToken) router.replace('/login');
  }, [auth.accessToken]);

  if (!auth.accessToken) return null;

  return (
    <Layout>
      <div>
        {`home ${name || ''}`}
        <button onClick={handleLogOut}>Logout</button>
      </div>
    </Layout>
  );
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
