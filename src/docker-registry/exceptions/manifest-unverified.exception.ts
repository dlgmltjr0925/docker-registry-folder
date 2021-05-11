import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message manifest failed signature verification
 * @description
 * During manifest upload, if the manifest fails signature verification, this error will be returned.
 */
export class ManifestUnverifiedException extends HttpException {
  constructor() {
    super('ManifestUnverified', HttpStatus.BAD_REQUEST);
  }
}
