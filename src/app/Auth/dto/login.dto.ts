import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @Matches(/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/, {
    message: 'Only valid Gmail addresses are allowed',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
