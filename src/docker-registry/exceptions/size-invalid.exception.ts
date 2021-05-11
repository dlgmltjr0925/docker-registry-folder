import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message provided length did not match content length
 * @description
 * When a layer is uploaded, the provided size will be checked against the uploaded content.
 * If they do not match, this error will be returned.
 */
export class SizeInvalidException extends HttpException {
  constructor() {
    super('SizeInvalid', HttpStatus.BAD_REQUEST);
  }
}
