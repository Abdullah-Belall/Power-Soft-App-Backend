import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(2)
  user_name: string;
  @IsString()
  @MinLength(8)
  password: string;
}
