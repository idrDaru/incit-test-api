import { IsNotEmpty, IsString } from "class-validator";

export class SignInByFacebookDto{
    @IsNotEmpty()
    @IsString()
    email: string;
}