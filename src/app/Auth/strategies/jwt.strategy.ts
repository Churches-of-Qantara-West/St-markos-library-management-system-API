import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../shared/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: { phoneNumber: string }): Promise<{ phoneNumber: string; userId: string } | null> {
    const user = await this.userRepository.findByPhoneNumber(payload.phoneNumber);
    if (!user || !user.isVerified || user.id === undefined) {
      return null;
    }
    return { phoneNumber: user.phoneNumber, userId: user.id };
  }

  generateToken(payload: { phoneNumber: string }): string {
    const secret: string = this.configService.get<string>('JWT_SECRET') || '';
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }
}
