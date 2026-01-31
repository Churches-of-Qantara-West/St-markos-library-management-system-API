import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback',
    });
  }

  generateToken(payload: string): string {
    const jwt = require('jsonwebtoken');
    const secret = this.configService.get<string>('JWT_SECRET') || 'fallback';
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }
}