import {
    Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';

import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { SignUpInputDto, SignUpInputSchema } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('has-system-admin')
  async hasSystemAdmin() {
    return await this.authService.hasSystemAdmin();
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: { user: UserDto }) {
    console.log('signIn');
    return { accessToken: await this.authService.issueAccessToken(req.user) };
  }

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpInputSchema))
  async signUp(@Body() signUpInputDto: SignUpInputDto) {
    return { accessToken: await this.authService.signUp(signUpInputDto) };
  }
}
