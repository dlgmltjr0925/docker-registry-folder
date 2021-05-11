import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message manifest unknown
 * @description
 * This error is returned when the manifest, identified by name and tag is unknown to the repository.
 */
export class ManifestUnknownException extends HttpException {
  constructor() {
    super('ManifestUnknown', HttpStatus.NOT_FOUND);
  }
}
