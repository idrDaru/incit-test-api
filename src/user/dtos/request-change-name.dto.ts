import { IsNotEmpty, IsString } from "class-validator";

export class RequestChangeNameDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
