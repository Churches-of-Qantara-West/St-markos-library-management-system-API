import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from 'src/shared/mappers/user.mapper';
import { VerificationRepository } from 'src/shared/repositories/verification.repository';
import { UserModel } from 'src/shared/models/user.model';
import { VerificationDto } from './dto/verification.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async login(user: LoginDto): Promise<{ access_token: string }> {
    // 1 - find user by email
    const foundUser: UserModel | null = await this.userRepository.findByEmail(
      user.email,
    );

    // 2- validate user credentials & verification status
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      user.password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!foundUser.isVerified) {
      throw new UnauthorizedException(
        'User is not verified, please verify your email before logging in',
      );
    }

    // 3 - generate JWT token
    const token: string = this.jwtStrategy.generateToken({
      email: foundUser.email,
    });

    return {
      access_token: token,
    };
  }

  async register(user: RegisterDto): Promise<{ message: string }> {
    // 1 - check if user already exists
    const existingUser: UserModel | null =
      await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 2 - hash password
    user.password = await bcrypt.hash(user.password, 10);

    // 2 - create user
    const userModel: UserModel = UserMapper.registerDtoToModel(user);
    await this.userRepository.create(userModel);

    // 3 - create verification code & send email (handled in controller)
    const randomCode: string = this.randomCode();
    await this.verificationRepository.create({
      email: user.email,
      verificationCode: randomCode,
    });

    // 4 - Send verification Email
    this.mailerService.sendVerificationEmail(user.name, user.email, randomCode);

    // 5 - Return verification code dto
    return {
      message:
        'User registered successfully. Please check your email for the verification code.',
    };
  }

  async verify(verification: VerificationDto): Promise<{ message: string }> {
    // 1 - find verification record
    const record = await this.verificationRepository.findByEmail(
      verification.email,
    );
    if (!record || verification.verificationCode !== record.verificationCode) {
      throw new BadRequestException('Invalid verification code or email');
    }

    // 2 - mark user as verified
    const user = await this.userRepository.findByEmail(verification.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userRepository.updateVerificationStatus(
      verification.email,
      true,
    );

    // 3 - delete verification record
    await this.verificationRepository.deleteByEmail(verification.email);

    return { message: 'User verified successfully' };
  }

  async resendVerification(
    resendVerificationCodeDto: ResendVerificationCodeDto,
  ) {
    // 1 - check if user exists
    const user = await this.userRepository.findByEmail(
      resendVerificationCodeDto.email,
    );
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // 2 - generate new verification code
    const newCode = this.randomCode();

    // 3 - update or create verification record
    const existingRecord = await this.verificationRepository.findByEmail(
      resendVerificationCodeDto.email,
    );
    if (existingRecord) {
      await this.verificationRepository.updateCode(
        resendVerificationCodeDto.email,
        newCode,
      );
    } else {
      throw new BadRequestException(
        'No existing verification record found for this email',
      );
    }

    // 4 - get user name
    const userData = await this.userRepository.findByEmail(
      resendVerificationCodeDto.email,
    );
    if (!userData) {
      throw new BadRequestException('User with this email does not exist');
    }

    if (userData.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    // 4 - send verification email
    this.mailerService.sendVerificationEmail(
      userData.name,
      resendVerificationCodeDto.email,
      newCode,
    );

    return { message: 'Verification code resent successfully' };
  }

  // Generate a 6-digit random verification code
  private randomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
