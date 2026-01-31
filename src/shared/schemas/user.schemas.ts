import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AutoIncrementID, AutoIncrementIDOptions } from '@typegoose/auto-increment';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User extends Document {
	@Prop({ type: Number, unique: true })
	id: number;

    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;


    @Prop({ default: Date.now })
	createdAt: Date;

	@Prop({ default: Date.now })
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User).index({ id: 1 }, { unique: true });
UserSchema.plugin(AutoIncrementID, { field: 'id', startAt: 1 } as AutoIncrementIDOptions);