import { Controller, Get, Render, Request, Res, UseGuards } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Render('home')
  @Get()
  @UseGuards(JwtAuthGuard)
  home() {
    return {};
  }

  @Render('login')
  @Get('login')
  async login(@Res() res: any) {
    if (!(await this.authService.hasSystemAdmin())) res.status(302).redirect('/sign-up/admin');
    return {};
  }

  @Render('sign-up/admin')
  @Get('sign-up/admin')
  signUpAdmin() {
    return {};
  }
}
