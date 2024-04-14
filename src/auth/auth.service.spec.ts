import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('проверяем учетные данные пользователя', async () => {
    const username = 'test';
    const password = 'test';

    const mockUser: any = {
      id: '1',
      username: username,
      password: await argon2.hash(password),
    };

    jest
      .spyOn(userService, 'getUserByUsername')
      .mockImplementation(async () => mockUser);
    jest.spyOn(argon2, 'verify').mockImplementation(async () => true);

    const result = await authService.validateUser(username, password);

    expect(result).toEqual(mockUser);
  });

  it('должен возвращать ошибку UnauthorizedException неверным учетным данным', async () => {
    const username = 'test';
    const password = 'test';

    jest
      .spyOn(userService, 'getUserByUsername')
      .mockImplementation(async () => null);
    jest.spyOn(argon2, 'verify').mockImplementation(async () => false);

    await expect(authService.validateUser(username, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('должен сгенерировать token для пользователя', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
    };

    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'mockedToken');

    const result = await authService.login(mockUser);

    expect(result).toEqual({
      id: '1',
      username: 'testuser',
      token: 'mockedToken',
    });
  });
});
