import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { NoAuthCookieException } from './exceptions/no-auth-cookie.exception';
import { Observable } from 'rxjs';
import { verifyRefreshToken } from '../../lib/jwt';

@Injectable()
export class NoAuthCookieGuard implements CanActivate {
  logger = new Logger('NoAuthCookieGuard');
  static paths = ['/login', '/sign-up/admin'];

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (NoAuthCookieGuard.paths.includes(request.route.path)) return true;
    const response = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['DRFR'];
    if (!refreshToken) throw new NoAuthCookieException();
    const isValid = verifyRefreshToken(refreshToken as string);
    if (!isValid) {
      response.setHeader('Set-Cookie', `DRFR=; HttpOnly; Path=/; Max-Age=0`);
      throw new NoAuthCookieException();
    }
    return true;
  }
}
