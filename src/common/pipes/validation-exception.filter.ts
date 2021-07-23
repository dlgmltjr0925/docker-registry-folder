import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  logger = new Logger('ValidationExceptionFilter');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    this.logger.log(exception.getResponse());

    response.status(status).json(exception.getResponse());
  }
}
