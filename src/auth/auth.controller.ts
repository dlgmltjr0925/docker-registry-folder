import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { SignInInputDto, SignInInputSchema } from './dto/sign-in-input.dto';
import { SignUpInputDto, SignUpInputSchema } from './dto/sign-up-input.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('has-system-admin')
  async hasSystemAdmin() {
    return await this.authService.hasSystemAdmin();
  }

  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(SignInInputSchema))
  async signIn(@Body() signInInputDto: SignInInputDto) {
    console.log(signInInputDto);
    return 'token';
  }

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpInputSchema))
  async signUp(@Body() signUpInputDto: SignUpInputDto) {
    console.log(signUpInputDto);
    return 'token';
  }
}
