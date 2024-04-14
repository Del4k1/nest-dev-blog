import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() userDto: UserDto) {
    try {
      const result = this.userService.register(userDto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при создании пользователя',
        error,
      };
    }
  }

  @Post(':userId/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserImage(
    @Param('userId') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    return this.userService.uploadUserImage(userId, image);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any): any {
    try {
      const user = this.userService.getUserByUsername(req.username);
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при получении профиля пользователя',
        error,
      };
    }
  }
}
