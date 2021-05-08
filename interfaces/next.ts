import * as next from 'next';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';
import { IncomingMessage } from 'node:http';

export interface GetServerSidePropsContext extends Omit<next.GetServerSidePropsContext, 'req'> {
  req: IncomingMessage & { cookies: NextApiRequestCookies } & { session: Record<string, any> };
}
