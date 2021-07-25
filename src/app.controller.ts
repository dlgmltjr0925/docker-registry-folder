import { request, Response } from 'express';

import { Controller, Get, Logger, Param, Render, Req, Res, UseFilters, UseGuards } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { RegistryService } from './registry/registry.service';
import { NoAuthCookieGuard } from './auth/no-auth-cookie.guard';
import { NoAuthCookieExceptionFilter } from './auth/no-auth-cookie-exception.filter';

interface RequestWithCookie extends Request {
  cookies: Record<string, string>;
}
@Controller()
@UseGuards(NoAuthCookieGuard)
@UseFilters(NoAuthCookieExceptionFilter)
export class AppController {
  logger = new Logger('AppController');
  constructor(private authService: AuthService, private registryService: RegistryService) {}

  @Render('home')
  @Get()
  async home() {
    return {};
  }

  @Render('login')
  @Get('login')
  async login(@Res() response: Response) {
    const cookie = this.authService.getCookieForSignOut();
    response.setHeader('Set-Cookie', cookie);
    if (!(await this.authService.hasSystemAdmin())) response.status(302).redirect('sign-up/admin');
    return {};
  }

  @Render('sign-up/admin')
  @Get('sign-up/admin')
  async signUpAdmin() {
    return {};
  }

  @Render('refresh')
  @Get('refresh')
  async refresh(@Req() request: RequestWithCookie) {
    const refreshToken = request.cookies['DRFR'] as string;
    const { user, accessToken } = await this.authService.issueAccessTokenByRefreshToken(refreshToken);
    return { user: JSON.stringify(user), accessToken };
  }

  @Render('dashboard')
  @Get('dashboard/:id')
  async dashboard(@Param('id') id: string) {
    try {
      const registry = await this.registryService.findOneById(+id);

      return { registry: registry ? JSON.stringify(registry) : null };
    } catch (error) {
      throw error;
    }
  }
}
