import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { LocalStrategyAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: LocalStrategyAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: JwtAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('должен создать контроллер', () => {
    expect(controller).toBeDefined();
  });

  it('должен вернуть результат authService.login', async () => {
    const user: any = {
      username: 'testusername',
      password: 'testpassword',
    };

    jest.spyOn(authService, 'login').mockImplementation(() => user);

    const req = { user };
    const result = await controller.login(req as Request);

    expect(result).toEqual(user);
  });

  it('должен вернуть пользователя из запроса', async () => {
    const user: any = {
      username: 'testusername',
      password: 'testpassword',
    };

    const req = { user };
    const result = controller.getProfile(req as Request);

    expect(result).toEqual(user);
  });
});
