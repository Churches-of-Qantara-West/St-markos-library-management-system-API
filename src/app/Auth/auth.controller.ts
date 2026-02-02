import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerificationDto } from './dto/verification.dto';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto): Promise<any> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(user);
  }

  @Post('verify')
  async verify(
    @Body() verification: VerificationDto,
  ): Promise<{ message: string }> {
    return this.authService.verify(verification);
  }

  @Get('resend-verification')
  async resendVerification(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerification(resendVerificationCodeDto);
  }
}
