import { IsNotEmpty, IsString, IsMobilePhone } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsMobilePhone('ar-EG', {}, { message: 'Invalid Egyptian phone number' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
