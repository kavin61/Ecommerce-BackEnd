import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  userName: String;
  @IsString()
  password: String;
}
