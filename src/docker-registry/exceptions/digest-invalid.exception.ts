import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message provided digest did not match uploaded content
 * @description
 * When a blob is uploaded, the registry will check that the content matches the digest provided by the client.
 * The error may include a detail structure with the key “digest”, including the invalid digest string.
 * This error may also be returned when a manifest includes an invalid layer digest.
 */
export class DigestInvalidException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'DigestInvalid',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
