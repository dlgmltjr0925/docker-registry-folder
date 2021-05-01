import { Controller, Get } from '@nestjs/common';
import { registries } from './__mock__/registries.mock';

@Controller('api')
export class ApiController {
  @Get('/registries')
  getAllRegistries(): Array<string> {
    return registries;
  }
}
