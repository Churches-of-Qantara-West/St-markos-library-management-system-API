import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsMobilePhone('ar-EG', {}, { message: 'Invalid Egyptian phone number' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
