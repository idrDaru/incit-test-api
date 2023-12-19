import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateUserByFacebook {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
