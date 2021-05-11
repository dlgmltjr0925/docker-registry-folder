import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message blob unknown to registry
 * @description
 * This error may be returned when a blob is unknown to the registry in a specified repository.
 * This can be returned with a standard get or if a manifest references an unknown layer during upload.
 */
export class BlobUnknownException extends HttpException {
  constructor() {
    super('BlobUnknown', HttpStatus.BAD_REQUEST);
  }
}
