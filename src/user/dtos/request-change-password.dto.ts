import { IsNotEmpty, IsString } from 'class-validator';

export class RequestChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
