import { MaxLength, MinLength } from 'class-validator';

export class UserDto {
  id: string;

  @MinLength(3)
  @MaxLength(20)
  username: string;

  @MinLength(5)
  @MaxLength(10)
  password: string;
}
