import { HttpException, HttpStatus } from '@nestjs/common';

export class HostDuplicateException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Host is already registered.',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
