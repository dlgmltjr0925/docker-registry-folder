import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInInputDto } from './dto/sign-in-input.dto';
import { SignUpInputDto } from './dto/sign-up-input.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = new AuthService();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('has-system-admin should be indicated the presence or absence of a system administrator', async () => {
    const result = await controller.hasSystemAdmin();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(await authService.hasSystemAdmin());
  });

  describe('sign-in', () => {
    it('should be return string', async () => {
      const signInInput: SignInInputDto = { username: 'test', password: 'test' };
      expect(await controller.signIn(signInInput)).toEqual('token');
    });
  });

  describe('sign-up', () => {
    it('should be return string', async () => {
      const signUpInput: SignUpInputDto = { username: 'test', password: 'test', role: 'ADMIN', systemAdmin: false };
      expect(await controller.signUp(signUpInput)).toEqual('token');
    });
  });
});
