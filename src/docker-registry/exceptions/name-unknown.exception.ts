import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message repository name not known to registry
 * @description
 * This is returned if the name used during an operation is unknown to the registry.
 */
export class NameUnknownException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'NameUnknown',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
