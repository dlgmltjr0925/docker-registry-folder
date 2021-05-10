import path from 'path';

import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

const ENV_PATH = path.resolve('data/.env');

describe('AuthModule', () => {
  let service: AuthService;
  require('dotenv').config({ path: ENV_PATH });

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    service = authModule.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
