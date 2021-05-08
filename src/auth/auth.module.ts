import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

const DynamicJwtModule = JwtModule.register({
  signOptions: { expiresIn: '10m' },
});

@Module({
  imports: [DynamicJwtModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [DynamicJwtModule, PassportModule],
})
export class AuthModule {}
