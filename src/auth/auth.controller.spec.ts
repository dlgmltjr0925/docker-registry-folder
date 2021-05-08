import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { connect } from '../../lib/sqlite';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpInputDto } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

const deleteTestUser = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const db = connect();
    const sql = 'DELETE FROM user WHERE username LIKE "__test%"';
    db.run(sql, (error) => {
      if (error) reject(error);
    });
    db.close();
    resolve(null);
  });
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          signOptions: { expiresIn: '10m' },
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, LocalStrategy],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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
    let localStrategy: LocalStrategy;

    beforeEach(() => {
      localStrategy = new LocalStrategy(authService);
    });

    it('should be return access token', async () => {
      const user: UserDto = await localStrategy.validate('admin', 'admin');
      const { accessToken } = await controller.signIn({ user });
      expect(typeof accessToken).toEqual('string');
    });

    it('should be return error', async () => {
      try {
        await localStrategy.validate('noadmin', 'noadmin');
      } catch (error) {
        expect(error).toEqual(new UnauthorizedException());
      }
    });
  });

  describe('sign-up', () => {
    let hasSystemAdmin: boolean = false;

    beforeAll(async () => {
      await deleteTestUser();
      hasSystemAdmin = await controller.hasSystemAdmin();
    });

    it('should be returned error when trying to register system admin twice', async () => {
      const signUpInput: SignUpInputDto = {
        username: '__testadmin',
        password: '__testadmin',
        role: 'ADMIN',
        systemAdmin: true,
      };
      try {
        if (!hasSystemAdmin) await controller.signUp(signUpInput);
        signUpInput.username = '__testadmin1';
        signUpInput.password = '__testadmin1';
        await controller.signUp(signUpInput);
      } catch (error) {
        expect(error).toEqual(new BadRequestException('Only one system administrator can be registered'));
      }
    });

    it('should be return access token', async () => {
      try {
        const signUpInput: SignUpInputDto = {
          username: '__testuser1',
          password: '__testuser1',
          role: 'ADMIN',
          systemAdmin: false,
        };
        const { accessToken } = await controller.signUp(signUpInput);
        expect(typeof accessToken).toEqual('string');
        await controller.signUp(signUpInput);
      } catch (error) {
        expect(error).toEqual(new BadRequestException('Already registered'));
      }
    });

    afterAll(async () => {
      try {
        await deleteTestUser();
      } catch (error) {
        console.log(error);
      }
    });
  });
});
