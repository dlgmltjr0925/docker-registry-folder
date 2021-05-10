import * as Express from 'express';
import path from 'path';
import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { NextModule } from './app.module';
import { DynamicJwtModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

const ENV_PATH = path.resolve('data/.env');

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let res: Express.Response;
  let nestApplication: INestApplication;

  require('dotenv').config({ path: ENV_PATH });

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [DynamicJwtModule],
      controllers: [AppController],
      providers: [AuthService],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
    authService = testingModule.get<AuthService>(AuthService);

    nestApplication = testingModule.createNestApplication();
    await nestApplication.init();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('endpoint should be return {}', async () => {
    expect(await appController.home()).toEqual({});
    expect(await appController.login(res)).toEqual({});
    expect(await appController.signUpAdmin()).toEqual({});
    expect(await appController.account()).toEqual({});
    expect(await appController.registries()).toEqual({});
    expect(await appController.users()).toEqual({});
  });

  it('should be called redirect if has not system admin', async () => {
    const authService = { hasSystemAdmin: async () => false } as AuthService;
    appController = new AppController(authService);
    appController.login(res);
  });

  afterAll(async () => {
    if (nestApplication) await nestApplication.close();
  });
});
