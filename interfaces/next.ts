import * as next from 'next';

import { IncomingMessage } from 'node:http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export interface GetServerSidePropsContext extends Omit<next.GetServerSidePropsContext, 'req'> {
  req: IncomingMessage & { cookies: NextApiRequestCookies } & { session: Record<string, any> };
}
