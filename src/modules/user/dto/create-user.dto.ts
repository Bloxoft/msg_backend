import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    phoneId: string

    @IsString()
    phonePrefix: string
}
