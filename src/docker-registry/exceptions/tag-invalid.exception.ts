import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message manifest tag did not match URI
 * @description
 * During a manifest upload,
 * if the tag in the manifest does not match the uri tag, this error will be returned.
 */
export class TagInvalidException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'TagInvalid',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
