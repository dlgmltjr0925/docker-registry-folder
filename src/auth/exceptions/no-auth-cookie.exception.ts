import { HttpException, HttpStatus } from '@nestjs/common';

export class NoAuthCookieException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'No auth cookie',
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
