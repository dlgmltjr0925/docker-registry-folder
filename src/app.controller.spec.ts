import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
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

  it('home should be return {}', async () => {
    expect(await controller.home()).toEqual({});
  });

  it('login should be return {}', async () => {
    expect(await controller.login()).toEqual({});
  });

  it('loginAdmin should be return {}', async () => {
    expect(await controller.loginAdmin()).toEqual({});
  });
});
