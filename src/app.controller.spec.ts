import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('ApiController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return default object in /', () => {
    expect(controller.index()).toEqual({});
  });

  it('should be return default object in /about', () => {
    expect(controller.index()).toEqual({});
  });
});
