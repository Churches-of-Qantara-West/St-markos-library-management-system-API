import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserRepository } from 'src/shared/repositories/user.repository';

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

  async validate(payload: { email: string }): Promise<{ email: string; userId: string } | null> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user || !user.isVerified || user.id === undefined) {
      return null;
    }
    return { email: user.email, userId: user.id };
  }

  generateToken(payload: { email: string }): string {
    const secret: string = this.configService.get<string>('JWT_SECRET') || '';
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }
}
