import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message blob unknown to registry
 * @description
 * This error may be returned when a manifest blob is unknown to the registry.
 */
export class ManifestBlobUnknownException extends HttpException {
  constructor() {
    super('ManifestBlobUnknown', HttpStatus.NOT_FOUND);
  }
}
