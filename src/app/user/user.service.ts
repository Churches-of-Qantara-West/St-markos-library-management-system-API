import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../shared/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(phoneNumber: string) {
    return await this.userRepository.findUser(phoneNumber);
  }
}
