import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message manifest invalid
 * @description
 * During upload, manifests undergo several checks ensuring validity.
 * If those checks fail, this error may be returned, unless a more specific error is included.
 * The detail will contain information the failed validation.
 */
export class ManifestInvalidException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'ManifestInvalid',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
