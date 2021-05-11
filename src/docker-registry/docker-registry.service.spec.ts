import { Test, TestingModule } from '@nestjs/testing';
import { DockerRegistryService } from './docker-registry.service';

describe('DockerRegistryService', () => {
  let service: DockerRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerRegistryService],
    }).compile();

    service = module.get<DockerRegistryService>(DockerRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
