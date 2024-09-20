import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class StartLoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
