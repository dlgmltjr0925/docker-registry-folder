import { HttpException, HttpStatus } from '@nestjs/common';

/**
 *
 * @message blob upload invalid
 * @description
 * The blob upload encountered an error and can no longer proceed.
 */
export class BlobUploadInvalidException extends HttpException {
  constructor() {
    super('BlobUploadInvalid', HttpStatus.BAD_REQUEST);
  }
}
