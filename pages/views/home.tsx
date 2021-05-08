import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { signOut } from 'reducers/auth';
import { UserDto } from 'src/auth/dto/user.dto';

interface HomePageProps {
  user: UserDto;
}

const HomePage: FC<HomePageProps> = ({ user }) => {
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
    <div>
      {`home ${user?.username || ''}`}
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
};

export default HomePage;
