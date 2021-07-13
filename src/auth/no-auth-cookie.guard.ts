import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyRefreshToken } from '../../lib/jwt';
import { NoAuthCookieException } from './exceptions/no-auth-cookie.exception';

@Injectable()
export class NoAuthCookieGuard implements CanActivate {
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
