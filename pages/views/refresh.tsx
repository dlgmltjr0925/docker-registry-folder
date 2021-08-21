import { FC, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'reducers';
import { UserDto } from 'src/auth/dto/user.dto';
import { updateAuthState } from 'reducers/auth';
import { useRouter } from 'next/dist/client/router';

interface RefreshPageProps {
  user?: UserDto;
  accessToken?: string;
}

const RefreshPage: FC<RefreshPageProps> = ({ user, accessToken }) => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined && accessToken !== undefined) {
      dispatch(updateAuthState({ user, accessToken }));
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (auth.accessToken && auth.user) {
      const redirectUrl = router.asPath.replace('/refresh?redirect=', '');
      if (redirectUrl) {
        router.replace(redirectUrl);
      }
    }
  }, [auth]);

  return <div />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: RefreshPageProps = {};

  const user = context.query.user as string;
  props.user = JSON.parse(user);
  props.accessToken = context.query.accessToken as string;

  return {
    props,
  };
};

export default RefreshPage;
