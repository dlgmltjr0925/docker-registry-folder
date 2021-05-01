import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { registries } from './__mock__/registries.mock';

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be returned server list', () => {
    expect(controller.getAllRegistries()).toBe(registries);
  });
});
