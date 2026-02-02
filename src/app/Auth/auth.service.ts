import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginDto } from "./dto/login.dto";
import { UserRepository } from "src/shared/repositories/user.repository";
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from "src/shared/mappers/user.mapper";
import { VerificationRepository } from 'src/shared/repositories/verification.repository';
import { UserModel } from 'src/shared/models/user.model';
import { VerificationDto } from './dto/verification.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly userRepository: UserRepository,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async login(user: LoginDto): Promise<{ access_token: string }> {
    // 1 - find user by email
    const foundUser: (UserModel | null) = await this.userRepository.findByEmail(user.email); 

    // 2- validate user credentials & verification status
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!foundUser.isVerified) {
      throw new UnauthorizedException('User is not verified, please verify your email before logging in');
    }

    // 3 - generate JWT token
    const token: string = this.jwtStrategy.generateToken({ email: foundUser.email });

    return {
      access_token: token,
    };
  }


  async register(user: RegisterDto): Promise<VerificationDto> {
    // 1 - check if user already exists
    const existingUser: (UserModel | null) = await this.userRepository.findByEmail(user.email);
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
    this.verificationRepository.create({
      email: user.email,
      verificationCode: randomCode,
    });

    // 4 - Return verification code dto
    return {
      email: user.email,
      verificationCode: randomCode,
    };
  }

  // Generate a 6-digit random verification code
  private randomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

}