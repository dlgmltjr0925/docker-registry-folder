import { Response } from 'express';

import { Controller, Get, Param, Render, Res } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { RegistryService } from './registry/registry.service';
import { UserService } from './user/user.service';

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

  @Render('setting/account')
  @Get('setting/account')
  async account() {
    return {};
  }

  @Render('setting/registries')
  @Get('setting/registries')
  async registries() {
    return {};
  }

  @Render('setting/registry')
  @Get('setting/registry')
  async newRegistry() {
    return {};
  }

  @Render('setting/registry')
  @Get('setting/registry/:id')
  async registry(@Param('id') id: string) {
    const registry = await this.registryService.findOneWithAccessInfoById(+id);
    return { registry: JSON.stringify(registry) };
  }

  @Render('setting/users')
  @Get('setting/users')
  async users() {
    return {};
  }

  @Render('setting/user')
  @Get('setting/user')
  async newUser(@Param('id') id: string) {
    return {};
  }

  @Render('setting/user')
  @Get('setting/user/:id')
  async user(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    return { user: JSON.stringify(user) };
  }

  @Render('dashboard')
  @Get('dashboard/:id')
  async dashboard(@Param('id') id: string) {
    const registry = await this.registryService.findOneById(+id);
    return { registry: JSON.stringify(registry) };
  }
}
