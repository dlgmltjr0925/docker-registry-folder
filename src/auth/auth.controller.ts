import { Body, Controller, Get, Post, Req, Session, UseGuards, UsePipes } from '@nestjs/common';

import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { SignUpInputDto, SignUpInputSchema } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() { user }: { user: UserDto }, @Session() session: Record<string, any>) {
    const accessToken = await this.authService.issueAccessToken(user as UserDto);
    session.accessToken = accessToken;
    return { accessToken, user };
  }

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpInputSchema))
  async signUp(@Body() signUpInputDto: SignUpInputDto, @Session() session: Record<string, any>) {
    const { accessToken, user } = await this.authService.signUp(signUpInputDto);
    session.accessToken = accessToken;
    return { accessToken, user };
  }

  @Post('sign-out')
  async signOut(@Session() session: Record<string, any>) {
    delete session.accessToken;
    return {};
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() { user }: { user: UserDto | null }) {
    return { user };
  }
}
