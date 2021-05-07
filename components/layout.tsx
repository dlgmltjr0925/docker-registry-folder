import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import Header from './header';
import SideBar from './side-bar';

interface LayoutProps {}

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
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

  .content-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .content-wrapper {
      margin-top: 60px;
    }
  }
`;

export default Layout;
