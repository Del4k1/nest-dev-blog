import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

const userServiceMock = {
  create: jest.fn(),
};

const requestMock = {
  user: {},
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: JwtAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('должен создать контроллер', () => {
    expect(controller).toBeDefined();
  });

  it('создаем пользователя', async () => {
    const userDto: UserDto = {
      username: 'testusername',
      password: 'testpassword',
    };

    userServiceMock.create.mockReturnValueOnce({});
    const result = await controller.create(userDto);

    expect(result).toEqual({});
    expect(userServiceMock.create).toHaveBeenCalledWith(userDto);
  });

  it('должен получить профиль пользователя', () => {
    const result = controller.getProfile(requestMock);
    expect(result).toEqual(requestMock.user);
  });
});
