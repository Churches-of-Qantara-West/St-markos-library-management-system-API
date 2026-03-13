import { IsNotEmpty, IsString, MinLength, IsMobilePhone } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsMobilePhone('ar-EG', {}, { message: 'Invalid Egyptian phone number' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;
}
