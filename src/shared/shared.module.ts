import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
            { 
                name: User.name, 
                schema: UserSchema 
            }
        ]
    )],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class SharedModule {}
