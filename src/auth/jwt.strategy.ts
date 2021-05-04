import fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import path from 'path';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(path.resolve('data/jwt-secret'), 'binary'),
    });
  }

  async validate({ sub, username, role, systemAdmin }: JwtPayload): Promise<UserDto> {
    const user: UserDto = { id: sub, username, role, systemAdmin };
    return user;
  }
}
