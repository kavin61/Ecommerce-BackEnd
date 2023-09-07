import { IsString } from 'class-validator';
export class RegisterDto {
  @IsString()
  name: String;
  @IsString()
  userName: String;
  @IsString()
  password: String | Buffer;
  @IsString()
  email: String;
}
