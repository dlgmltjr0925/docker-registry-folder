import { Controller, Get, Query, Render } from '@nestjs/common';
import fs from 'fs';

@Controller()
export class AppController {
  @Render('home')
  @Get()
  public index() {
    return {};
  }
}
