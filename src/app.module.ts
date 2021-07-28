import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DockerRegistryService } from './docker-registry/docker-registry.service';
import { Module } from '@nestjs/common';
import Next from 'next';
import { RegistryModule } from './registry/registry.module';
import { RenderModule } from 'nest-next';
import { UserModule } from './user/user.module';
import { SettingModule } from './setting/setting.module';
import { SyncService } from './sync/sync.service';

export const NextModule = RenderModule.forRootAsync(
  Next({
    quiet: true,
    dev: process.env.NODE_ENV !== 'production',
  })
);
@Module({
  imports: [NextModule, AuthModule, RegistryModule, UserModule, SettingModule],
  controllers: [AppController],
  providers: [AuthService, DockerRegistryService, SyncService],
})
export class AppModule {}
