import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { Module } from '@nestjs/common';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { SyncService } from '../sync/sync.service';

@Module({
  controllers: [RegistryController],
  providers: [RegistryService, DockerRegistryService, SyncService],
  exports: [RegistryService],
})
export class RegistryModule {}
