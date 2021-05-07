import { useRouter } from 'next/dist/client/router';
import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

interface HeaderProps {}

const getRouteName = (route: string): [string, string | string[]] => {
  switch (route) {
    case '/views/home':
      return ['home', 'endpoints'];
    default:
      return ['', ''];
  }
};

const Header: FC<HeaderProps> = () => {
  const auth = useSelector(({ auth }: RootState) => auth);
  const router = useRouter();

  const [routerName, description] = useMemo(() => getRouteName(router.route), [router.route]);

  return (
    <Container>
      <div className="router-wrapper">
        <p className="router">{routerName}</p>
        <p className="sub-router">{description}</p>
      </div>
      {/* <div className="user-wrapper">
        <p>user</p>
        <div>
          <span>my account</span>
          <span>logout</span>
        </div>
      </div> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  box-shadow: 2px 2px 5px #ccc;
  padding: 0 20px;
  background: #fff;
  color: black;

  .router-wrapper {
    text-transform: capitalize;

    .router {
      font-size: 20px;
      font-weight: bold;
      padding-top: 14px;
    }

    .sub-router {
      font-size: 13px;
      margin-top: 3px;
    }
  }

  .user-wrapper {
  }
`;
export default Header;
