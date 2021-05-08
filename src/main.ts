import { NestFactory } from '@nestjs/core';

import initialize from '../lib/initialize';
import { AppModule } from './app.module';

const bootstrap = async () => {
  await initialize();
  const server = await NestFactory.create(AppModule);

  await server.listen(3000);
};

bootstrap();
