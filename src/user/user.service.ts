import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto) {
    const lowercaseUsername = userDto.username.toLowerCase();

    const existUser = await this.userModel.findOne({
      where: {
        username: lowercaseUsername,
      },
    });

    if (existUser) {
      throw new UnauthorizedException('Пользователь уже существует!');
    }

    const user = new this.userModel({
      username: lowercaseUsername,
      password: await argon2.hash(userDto.password),
    });

    const token = this.jwtService.sign({ username: lowercaseUsername });

    await user.save();

    return { user, token };
  }

  async getUserByUsername(username: string) {
    return await this.userModel.findOne({ username: username.toLowerCase() });
  }

  async getUserById(userId: string): Promise<any> {
    return this.userModel.findById(userId).exec();
  }

  async uploadUserImage(userId: string, image: any): Promise<any> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('Пользователь не найден!');
    }

    user.avatar = image.filename;
    await user.save();

    return user;
  }

  async findByUserIds(userIds: string[]): Promise<any[]> {
    return this.userModel
      .aggregate([
        {
          $match: {
            _id: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
          },
        },
      ])
      .exec();
  }
}
