import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { NoAuthCookieException } from './exceptions/no-auth-cookie.exception';

@Catch(NoAuthCookieException)
export class NoAuthCookieExceptionFilter implements ExceptionFilter {
  logger = new Logger();

  catch(exception: NoAuthCookieException, host: ArgumentsHost) {
    this.logger.log('no auth cookie');
    const response = host.switchToHttp().getResponse();
    response.status(302).redirect('/login');
  }
}
