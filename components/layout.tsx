import { useRouter } from 'next/dist/client/router';
import { PropsWithChildren, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';

import Header from './header';
import SideBar from './side-bar';

interface LayoutProps {}

const EXCEPTION_PAGE = ['/404', '/views/login', '/views/sign-up/admin'];

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
  const router = useRouter();
  const auth = useSelector(({ auth }: RootState) => auth);

  if (EXCEPTION_PAGE.includes(router.pathname)) return children;

  useEffect(() => {
    if (!auth.accessToken) router.replace('/login');
  }, [auth.accessToken]);

  return (
    <Container>
      <SideBar />
      <div className="content-container">
        <Header />
        <div className="content-wrapper">{children}</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  color: #fff;
  background: #f6f6f6;

  .content-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .content-wrapper {
      padding-top: 60px;
    }
  }
`;

export default Layout;
