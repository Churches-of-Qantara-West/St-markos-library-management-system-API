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

  async validateUserDoesNotExist(phoneNumber: string): Promise<void> {
    const existingUser: UserModel | null = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }
  }

  async validateVerificationCode(phoneNumber: string, verificationCode: string): Promise<void> {
    const record = await this.verificationRepository.findByPhoneNumber(phoneNumber);
    if (verificationCode !== record?.verificationCode) {
      throw new BadRequestException('Invalid verification code or phone number');
    }
  }

  async validateUserExists(phoneNumber: string): Promise<UserModel> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new BadRequestException('User with this phone number does not exist');
    }
    return user;
  }

  async validateUserNotVerified(user: UserModel): Promise<void> {
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }
  }
}
