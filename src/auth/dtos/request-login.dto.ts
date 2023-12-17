import { IsNotEmpty, IsString } from 'class-validator';

export class RequestLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
