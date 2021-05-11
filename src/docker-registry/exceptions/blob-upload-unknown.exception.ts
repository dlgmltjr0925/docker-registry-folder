import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message blob upload unknown to registry
 * @description
 * If a blob upload has been cancelled or was never started, this error code may be returned.
 */
export class BlobUploadUnknownException extends HttpException {
  constructor() {
    super('BlobUploadUnknown', HttpStatus.NOT_FOUND);
  }
}
