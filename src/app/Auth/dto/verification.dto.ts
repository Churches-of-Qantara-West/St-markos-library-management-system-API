import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class VerificationDto  {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    @Length(6, 6)
    verificationCode: string;
}