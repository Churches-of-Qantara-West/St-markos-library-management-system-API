import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel } from 'src/shared/models/user.model';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { VerificationRepository } from 'src/shared/repositories/verification.repository';

@Injectable()
export class AuthValidatorService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async validateUserCredentials(user: UserModel | null, password: string): Promise<void> {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified, please verify your email before logging in');
    }
  }

  async validateUserDoesNotExist(email: string): Promise<void> {
    const existingUser: UserModel | null = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
  }

  async validateVerificationCode(email: string, verificationCode: string): Promise<void> {
    const record = await this.verificationRepository.findByEmail(email);
    if (verificationCode !== record?.verificationCode) {
      throw new BadRequestException('Invalid verification code or email');
    }
  }

  async validateUserExists(email: string): Promise<UserModel> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    return user;
  }

  async validateUserNotVerified(user: UserModel): Promise<void> {
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }
  }
}
