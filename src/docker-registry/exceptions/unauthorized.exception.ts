import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @message authentication required
 * @description
 * The access controller was unable to authenticate the client.
 * Often this will be accompanied by a Www-Authenticate HTTP response header indicating how to authenticate.
 */
export class UnauthorizedException extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
