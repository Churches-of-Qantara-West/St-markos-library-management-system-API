import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schemas';
import { AuthUserModel } from '../models/auth-user.model';
import { UserModel } from '../models/user.model';

export class UserRepository {
  constructor(@InjectModel(User.name) private readonly AuthUserModel: Model<User>) {}

  async create(user: AuthUserModel): Promise<AuthUserModel> {
    const createdUser: User | null = await this.AuthUserModel.create(user);
    return this.mapToAAuthModel(createdUser);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<AuthUserModel | null> {
    const userDoc: User | null = await this.AuthUserModel.findOne({ phoneNumber: phoneNumber }).exec();
    if (!userDoc) {
      return null;
    }
    return this.mapToAAuthModel(userDoc);
  }

  async findUser(phoneNumber: string): Promise<UserModel | null> {
    const userDoc: User | null = await this.AuthUserModel.findOne({ phoneNumber: phoneNumber }).exec();
    if (!userDoc) {
      return null;
    }
    return this.mapToUserModel(userDoc);
  }

  async updateVerificationStatus(phoneNumber: string, isVerified: boolean): Promise<void> {
    await this.AuthUserModel.updateOne({ phoneNumber: phoneNumber }, { isVerified: isVerified }).exec();
  }

  private mapToAAuthModel(userDoc: User): AuthUserModel {
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      password: userDoc.password,
      isVerified: userDoc.isVerified,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }

  private mapToUserModel(userDoc: User): UserModel {
    return {
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      isVerified: userDoc.isVerified,
      role: userDoc.role,
    };
  }
}
