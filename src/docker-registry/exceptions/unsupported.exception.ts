import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message The operation is unsupported.
 * @description
 * The operation was unsupported due to a missing implementation or invalid set of parameters.
 */
export class UnsupportedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.METHOD_NOT_ALLOWED,
        message: 'Unsupported',
      },
      HttpStatus.METHOD_NOT_ALLOWED
    );
  }
}
