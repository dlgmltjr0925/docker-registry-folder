import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message invalid repository name
 * @description
 * Invalid repository name encountered either during manifest validation or any API operation.
 */
export class NameInvalidException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'NameInvalid',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
