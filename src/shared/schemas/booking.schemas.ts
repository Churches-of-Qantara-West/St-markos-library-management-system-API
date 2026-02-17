import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'books', timestamps: true, versionKey: false })
export class Book extends Document {
  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, unique: true, required: true })
  title: string;

  @Prop({ type: String, required: false })
  subtitle: string;

  @Prop({ type: String, required: true })
  authors: string;

  @Prop({ type: String, required: false })
  translators: string;

  @Prop({ type: String, required: true })
  categories: string;

  @Prop({ type: String, required: false })
  series: string;

  @Prop({ type: String, required: false })
  numberInSeries: string;

  @Prop({ type: String, required: true })
  publishers: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  pages: number;

  @Prop({ type: Number, required: true, default: 1 })
  numberOfCopies: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
