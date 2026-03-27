import { RegisterDto } from 'src/app/Auth/dto/register.dto';
import { AuthUserModel } from '../models/auth-user.model';

export class UserMapper {
  static registerDtoToModel(dto: RegisterDto): AuthUserModel {
    return {
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      password: dto.password,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
