import session from 'express-session';

import { NestFactory } from '@nestjs/core';

import initialize from '../lib/initialize';
import { AppModule } from './app.module';

const bootstrap = async () => {
  await initialize();
  const server = await NestFactory.create(AppModule);

  server.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      name: 'docker-registry-folder',
      resave: false,
      saveUninitialized: false,
    })
  );

  await server.listen(3000);
};

bootstrap();
