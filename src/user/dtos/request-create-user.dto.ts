import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestCreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
