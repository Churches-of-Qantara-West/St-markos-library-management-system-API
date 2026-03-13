import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'verifications', timestamps: true })
export class Verification extends Document {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, length: 6 })
  verificationCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
