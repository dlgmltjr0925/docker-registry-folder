import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { Module } from '@nestjs/common';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';

@Module({
  controllers: [RegistryController],
  providers: [RegistryService, DockerRegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
