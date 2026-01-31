import { Injectable } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class AuthService {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async login(user: LoginDto): Promise<any> {
    return user;
  }
}