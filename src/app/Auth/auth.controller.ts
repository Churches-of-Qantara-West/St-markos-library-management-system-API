import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerificationDto } from "./dto/verification.dto";

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto): Promise<any> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: RegisterDto): Promise<VerificationDto> {
    return this.authService.register(user);
  }
} 