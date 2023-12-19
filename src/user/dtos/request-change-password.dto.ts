import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestChangePasswordDto {
  @IsOptional()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
