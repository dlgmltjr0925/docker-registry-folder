import { Module } from '@nestjs/common';
import { RegistryModule } from '../registry/registry.module';
import { UserModule } from '../user/user.module';
import { SettingController } from './setting.controller';

@Module({
  imports: [RegistryModule, UserModule],
  controllers: [SettingController],
})
export class SettingModule {}
