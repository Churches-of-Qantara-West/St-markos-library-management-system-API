import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schemas';
import { UserModel } from '../models/user.model';

export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(user: UserModel): Promise<UserModel> {
    const createdUser: User | null = await this.userModel.create(user);
    return this.mapToModel(createdUser);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserModel | null> {
    const userDoc: User | null = await this.userModel.findOne({ phoneNumber: phoneNumber }).exec();
    if (!userDoc) {
      return null;
    }
    return this.mapToModel(userDoc);
  }

  async updateVerificationStatus(phoneNumber: string, isVerified: boolean): Promise<void> {
    await this.userModel.updateOne({ phoneNumber: phoneNumber }, { isVerified: isVerified }).exec();
  }

  private mapToModel(userDoc: User): UserModel {
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      password: userDoc.password,
      isVerified: userDoc.isVerified,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}
