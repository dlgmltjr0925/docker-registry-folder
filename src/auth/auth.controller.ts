import { Body, Controller, Get, Post, Put, Req, Res, Session, UseGuards, UsePipes } from '@nestjs/common';
import type { Response } from 'express';

import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { SignUpInputDto, SignUpInputSchema } from './dto/sign-up-input.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() { user }: { user: UserDto }, @Res() response: Response) {
    const accessToken = await this.authService.issueAccessToken(user);
    const refreshToken = await this.authService.issueRefreshToken(user);
    const cookie = this.authService.getCookieWithJwtToken(refreshToken);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ accessToken, refreshToken, user });
  }

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpInputSchema))
  async signUp(@Body() signUpInputDto: SignUpInputDto, @Res() response: Response) {
    const { accessToken, user } = await this.authService.signUp(signUpInputDto);
    const refreshToken = await this.authService.issueRefreshToken(user);
    const cookie = this.authService.getCookieWithJwtToken(refreshToken);
    response.setHeader('Set-Cookie', cookie);
    return response.send({ accessToken, refreshToken, user });
  }

  @Post('sign-out')
  async signOut(@Res() response: Response) {
    const cookie = this.authService.getCookieForSignOut();
    response.setHeader('Set-Cookie', cookie);
    return response.send({});
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() { user }: { user: UserDto | null }) {
    return { user };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async update(@Body() updateProfileDto: UpdateProfileDto) {
    return await this.authService.update(updateProfileDto);
  }
}
