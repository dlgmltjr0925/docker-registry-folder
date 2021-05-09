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

  if (EXCEPTION_PAGE.includes(router.pathname)) return <div>{children}</div>;

  useEffect(() => {
    if (!auth.accessToken) router.replace('/login');
  }, [auth.accessToken]);

  return (
    <Container>
      <SideBar />
      <Header />
      <div className="content-container">
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
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;

    .content-wrapper {
      padding-top: 60px;
      border: 1px solid #ccc;
      overflow-y: scroll;
    }
  }
`;

export default Layout;
