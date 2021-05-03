import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthModule', () => {
  let service: AuthService;

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
