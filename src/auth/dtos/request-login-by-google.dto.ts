import { IsNotEmpty, IsString } from "class-validator";

export class SignInByGoogleDto{
    @IsNotEmpty()
    @IsString()
    credential: string;
}