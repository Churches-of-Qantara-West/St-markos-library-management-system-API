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

  async findByEmail(email: string): Promise<UserModel | null> {
    const userDoc: User | null = await this.userModel.findOne({ email: email }).exec();
    if (!userDoc) {
      return null;
    }
    return this.mapToModel(userDoc);
  }

  async updateVerificationStatus(email: string, isVerified: boolean): Promise<void> {
    await this.userModel.updateOne({ email: email }, { isVerified: isVerified }).exec();
  }

  private mapToModel(userDoc: User): UserModel {
    return {
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      isVerified: userDoc.isVerified,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}
