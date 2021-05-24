import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message requested access to the resource is denied
 * @description
 * The access controller denied access for the operation on a resource.
 */
export class DeniedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Denied',
      },
      HttpStatus.FORBIDDEN
    );
  }
}
