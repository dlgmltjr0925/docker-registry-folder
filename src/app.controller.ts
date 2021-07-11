import { Response } from 'express';

import { Controller, Get, Param, Render, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { RegistryService } from './registry/registry.service';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private registryService: RegistryService,
    private userService: UserService
  ) {}
  @Render('home')
  @Get()
  async home() {
    return {};
  }

  @Render('login')
  @Get('login')
  async login(@Res() res: Response) {
    if (!(await this.authService.hasSystemAdmin())) res.status(302).redirect('sign-up/admin');
    return {};
  }

  @Render('sign-up/admin')
  @Get('sign-up/admin')
  async signUpAdmin() {
    return {};
  }

  @Render('dashboard')
  @Get('dashboard/:id')
  async dashboard(@Param('id') id: string) {
    const registry = await this.registryService.findOneById(+id);
    return { registry: JSON.stringify(registry) };
  }
}
