import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Render('home')
  @Get()
  public home() {
    return {};
  }

  @Render('login')
  @Get('login')
  public login() {
    return {};
  }

  @Render('login/admin')
  @Get('login/admin')
  public loginAdmin() {
    return {};
  }
}
