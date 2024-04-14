import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UnauthorizedException } from '@nestjs/common';

class mockUserModel {
  static findOne = jest.fn();
  static save = jest.fn();
  save = jest.fn();

  constructor() {}
}

const mockJwtService = {
  sign: jest.fn(),
} as any;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('cледует создать нового пользователя и вернуть его с токеном', async () => {
    const userDto: UserDto = {
      username: 'testusername',
      password: 'testpassword',
    };

    const hashedPassword = 'hashedPassword';

    jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword);

    mockUserModel.findOne.mockResolvedValue(null);

    const token = 'testToken';
    mockJwtService.sign.mockReturnValue(token);

    const result = await userService.create(userDto);

    expect(mockUserModel.findOne).toHaveBeenCalled();

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      username: userDto.username.toLowerCase(),
    });

    expect(result.token).toEqual(token);
  });

  it('должен вызвать UnauthorizedException если пользователь не существует', async () => {
    const userDto: UserDto = {
      username: 'testusername',
      password: 'testpassword',
    };

    mockUserModel.findOne.mockResolvedValue({
      username: userDto.username.toLocaleLowerCase(),
    });

    await expect(userService.create(userDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('должен найти пользователя по имени', async () => {
    const username = 'testUser';
    const mockUser = { username: username.toLowerCase() };

    mockUserModel.findOne.mockResolvedValue(mockUser);

    const result = await userService.getUserByUsername(username);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      username: username.toLowerCase(),
    });

    expect(result).toEqual(mockUser);
  });
});
