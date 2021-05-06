import { PropsWithChildren } from 'react';

interface LayoutProps {}

const layout = ({ children }: PropsWithChildren<LayoutProps>) => {
  return <div>{children}</div>;
};

export default layout;
