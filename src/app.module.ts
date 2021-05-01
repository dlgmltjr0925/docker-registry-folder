import { Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { ApiController } from './api/api.controller';

export const NextModule = RenderModule.forRootAsync(
  Next({
    quiet: true,
    dev: process.env.NODE_ENV !== 'production',
  })
);
@Module({
  imports: [NextModule],
  controllers: [AppController, ApiController],
  providers: [],
})
export class AppModule {}
