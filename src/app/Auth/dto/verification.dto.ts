import { RegisterDto } from "./register.dto";
import { IsNotEmpty, Length } from "class-validator";

export class VerificationDto extends RegisterDto {
    @IsNotEmpty()
    @Length(6, 6)
    verificationCode: string;
}