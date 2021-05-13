import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CheckApiVersionArgs, DockerRegistryService } from './docker-registry.service';
import { UnauthorizedException } from './exceptions/unauthorized.exception';

describe('DockerRegistryService', () => {
  let service: DockerRegistryService;
  let checkApiVersionArgs: CheckApiVersionArgs;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerRegistryService],
    }).compile();

    service = module.get<DockerRegistryService>(DockerRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkApiVersion', () => {
    beforeEach(() => {
      checkApiVersionArgs = {
        host: 'docker-registry.mazzeom.com',
        username: 'fine',
        password: 'fine',
      };
    });

    it('should be return ok response when entering the correct information', async () => {
      let res = await service.checkApiVersion(checkApiVersionArgs);
      expect(res.status).toEqual(200);
    });

    it('should be return unauthorized response when entering the wrong username', async () => {
      try {
        checkApiVersionArgs.username = ' ';
        await service.checkApiVersion(checkApiVersionArgs);
      } catch (error) {
        if (error.response) {
          expect(error).toEqual(new UnauthorizedException());
        }
      }
    });

    it('should be return unauthorized response when entering the wrong password', async () => {
      try {
        checkApiVersionArgs.password = ' ';
        await service.checkApiVersion(checkApiVersionArgs);
      } catch (error) {
        if (error.response) {
          expect(error).toEqual(new UnauthorizedException());
        }
      }
    });

    it('should be return not found response when entering the wrong host', async () => {
      try {
        checkApiVersionArgs.host = 'docker-registry.mazzeom.co';
        await service.checkApiVersion(checkApiVersionArgs);
      } catch (error) {
        expect(error).toEqual(new NotFoundException());
      }
    });
  });
});
