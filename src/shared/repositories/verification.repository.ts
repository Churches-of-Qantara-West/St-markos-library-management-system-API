import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification } from '../schemas/verification.schemas';
import { VerificationModel } from '../models/verification.model';

@Injectable()
export class VerificationRepository {
  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<Verification>,
  ) {}

  async create(data: VerificationModel): Promise<VerificationModel> {
    const doc: Verification | null = await this.verificationModel.create(data);
    return this.mapToModel(doc);
  }

  async findByEmail(email: string): Promise<VerificationModel | null> {
    const doc: Verification | null = await this.verificationModel.findOne({ email }).exec();
    return doc ? this.mapToModel(doc) : null;
  }

  async updateCode(email: string, code: string): Promise<VerificationModel | null> {
    const doc: Verification | null = await this.verificationModel
      .findOneAndUpdate({ email }, { verificationCode: code, updatedAt: new Date() }, { new: true })
      .exec();
    return doc ? this.mapToModel(doc) : null;
  }

  async deleteByEmail(email: string): Promise<any> {
    return this.verificationModel.deleteOne({ email }).exec();
  }

  private mapToModel(doc: Verification): VerificationModel {
    return {
      email: doc.email,
      verificationCode: doc.verificationCode,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
