import { verify } from 'jsonwebtoken';
import path from 'path';

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { connect } from '../../lib/sqlite';
import { AuthController } from './auth.controller';
import { DynamicJwtModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { SignUpInputDto } from './dto/sign-up-input.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './interfaces/role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
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

const ENV_PATH = path.resolve('data/.env');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  require('dotenv').config({ path: ENV_PATH });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DynamicJwtModule, PassportModule],
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
    const result = await authService.hasSystemAdmin();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(await authService.hasSystemAdmin());
  });

  describe('sign-up', () => {
    let hasSystemAdmin: boolean = false;

    beforeAll(async () => {
      await deleteTestUser();
      hasSystemAdmin = await authService.hasSystemAdmin();
    });

    it('should be returned error when trying to register system admin twice', async () => {
      const signUpInput: SignUpInputDto = {
        username: '__testadmin',
        password: '__testadmin',
        role: Role.ADMIN,
        systemAdmin: true,
      };
      try {
        if (!hasSystemAdmin) await controller.signUp(signUpInput, {});
        signUpInput.username = '__testadmin1';
        signUpInput.password = '__testadmin1';
        await controller.signUp(signUpInput, {});
      } catch (error) {
        expect(error).toEqual(new BadRequestException('Only one system administrator can be registered'));
      }
    });

    it('should be return access token', async () => {
      try {
        const signUpInput: SignUpInputDto = {
          username: '__testuser1',
          password: '__testuser1',
          role: Role.ADMIN,
          systemAdmin: false,
        };
        const { accessToken } = await controller.signUp(signUpInput, {});
        expect(typeof accessToken).toEqual('string');
        await controller.signUp(signUpInput, {});
      } catch (error) {
        expect(error).toEqual(new BadRequestException('Already registered'));
      }
    });
  });

  describe('sign-in', () => {
    let localStrategy: LocalStrategy;
    let accessToken: string;
    let user: UserDto;

    beforeEach(() => {
      localStrategy = new LocalStrategy(authService);
    });

    it('should be return access token and user info', async () => {
      const testUser: UserDto = await localStrategy.validate('__testuser1', '__testuser1');
      const result = await controller.signIn({ user: testUser }, {});
      accessToken = result.accessToken;
      user = result.user;
      expect(typeof accessToken).toEqual('string');
    });

    it('should be return error', async () => {
      try {
        await localStrategy.validate('noadmin', 'noadmin');
      } catch (error) {
        expect(error).toEqual(new UnauthorizedException());
      }
    });

    it('should be return user info', async () => {
      const jwtStrategy = new JwtStrategy();
      const jwtPayload = verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
      const testUser: UserDto = await jwtStrategy.validate(jwtPayload);
      const result = await controller.profile({ user: testUser });
      expect(result.user).toEqual(user);
    });

    it('should be deleted accessToken in session', async () => {
      const session = { accessToken };
      const result = await controller.signOut(session);
      expect(result).toEqual({});
      expect(session).toEqual({});
    });
  });

  afterAll(async () => {
    try {
      await deleteTestUser();
    } catch (error) {
      console.log(error);
    }
  });
});
