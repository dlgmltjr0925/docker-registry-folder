import { Module } from '@nestjs/common';

import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';

@Module({
  controllers: [RegistryController],
  providers: [RegistryService, DockerRegistryService],
})
export class RegistryModule {}
