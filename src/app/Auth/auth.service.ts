import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginDto } from "./dto/login.dto";
import { UserRepository } from "src/shared/repositories/user.repository";


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly userRepository: UserRepository,
  ) {}

  async login(user: LoginDto): Promise<any> {
    // 1 - find user by email
    const foundUser = await this.userRepository.findByEmail(user.email); 

    // 2- validate user credentials & verification status
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!foundUser.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    // 3 - generate JWT token
    const token: string = this.jwtStrategy.generateToken(foundUser.email);

    return {
      access_token: token,
    };
  }

}