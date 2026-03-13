import { IsMobilePhone, IsNotEmpty } from 'class-validator';

export class ResendVerificationCodeDto {
  @IsNotEmpty()
  @IsMobilePhone('ar-EG', {}, { message: 'Invalid Egyptian phone number' })
  phoneNumber: string;
}
