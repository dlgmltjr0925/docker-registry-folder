import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class RegistryExceptionFilter implements ExceptionFilter {
  logger = new Logger('RegistryExceptionFilter');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json(exception.getResponse());
  }
}
