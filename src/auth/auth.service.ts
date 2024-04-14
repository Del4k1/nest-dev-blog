import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { IUser } from 'src/interface/IUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const lowercaseUsername = username.toLowerCase();
    const user = await this.userService.getUserByUsername(lowercaseUsername);

    if (user) {
      const passwordIsMatch = await argon2.verify(user.password, password);

      if (passwordIsMatch) {
        return user;
      }
    }

    throw new UnauthorizedException('Ошибка аутентификации');
  }

  async login(user: IUser) {
    const { id, username } = user;

    return {
      id,
      username,
      token: this.jwtService.sign({
        id: user.id,
        user: user.username,
      }),
    };
  }

  async getUserById(userId: string): Promise<any> {
    return this.userService.getUserById(userId);
  }
}
