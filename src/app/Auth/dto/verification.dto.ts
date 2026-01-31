import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class VerificationDto  {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    verificationCode: string;
}