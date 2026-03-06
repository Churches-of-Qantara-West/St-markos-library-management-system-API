import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LoginDto } from '../dto/login.dto';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { UserMapper } from 'src/shared/mappers/user.mapper';
import { VerificationRepository } from 'src/shared/repositories/verification.repository';
import { UserModel } from 'src/shared/models/user.model';
import { VerificationDto } from '../dto/verification.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { ResendVerificationCodeDto } from '../dto/resend-verification-code.dto';
import { AuthValidatorService } from './auth-validator.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly authValidatorService: AuthValidatorService,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async login(user: LoginDto): Promise<{ access_token: string }> {
    // 1 - find user by email
    const foundUser: UserModel | null = await this.userRepository.findByEmail(user.email);

    // 2 - validate user credentials & verification status
    await this.authValidatorService.validateUserCredentials(foundUser, user.password);

    // 3 - generate JWT token
    const token: string = this.jwtStrategy.generateToken({ email: foundUser!.email });

    return {
      access_token: token,
    };
  }

  async register(user: RegisterDto): Promise<{ message: string }> {
    // 1 - check if user already exists
    await this.authValidatorService.validateUserDoesNotExist(user.email);

    // 2 - hash password
    user.password = await bcrypt.hash(user.password, 10);

    // 3 - create user
    const userModel: UserModel = UserMapper.registerDtoToModel(user);
    await this.userRepository.create(userModel);

    // 4 - create verification code & send email
    const randomCode: string = this.randomCode();

    await this.verificationRepository.create({
      email: user.email,
      verificationCode: randomCode,
    });

    // 5 - Send verification Email
    this.mailerService.sendVerificationEmail(user.name, user.email, randomCode);

    // 6 - Return success message
    return {
      message: 'User registered successfully. Please check your email for the verification code.',
    };
  }

  async verify(verification: VerificationDto): Promise<{ message: string }> {
    // 1 - validate verification code
    await this.authValidatorService.validateVerificationCode(verification.email, verification.verificationCode);

    // 2 - validate user exists
    await this.authValidatorService.validateUserExists(verification.email);

    // 3 - mark user as verified
    await this.userRepository.updateVerificationStatus(verification.email, true);

    // 4 - delete verification record
    await this.verificationRepository.deleteByEmail(verification.email);

    return { message: 'User verified successfully' };
  }

  async resendVerification(resendVerificationCodeDto: ResendVerificationCodeDto) {
    // 1 - validate user exists
    const user = await this.authValidatorService.validateUserExists(resendVerificationCodeDto.email);

    // 2 - validate user is not already verified
    await this.authValidatorService.validateUserNotVerified(user);

    // 3 - generate new verification code
    const newCode: string = this.randomCode();

    // 4 - update verification record
    await this.verificationRepository.updateCode(resendVerificationCodeDto.email, newCode);

    // 5 - send verification email
    this.mailerService.sendVerificationEmail(user.name, resendVerificationCodeDto.email, newCode);

    return { message: 'Verification code resent successfully' };
  }

  // Generate a 6-digit random verification code
  private randomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
