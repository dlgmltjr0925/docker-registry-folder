import { useRouter } from 'next/dist/client/router';
import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { closeSideBar, openSideBar } from 'reducers/layout';
import styled from 'styled-components';

import Header from './header';
import SideBar from './side-bar';

interface LayoutProps {}

const EXCEPTION_PAGE = ['/404', '/views/login', '/views/sign-up/admin'];

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
  const router = useRouter();
  const { accessToken, isOpenedSideBar } = useSelector(
    ({ auth: { accessToken }, layout: { isOpenedSideBar } }: RootState) => ({
      accessToken,
      isOpenedSideBar,
    })
  );
  const dispatch = useDispatch();

  if (EXCEPTION_PAGE.includes(router.pathname)) return <Container>{children}</Container>;

  useEffect(() => {
    let status = isOpenedSideBar;
    const handleResize = () => {
      if (window.innerWidth <= 640 && status) {
        dispatch(closeSideBar());
        status = false;
      } else if (window.innerWidth > 640 && !status) {
        dispatch(openSideBar());
        status = true;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpenedSideBar]);

  useEffect(() => {
    if (!accessToken) router.replace('/login');
  }, [accessToken]);

  if (!accessToken) return <Container>{children}</Container>;

  return (
    <Container isOpened={isOpenedSideBar}>
      <Header />
      <SideBar />
      <div className="content-container">{children}</div>
    </Container>
  );
};

interface ContainerProps {
  isOpened?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  color: #fff;
  background: #f3f3f3;

  .content-container {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-width: 640px;
    padding: 60px 0 0 ${({ isOpened }) => (isOpened ? '300px' : '60px')};
    transition: padding 0.5s;
    color: black;
  }
`;

export default Layout;
