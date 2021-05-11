import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

export const DynamicJwtModule = JwtModule.register({
  signOptions: { expiresIn: process.env.NODE_ENV === 'production' ? '30m' : '4h' },
});

@Module({
  imports: [DynamicJwtModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [DynamicJwtModule, PassportModule],
})
export class AuthModule {}
