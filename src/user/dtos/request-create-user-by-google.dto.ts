import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateUserByGoogleDto {
  @IsNotEmpty()
  @IsString()
  credential: string;
}
