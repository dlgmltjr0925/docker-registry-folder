import { Controller, Get, Param, Render, Session, UseFilters, UseGuards } from '@nestjs/common';
import { NoAuthCookieGuard } from '../auth/no-auth-cookie.guard';
import { NoAuthCookieExceptionFilter } from '../auth/no-auth-cookie-exception.filter';
import { RegistryService } from '../registry/registry.service';
import { UserService } from '../user/user.service';

@Controller('setting')
@UseGuards(NoAuthCookieGuard)
@UseFilters(NoAuthCookieExceptionFilter)
export class SettingController {
  constructor(private registryService: RegistryService, private userService: UserService) {}

  @Render('setting/account')
  @Get('account')
  async account() {
    return {};
  }

  @Render('setting/registries')
  @Get('registries')
  async registries() {
    return {};
  }

  @Render('setting/registry')
  @Get('registry')
  async newRegistry() {
    return {};
  }

  @Render('setting/registry')
  @Get('registry/:id')
  async registry(@Param('id') id: string) {
    const registry = await this.registryService.findOneWithAccessInfoById(+id);
    return { registry: JSON.stringify(registry) };
  }

  @Render('setting/users')
  @Get('users')
  async users() {
    return {};
  }

  @Render('setting/user')
  @Get('user')
  async newUser(@Param('id') id: string) {
    return {};
  }

  @Render('setting/user')
  @Get('user/:id')
  async user(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    return { user: JSON.stringify(user) };
  }
}
